import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { artInstituteApi } from '../services/artInstituteApi';
import { europeanaApi } from '../services/europeanaApi';
import { useDebounce } from './useDebounce';
import { matchesEra, matchesSearchQuery, sortBySearchRelevance } from '../utils/filterUtils';

export function useArtworks() {
    // Raw Data State
    const [allArtworks, setAllArtworks] = useState([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ era: '' });

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
        setFilters(f => ({ ...f, era: '' }));
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
                    // Deduplicate by ID
                    const seen = new Set();
                    return combined.filter(item => {
                        if (seen.has(item.id)) return false;
                        seen.add(item.id);
                        return true;
                    });
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

        // Apply era filter first if selected
        if (filters.era) {
            filtered = filtered.filter(artwork => matchesEra(artwork, filters.era));
        }

        // Apply fuzzy search and get instant results sorted by relevance
        if (debouncedQuery.trim()) {
            filtered = filtered
                .filter(artwork => matchesSearchQuery(artwork, debouncedQuery))
                .sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
        }

        return filtered;
    }, [allArtworks, filters, debouncedQuery]);

    const onClearAll = () => {
        setSearchQuery('');
        setFilters({ era: '' });
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
        onClearAll
    };
}