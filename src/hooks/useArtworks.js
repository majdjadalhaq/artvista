/**
 * useArtworks Hook
 * This custom hook manages the logic for searching, filtering, and loading artworks.
 * It's like the brain of our gallery page.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { fetchUnifiedArtworks } from '../services/artworkService'; // We use our new service here.
import { useDebounce } from './useDebounce';
import { matchesEra, matchesSearchQuery, matchesArtist, getEra, parseYear, ERA_CONFIG, extractArtistName } from '../utils/filterUtils';

export function useArtworks() {
    // This holds all the artwork data we have loaded so far.
    const [allArtworks, setAllArtworks] = useState([]);

    // These variables help us control the loading screen and error messages.
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // This tracks what the user is typing and what filters they selected.
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ era: '', artist: '' });

    // We keep track of which page of results we are on.
    const [apiPage, setApiPage] = useState(1);

    // We wait a tiny bit after the user stops typing before we search (debouncing).
    const debouncedQuery = useDebounce(searchQuery, 300);

    // These references help us manage the API calls without causing infinite loops.
    const abortControllerRef = useRef(null);
    const hasInitialized = useRef(false);
    const apiPageRef = useRef(1);

    /**
     * 1. Reset everything when the search changes.
     * We want a fresh start whenever the user types something new.
     */
    useEffect(() => {
        setAllArtworks([]);
        setApiPage(1);
        apiPageRef.current = 1;
        setHasMore(true);
        setError(null);
        setFilters(f => ({ ...f, era: '', artist: '' }));
        hasInitialized.current = false;
    }, [debouncedQuery]);

    /**
     * 2. The main function to load more artworks.
     * Use this when the user scrolls down to the bottom.
     */
    const fetchNextBatch = useCallback(async () => {
        if (loading) return; // If we are already loading, we don't start again.

        // If there was an old request running, we cancel it to save data.
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const currentPage = apiPageRef.current;

            // We use our new service to get the data. it handles the complex stuff.
            const validItems = await fetchUnifiedArtworks({
                query: debouncedQuery,
                page: currentPage,
                signal: controller.signal
            });

            if (controller.signal.aborted) return;

            // We add the new items to our list.
            if (validItems.length > 0) {
                setAllArtworks(prev => {
                    const combined = [...prev, ...validItems];

                    // We remove any duplicates just in case (same art showing up twice).
                    const seen = new Set();
                    const deduped = [];
                    for (const item of combined) {
                        if (!seen.has(item.id)) {
                            seen.add(item.id);
                            deduped.push(item);
                        }
                    }

                    // We only keep the last 200 items so the browser doesn't get slow.
                    const WINDOW_SIZE = 200;
                    return deduped.length > WINDOW_SIZE ? deduped.slice(-WINDOW_SIZE) : deduped;
                });
            }

            // We prepare for the next page of results.
            apiPageRef.current = currentPage + 1;
            setApiPage(currentPage + 1);

        } catch (err) {
            // We ignore errors if they happened because we cancelled the request on purpose.
            if (err.name !== 'AbortError') {
                console.error("Fetch error:", err);
                setError(err.message);
            }
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, [loading, debouncedQuery]);

    /**
     * Initial Load.
     * We trigger the first load automatically when the app starts or search changes.
     */
    useEffect(() => {
        if (!hasInitialized.current && allArtworks.length === 0) {
            hasInitialized.current = true;
            fetchNextBatch();
        }
    }, [debouncedQuery]);

    /**
     * Client-Side Filter.
     * We filter the list of artworks based on the dropdowns the user selected.
     */
    const filteredArtworks = useMemo(() => {
        let filtered = allArtworks;

        if (filters.era) {
            filtered = filtered.filter(artwork => matchesEra(artwork, filters.era));
        }
        if (filters.artist) {
            filtered = filtered.filter(artwork => matchesArtist(artwork, filters.artist));
        }

        // We also do a quick text search on the results we already have.
        if (debouncedQuery.trim()) {
            filtered = filtered
                .filter(artwork => matchesSearchQuery(artwork, debouncedQuery))
                .sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
        }

        return filtered;
    }, [allArtworks, filters, debouncedQuery]);

    /**
     * Calculate Facets.
     * We figure out which artists and eras are available in the current results.
     * This updates the dropdown menus dynamically.
     */
    const facets = useMemo(() => {
        let searchMatched = allArtworks;
        if (debouncedQuery.trim()) {
            searchMatched = searchMatched
                .filter(artwork => matchesSearchQuery(artwork, debouncedQuery));
        }

        // 1. Calculate available Artists
        let artistBase = searchMatched;
        if (filters.era) {
            artistBase = artistBase.filter(artwork => matchesEra(artwork, filters.era));
        }

        const artistCounts = {};
        artistBase.forEach(art => {
            if (art.artist) {
                const name = extractArtistName(art.artist);
                if (name && !name.toLowerCase().includes('unknown')) {
                    artistCounts[name] = (artistCounts[name] || 0) + 1;
                }
            }
        });

        const artists = Object.entries(artistCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

        // 2. Calculate available Eras
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
        hasMore: true, // We always allow infinite scrolling.
        loadMore: fetchNextBatch,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        onClearAll,
        facets
    };
}