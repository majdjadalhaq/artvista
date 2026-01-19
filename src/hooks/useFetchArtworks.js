import { useState, useEffect } from 'react';
import { fetchArtworks } from '../services/artInstituteAPI';
import { normalizeArtworks } from '../utils/artworkNormalizer';

/**
 * Custom hook to fetch and manage artwork data
 * Handles loading states, errors, and pagination
 * 
 * @param {Object} filters - Filter parameters
 * @param {string} filters.query - Search query
 * @param {number} filters.page - Page number
 * @param {number} filters.limit - Items per page
 * @returns {Object} { artworks, loading, error, pagination }
 */
function useFetchArtworks(filters = {}) {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 20
    });

    const { query = '', page = 1, limit = 20 } = filters;

    useEffect(() => {
        let isMounted = true;

        async function loadArtworks() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetchArtworks({ query, page, limit });

                if (isMounted) {
                    // Normalize the artwork data
                    const normalized = normalizeArtworks(response.data);
                    setArtworks(normalized);

                    // Update pagination info
                    setPagination({
                        total: response.pagination?.total || 0,
                        totalPages: response.pagination?.total_pages || 0,
                        currentPage: response.pagination?.current_page || page,
                        limit: response.pagination?.limit || limit
                    });
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Failed to fetch artworks');
                    setArtworks([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadArtworks();

        // Cleanup function to prevent state updates on unmounted component
        return () => {
            isMounted = false;
        };
    }, [query, page, limit]);

    return { artworks, loading, error, pagination };
}

export default useFetchArtworks;
