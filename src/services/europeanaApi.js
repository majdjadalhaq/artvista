/**
 * Europeana API Service
 * Robust implementation with retries, abort signal support, and data normalization.
 */

const EUROPEANA_BASE = "https://api.europeana.eu/record/v2/search.json";
// Use Env variable, fallback to demo key if missing (as per plan/requirements)
const API_KEY = import.meta.env.VITE_EUROPEANA_API_KEY || "api2demo";

// Helper: Exponential Backoff Retry Fetch (Duplicated for isolation or could be shared util)
const fetchWithRetry = async (url, options = {}, retries = 2, delay = 1000) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            // Client errors (4xx) shouldn't be retried usually, except maybe 429
            if (response.status < 500 && response.status !== 429) {
                throw new Error(`Client Error: ${response.status}`);
            }
            throw new Error(`Server Error: ${response.status}`);
        }
        return response;
    } catch (error) {
        if (retries > 0 && error.name !== 'AbortError') {
            await new Promise(res => setTimeout(res, delay));
            return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
        throw error;
    }
};

export const normalizeEuropeana = (item) => {
    // Europeana returns arrays for most fields
    const title = Array.isArray(item.title) ? item.title[0] : (item.title || "Untitled");
    const artist = Array.isArray(item.dcCreator) ? item.dcCreator[0] : "Unknown Artist";
    // Normalize Year
    let year = "Unknown";
    if (item.year && item.year[0]) year = item.year[0];
    else if (item.edmTimespanLabel && item.edmTimespanLabel[0]) year = item.edmTimespanLabel[0];

    // Image handling: edmPreview is thumbnail, aggregation_edm_isShownBy is larger
    const image = Array.isArray(item.edmPreview) ? item.edmPreview[0] : (item.edmPreview || null);
    const largeImage = Array.isArray(item.aggregation_edm_isShownBy) ? item.aggregation_edm_isShownBy[0] : image;
    const finalImage = largeImage || image || null;

    // Safety: Encode ID to avoid routing issues with slashes in ID
    const safeId = encodeURIComponent(item.id);

    return {
        id: `europeana_${safeId}`,
        title: title,
        artist: artist,
        year: year,
        medium: Array.isArray(item.type) ? item.type[0] : (item.type || "Unknown"), // Usually IMAGE, TEXT etc.
        origin: Array.isArray(item.country) ? item.country[0] : "Unknown",
        imageUrl: finalImage,
        image_small: image,
        image_large: largeImage,
        description: Array.isArray(item.dcDescription) ? item.dcDescription[0] : null,
        source: 'europeana'
    };
};

export const searchEuropeana = async (query, { signal, page = 1, rows = 20 } = {}) => {
    // If no API Key is configured/working, return empty gracefull (Requirement #1 Error Handling)
    if (!API_KEY) {
        console.warn("Europeana API Key missing. Skipping.");
        return { data: [], totalCount: 0 };
    }

    try {
        const start = (page - 1) * rows + 1;

        // Construct Query
        // Europeana syntax: "what:painting AND who:rembrandt"
        // If simple keyword, just q
        const finalQuery = query || "art"; // Default to art if empty

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

        const response = await fetchWithRetry(`${EUROPEANA_BASE}?${queryParams.toString()}`, { signal });
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
        // Fail softly
        return { data: [], totalCount: 0, error: error.message };
    }
};

export const europeanaApi = {
    search: (params) => searchEuropeana(params.q, { signal: params.signal, page: params.page, rows: params.limit }),
    // ... compat methods
};
