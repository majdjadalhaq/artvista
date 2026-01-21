/**
 * Europeana API Service
 * We use this file to talk to the European cultural heritage database.
 */

import { fetchWithRetry } from '../utils/apiHelpers';

const EUROPEANA_BASE = "https://api.europeana.eu/record/v2/search.json";
// We check if the API key is in our environment variables. If not, we use a demo key.
const API_KEY = import.meta.env.VITE_EUROPEANA_API_KEY || "api2demo";

/**
 * Normalizes Europeana data into a clean object.
 * This API often returns data in arrays (like ["Title"]), so we pick the first one.
 */
export const normalizeEuropeana = (item) => {
    const title = Array.isArray(item.title) ? item.title[0] : (item.title || "Untitled");
    let artist = Array.isArray(item.dcCreator) ? item.dcCreator[0] : "Unknown Artist";

    // Sanitize: If the artist name is actually a URL (common in Europeana data), fallback to "Unknown"
    if (artist && (artist.startsWith('http') || artist.includes('://') || artist.includes('www.'))) {
        artist = "Unknown Artist";
    }

    // We try to find a year from different possible fields.
    let year = "Unknown";
    if (item.year && item.year[0]) year = item.year[0];
    else if (item.edmTimespanLabel && item.edmTimespanLabel[0]) year = item.edmTimespanLabel[0];

    // We pick the best images available.
    const image = Array.isArray(item.edmPreview) ? item.edmPreview[0] : (item.edmPreview || null);
    const largeImage = Array.isArray(item.aggregation_edm_isShownBy) ? item.aggregation_edm_isShownBy[0] : image;
    const finalImage = largeImage || image || null;

    // We make the ID safe to use in a URL.
    const safeId = encodeURIComponent(item.id);

    return {
        id: `europeana_${safeId}`,
        title: typeof title === 'string' ? title : (title ? String(title) : 'Untitled'),
        artist: typeof artist === 'string' ? artist : (artist ? String(artist) : 'Unknown Artist'),
        year: typeof year === 'string' ? year : (year ? String(year) : 'Unknown'),
        medium: Array.isArray(item.type) ? (typeof item.type[0] === 'string' ? item.type[0] : (item.type[0] ? String(item.type[0]) : 'Unknown')) : (typeof item.type === 'string' ? item.type : (item.type ? String(item.type) : 'Unknown')),
        origin: Array.isArray(item.country) ? (typeof item.country[0] === 'string' ? item.country[0] : (item.country[0] ? String(item.country[0]) : 'Unknown')) : (typeof item.country === 'string' ? item.country : (item.country ? String(item.country) : 'Unknown')),
        imageUrl: finalImage,
        image_small: image,
        image_large: largeImage,
        description: Array.isArray(item.dcDescription) ? (typeof item.dcDescription[0] === 'string' ? item.dcDescription[0] : (item.dcDescription[0] ? String(item.dcDescription[0]) : null)) : (typeof item.dcDescription === 'string' ? item.dcDescription : (item.dcDescription ? String(item.dcDescription) : null)),
        source: 'europeana'
    };
};

/**
 * Searches the Europeana database.
 * 
 * @param {string} query - The search term.
 * @param {object} options - Page number, limit, and cancellation signal.
 */
export const searchEuropeana = async (query, { signal, page = 1, rows = 20 } = {}) => {
    // If we don't have a working key, we just return empty results instead of crashing.
    if (!API_KEY) {
        console.warn("Europeana API Key missing. Skipping.");
        return { data: [], totalCount: 0 };
    }

    try {
        const start = (page - 1) * rows + 1;

        // If the user didn't type anything, we default to searching for "art".
        const finalQuery = query || "art";

        const queryParams = new URLSearchParams({
            wskey: API_KEY,
            query: finalQuery,
            reusability: "open",
            media: "true",
            qf: "TYPE:IMAGE",
            rows: rows.toString(),
            start: start.toString(),
            profile: "rich"
        });

        const response = await fetchWithRetry(`${EUROPEANA_BASE}?${queryParams.toString()}`, {
            method: 'GET',
            signal
        });

        const json = await response.json();

        if (!json.items) {
            return { data: [], totalCount: 0 };
        }

        return {
            data: json.items.map(normalizeEuropeana),
            totalCount: json.totalResults || 0
        };

    } catch (error) {
        if (error.name === 'AbortError') throw error;
        console.warn("Europeana fetch failed:", error.message);
        // We catch errors here so the app keeps running even if one API fails.
        return { data: [], totalCount: 0, error: error.message };
    }
};

// We keep this object for backward compatibility.
export const europeanaApi = {
    search: (params) => searchEuropeana(params.q, { signal: params.signal, page: params.page, rows: params.limit }),
};
