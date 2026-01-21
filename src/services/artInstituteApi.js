/**
 * Art Institute of Chicago API Service
 * We use this file to talk to the Chicago museum's database.
 */

import { fetchWithRetry } from '../utils/apiHelpers';

const AIC_BASE = "https://api.artic.edu/api/v1/artworks";

/**
 * Turns the raw data from the API into a clean object our app can use easily.
 */
export const normalizeAIC = (item) => ({
    id: `artic_${item.id}`,
    title: item.title || "Untitled",
    artist: item.artist_display || "Unknown Artist",
    year: item.date_display || "Unknown",
    medium: item.medium_display || "Unknown",
    origin: item.place_of_origin || "Unknown",
    // We try to get the best image available.
    imageUrl: item.image_id
        ? `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`
        : null,
    image_small: item.image_id
        ? `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`
        : null,
    image_large: item.image_id
        ? `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`
        : null,
    description: item.description || item.thumbnail?.alt_text || null,
    source: 'artic'
});

/**
 * Searches for artworks or gets a list of them.
 * 
 * @param {string} query - What the user typed in the search bar.
 * @param {object} options - Extra settings like page number and signal cancellation.
 */
export const searchArtic = async (query, { signal, page = 1, limit = 20 } = {}) => {
    try {
        // We set up the settings for our request here.
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            // We tell the API exactly which fields we want to make the download faster.
            fields: "id,title,artist_display,date_display,medium_display,place_of_origin,image_id,description,thumbnail",
        });

        let endpoint = `${AIC_BASE}/search`;

        // If the user typed something, we search for it.
        if (query) {
            params.append('q', query);
        } else {
            // If the user didn't type anything, we just ask for "art" to show them something nice.
            params.append('q', "art");
            params.append('query[term][is_public_domain]', 'true');
        }

        // We use our helper to fetch the data safely.
        const response = await fetchWithRetry(`${endpoint}?${params.toString()}`, {
            method: 'GET',
            signal
        });

        const json = await response.json();

        return {
            data: (json.data || []).map(normalizeAIC),
            totalCount: json.pagination?.total || 0,
            totalPages: json.pagination?.total_pages || 0
        };
    } catch (error) {
        // If the user cancelled the request (like typing fast), we just exit quietly.
        if (error.name === 'AbortError') throw error;

        console.warn("AIC fetch failed:", error);
        // We return an empty list so the app doesn't crash if this API fails.
        return { data: [], totalCount: 0, totalPages: 0, error: error.message };
    }
};

// We keep this object for backward compatibility with older code.
export const artInstituteApi = {
    search: (params) => searchArtic(params.q, { signal: params.signal, page: params.page, limit: params.limit }),
};
