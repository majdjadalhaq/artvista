/**
 * Art Institute of Chicago API Service
 * Documentation: https://api.artic.edu/docs/
 */

const BASE_URL = 'https://api.artic.edu/api/v1';

/**
 * Fetch artworks with optional filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 20)
 * @param {string} params.query - Search query
 * @returns {Promise<Object>} API response with artworks data
 */
export async function fetchArtworks({ page = 1, limit = 20, query = '' } = {}) {
    try {
        let url = `${BASE_URL}/artworks?page=${page}&limit=${limit}`;

        // Add search query if provided
        if (query) {
            url += `&q=${encodeURIComponent(query)}`;
        }

        // Request specific fields to reduce payload size
        const fields = [
            'id',
            'title',
            'artist_display',
            'date_display',
            'medium_display',
            'image_id',
            'thumbnail',
            'description',
            'dimensions',
            'place_of_origin',
            'artwork_type_title',
            'style_title',
            'classification_title'
        ].join(',');

        url += `&fields=${fields}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching artworks:', error);
        throw error;
    }
}

/**
 * Fetch a single artwork by ID
 * @param {number} id - Artwork ID
 * @returns {Promise<Object>} Artwork data
 */
export async function fetchArtworkById(id) {
    try {
        const url = `${BASE_URL}/artworks/${id}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching artwork ${id}:`, error);
        throw error;
    }
}

/**
 * Search artworks by keyword
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} Search results
 */
export async function searchArtworks(query, page = 1, limit = 20) {
    return fetchArtworks({ query, page, limit });
}

/**
 * Get image URL for an artwork
 * @param {string} imageId - Image ID from artwork data
 * @param {string} size - Image size (default: '843' for medium)
 * @returns {string} Full image URL
 */
export function getImageUrl(imageId, size = '843') {
    if (!imageId) return null;
    return `https://www.artic.edu/iiif/2/${imageId}/full/${size},/0/default.jpg`;
}
