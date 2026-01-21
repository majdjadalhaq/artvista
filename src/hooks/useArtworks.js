import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { artInstituteApi } from '../services/artInstituteApi';
import { europeanaApi } from '../services/europeanaApi';
import { useDebounce } from './useDebounce';
import { matchesArtist, matchesEra, normalizeString } from '../utils/filterUtils';

export function useArtworks() {
    // Raw Data State (Server Response)
    const [allArtworks, setAllArtworks] = useState([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ artist: '', era: '' }); // 'medium' removed

    // Pagination
    const [page, setPage] = useState(1);

    // Debounce Search - Only this triggers API refetch
    const debouncedQuery = useDebounce(searchQuery, 300);

    // Abort Controller
    const abortControllerRef = useRef(null);

    // 1. Reset RAW data when SEARCH query changes (Server-side)
    useEffect(() => {
        setAllArtworks([]);
        setPage(1);
        setHasMore(true);
        setError(null);
    }, [debouncedQuery]);

    // 2. MAIN FETCH (Server-Side Search)
    const fetchArtworks = useCallback(async () => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            // Only pass 'q' and 'page'. Filters are client-side now.
            const params = {
                q: debouncedQuery,
                page: page,
                limit: 20,
            };

            const results = await Promise.allSettled([
                artInstituteApi.search(params.q, { signal: controller.signal, page: params.page, limit: params.limit }),
                europeanaApi.search(params.q, { signal: controller.signal, page: params.page, rows: params.limit })
            ]);

            if (controller.signal.aborted) return;

            const aicResult = results[0].status === 'fulfilled' ? results[0].value : { data: [] };
            const euroResult = results[1].status === 'fulfilled' ? results[1].value : { data: [] };

            const newFetched = [
                ...(aicResult.data || []),
                ...(euroResult.data || [])
            ];

            // Append to RAW list
            setAllArtworks(prev => {
                const combined = [...prev, ...newFetched];
                // Deduplicate by ID
                const seen = new Set();
                return combined.filter(item => {
                    if (seen.has(item.id)) return false;
                    seen.add(item.id);
                    return true;
                });
            });

            if (aicResult.data.length === 0 && euroResult.data.length === 0) {
                setHasMore(false);
            }

        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Fetch error:", err);
                setError(err.message);
            }
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, [debouncedQuery, page]);

    // Trigger Fetch
    useEffect(() => {
        fetchArtworks();
        return () => abortControllerRef.current?.abort();
    }, [fetchArtworks]);

    // 3. CLIENT-SIDE FILTERING (Refine Logic)
    // Filter the RAW filteredArtworks based on selected Artist/Era
    const filteredArtworks = useMemo(() => {
        return allArtworks.filter(artwork => {
            const matchesA = matchesArtist(artwork, filters.artist);
            const matchesE = matchesEra(artwork, filters.era);
            return matchesA && matchesE;
        });
    }, [allArtworks, filters]);

    // 4. DYNAMIC ARTIST LIST (Facets)
    // Derived from the RAW (search-filtered) data, NOT the fully filtered data
    // This allows users to see available artists for their search even if they select one.
    const availableArtists = useMemo(() => {
        const artists = new Set();
        allArtworks.forEach(art => {
            if (art.artist) artists.add(art.artist);
        });
        return Array.from(artists).sort(); // Alphabetical
    }, [allArtworks]);

    const loadMore = () => {
        if (!loading && hasMore) setPage(prev => prev + 1);
    };

    const onClearAll = () => {
        setSearchQuery('');
        setFilters({ artist: '', era: '' });
    };

    return {
        artworks: filteredArtworks, // Return processed list
        loading,
        error,
        hasMore,
        loadMore,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters, // Expose raw setter
        updateFilter: (key, val) => setFilters(p => ({ ...p, [key]: val })),
        onClearAll,
        availableArtists // Use this in UI
    };
}
