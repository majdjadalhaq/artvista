import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { artInstituteApi } from '../services/artInstituteApi';
import { europeanaApi } from '../services/europeanaApi';
import { useDebounce } from './useDebounce';
import { matchesEra, matchesSearchQuery, sortBySearchRelevance, matchesArtist, getEra, parseYear, ERA_CONFIG } from '../utils/filterUtils';

export function useArtworks() {
    // Raw Data State
    const [allArtworks, setAllArtworks] = useState([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ era: '', artist: '' });

    // Track API Page separately
    const [apiPage, setApiPage] = useState(1);

    // Debounce Search
    const debouncedQuery = useDebounce(searchQuery, 300);
    const abortControllerRef = useRef(null);
    const hasInitialized = useRef(false);
    const apiPageRef = useRef(1);

    // 1. Reset on Search Change
    useEffect(() => {
        setAllArtworks([]);
        setApiPage(1);
        apiPageRef.current = 1;
        setHasMore(true);
        setError(null);
        setFilters(f => ({ ...f, era: '', artist: '' }));
        hasInitialized.current = false;
    }, [debouncedQuery]);

    // 2. CONTINUOUS FETCH - Always fetch and add artworks, NEVER stop infinite scroll
    const fetchNextBatch = useCallback(async () => {
        if (loading) return; // Only prevent if currently loading

        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const currentPage = apiPageRef.current;

            // For diverse random feed when no search query, use varied terms
            let queryToUse = debouncedQuery;
            if (!debouncedQuery) {
                // Rotate through diverse art-related terms for variety
                const diverseTerms = ['painting', 'sculpture', 'portrait', 'landscape', 'modern art', 'abstract', 'impressionism', 'renaissance', 'baroque', 'cubism', 'expressionism', 'realism', 'watercolor', 'digital art', 'photography', 'installation', 'drawing', 'printmaking', 'textile', 'decorative arts', 'architecture', 'still life', 'mythology', 'historical', 'figurative', 'contemporary'];
                const termIndex = (currentPage - 1) % diverseTerms.length;
                queryToUse = diverseTerms[termIndex];
            }

            const params = { q: queryToUse, page: currentPage, limit: 50, signal: controller.signal };

            // Fetch from both APIs in parallel
            const results = await Promise.allSettled([
                artInstituteApi.search(params),
                europeanaApi.search(params)
            ]);

            if (controller.signal.aborted) return;

            const aicResult = results[0].status === 'fulfilled' ? results[0].value : { data: [] };
            const euroResult = results[1].status === 'fulfilled' ? results[1].value : { data: [] };

            if (results[0].status === 'rejected') {
                console.warn('AIC API error:', results[0].reason?.message || results[0].reason);
            }
            if (results[1].status === 'rejected') {
                console.warn('Europeana API error:', results[1].reason?.message || results[1].reason);
            }

            const rawData = [...(aicResult.data || []), ...(euroResult.data || [])];

            // FILTER: Only keep items with images
            const validItems = rawData.filter(art =>
                art.imageUrl || art.image_large || art.image_small || art.image
            );

            // Add valid items to state and continue loading
            if (validItems.length > 0) {
                setAllArtworks(prev => {
                    const combined = [...prev, ...validItems];
                    // Deduplicate by ID while preserving order
                    const seen = new Set();
                    const deduped = [];
                    for (const item of combined) {
                        if (!seen.has(item.id)) {
                            seen.add(item.id);
                            deduped.push(item);
                        }
                    }
                    // Sliding window: keep only last N items to bound memory/render cost
                    const WINDOW_SIZE = 200;
                    return deduped.length > WINDOW_SIZE ? deduped.slice(-WINDOW_SIZE) : deduped;
                });
            }

            // ALWAYS increment page - we keep loading forever
            apiPageRef.current = currentPage + 1;
            setApiPage(currentPage + 1);
            // hasMore is always true - infinite scroll never stops

        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Fetch error:", err);
                setError(err.message);
            }
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, [loading, debouncedQuery]);

    // Initial Load - Trigger only once when debouncedQuery changes
    useEffect(() => {
        if (!hasInitialized.current && allArtworks.length === 0) {
            hasInitialized.current = true;
            fetchNextBatch();
        }
    }, [debouncedQuery]);

    // Client-Side Filter (Era + Fuzzy Search with ranking)
    const filteredArtworks = useMemo(() => {
        let filtered = allArtworks;

        // Apply filters
        if (filters.era) {
            filtered = filtered.filter(artwork => matchesEra(artwork, filters.era));
        }
        if (filters.artist) {
            filtered = filtered.filter(artwork => matchesArtist(artwork, filters.artist));
        }

        // Apply fuzzy search and get instant results sorted by relevance
        if (debouncedQuery.trim()) {
            filtered = filtered
                .filter(artwork => matchesSearchQuery(artwork, debouncedQuery))
                .sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
        }

        return filtered;
    }, [allArtworks, filters, debouncedQuery]);

    // Calculate Dynamic Facets
    const facets = useMemo(() => {
        // Base: items matching search query
        let searchMatched = allArtworks;
        if (debouncedQuery.trim()) {
            searchMatched = searchMatched
                .filter(artwork => matchesSearchQuery(artwork, debouncedQuery));
        }

        // 1. Calculate Artist Facets (compatible with current Era selection)
        // We want to show artists that exist within the currently selected Era (if any)
        // Check if we should filter by Era for the artist list? 
        // Typically, yes. "Show artists available in Renaissance"
        let artistBase = searchMatched;
        if (filters.era) {
            artistBase = artistBase.filter(artwork => matchesEra(artwork, filters.era));
        }

        const artistCounts = {};
        artistBase.forEach(art => {
            if (art.artist) {
                const name = art.artist; // We could normalize, but display needs original. 
                // Group by normalized name to avoid dupes? 
                // For now, simple grouping. The data might have variations.
                artistCounts[name] = (artistCounts[name] || 0) + 1;
            }
        });

        // Sort artists by count desc, then alpha
        const artists = Object.entries(artistCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

        // 2. Calculate Era Facets (compatible with current Artist selection)
        // We want to show Eras that exist for the currently selected Artist (if any)
        let eraBase = searchMatched;
        if (filters.artist) {
            eraBase = eraBase.filter(artwork => matchesArtist(artwork, filters.artist));
        }

        const availableEras = new Set();
        eraBase.forEach(art => {
            const year = parseYear(art.year || art.date_display || art.date);
            if (year !== null) {
                const era = getEra(year);
                if (era) availableEras.add(era);
            }
        });

        // Return list of available Era keys
        const eras = Object.keys(ERA_CONFIG).filter(key => availableEras.has(key));

        return { artists, eras };
    }, [allArtworks, debouncedQuery, filters.era, filters.artist]);

    const onClearAll = () => {
        setSearchQuery('');
        setFilters({ era: '', artist: '' });
    };

    return {
        artworks: filteredArtworks,
        loading,
        error,
        hasMore: true, // Always true - infinite scroll never stops
        loadMore: fetchNextBatch,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        onClearAll,
        facets
    };
}