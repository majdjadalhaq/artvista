import { useState, useEffect, useCallback, useRef } from 'react';

const AIC_BASE = "https://api.artic.edu/api/v1/artworks";

// Shared internal format normalizer
const normalizeAIC = (item) => ({
    id: `aic-${item.id}`,
    title: item.title || "Untitled",
    artist: item.artist_display || "Unknown Artist",
    year: item.date_display || "Unknown Date",
    // Optimized images for different contexts
    image_small: item.image_id
        ? `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`
        : null,
    image_large: item.image_id
        ? `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`
        : null,
    // Fallback for backward compatibility
    image: item.image_id
        ? `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`
        : null,
    thumbnail: item.thumbnail?.lqip || null,
    source: 'Art Institute of Chicago',
    description: item.thumbnail?.alt_text || item.medium_display || "No details available.",
    raw: item
});

export const useArtData = (searchParams = {}, options = { page: 1, limit: 20 }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortController = useRef(null);

    // Handle both string (legacy) and object inputs for searchParams
    const queryObj = typeof searchParams === 'string' ? { q: searchParams } : searchParams;
    const { q = "", artist = "", era = "" } = queryObj;

    const fetchData = useCallback(async () => {
        // Cancel previous request
        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();

        setLoading(true);
        setError(null);

        try {
            // Build complex search query
            const params = new URLSearchParams({
                page: options.page,
                limit: options.limit,
                fields: "id,title,artist_display,date_display,image_id,thumbnail,medium_display,place_of_origin,style_title",
            });

            // Construct the 'q' parameter based on all filters
            let searchQueryParts = [];
            if (q) searchQueryParts.push(q);
            if (artist) searchQueryParts.push(`artist_title:${artist}`);
            if (era) searchQueryParts.push(`style_title:${era}`);

            const finalQuery = searchQueryParts.join(" ");

            const endpoint = `${AIC_BASE}/search`;
            if (finalQuery) {
                params.append('q', finalQuery);
            } else {
                // Default curated view if no search
                params.append('q', "masterpiece");
                params.append('query[term][is_public_domain]', 'true');
            }

            const response = await fetch(`${endpoint}?${params.toString()}`, {
                signal: abortController.current.signal
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const result = await response.json();

            // Normalize and filtering
            const validArt = (result.data || [])
                .map(normalizeAIC)
                .filter(art => art.image_small); // Ensure valid images

            setData(validArt);

        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error("Fetch error:", err);
            setError(err.message);
            setData([]);
        } finally {
            if (!abortController.current?.signal.aborted) {
                setLoading(false);
            }
        }
    }, [q, artist, era, options.page, options.limit]);

    useEffect(() => {
        fetchData();
        return () => {
            if (abortController.current) abortController.current.abort();
        };
    }, [fetchData]);

    return { start: fetchData, data, loading, error };
};
