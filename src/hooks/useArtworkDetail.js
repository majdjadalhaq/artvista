import { useState, useEffect } from 'react';
import { fetchArtworkById } from '../services/artInstituteAPI';
import { normalizeArtInstitute } from '../utils/artworkNormalizer';

/**
 * Custom hook to fetch a single artwork by ID
 * Handles loading states and errors
 * 
 * @param {number|string} artworkId - Artwork ID to fetch
 * @returns {Object} { artwork, loading, error }
 */
function useArtworkDetail(artworkId) {
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Don't fetch if no ID provided
        if (!artworkId) {
            setLoading(false);
            return;
        }

        let isMounted = true;

        async function loadArtwork() {
            try {
                setLoading(true);
                setError(null);

                const data = await fetchArtworkById(artworkId);

                if (isMounted) {
                    // Normalize the artwork data
                    const normalized = normalizeArtInstitute(data);
                    setArtwork(normalized);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Failed to fetch artwork details');
                    setArtwork(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadArtwork();

        // Cleanup function to prevent state updates on unmounted component
        return () => {
            isMounted = false;
        };
    }, [artworkId]);

    return { artwork, loading, error };
}

export default useArtworkDetail;
