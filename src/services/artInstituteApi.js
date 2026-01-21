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
    title: typeof item.title === 'string' ? item.title : (item.title ? String(item.title) : "Untitled"),
    artist: typeof item.artist_display === 'string' ? item.artist_display : (item.artist_display ? String(item.artist_display) : "Unknown Artist"),
    year: typeof item.date_display === 'string' ? item.date_display : (item.date_display ? String(item.date_display) : "Unknown"),
    medium: typeof item.medium_display === 'string' ? item.medium_display : (item.medium_display ? String(item.medium_display) : "Unknown"),
    origin: typeof item.place_of_origin === 'string' ? item.place_of_origin : (item.place_of_origin ? String(item.place_of_origin) : "Unknown"),
    imageUrl: item.image_id
        ? `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`
        : null,
    image_small: item.image_id
        ? `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`
        : null,
    image_large: item.image_id
        ? `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`
        : null,
    description: typeof item.description === 'string' ? item.description : (item.thumbnail?.alt_text ? String(item.thumbnail.alt_text) : null),
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
        }

        // Always filter for public domain images to ensure we can display them (fixes 403 errors)
        params.append('query[term][is_public_domain]', 'true');

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
