/**
 * Art Institute of Chicago API Service
 * Robust implementation with retries, abort signal support, and data normalization.
 */

const AIC_BASE = "https://api.artic.edu/api/v1/artworks";

// Helper: Exponential Backoff Retry Fetch
const fetchWithRetry = async (url, options = {}, retries = 2, delay = 1000) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            // If 404 or 400 (Client), don't retry. Only retry 5xx or network errors.
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

export const normalizeAIC = (item) => ({
    id: `artic_${item.id}`,
    title: item.title || "Untitled",
    artist: item.artist_display || "Unknown Artist",
    year: item.date_display || "Unknown",
    medium: item.medium_display || "Unknown",
    origin: item.place_of_origin || "Unknown",
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

export const searchArtic = async (query, { signal, page = 1, limit = 20 } = {}) => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            fields: "id,title,artist_display,date_display,medium_display,place_of_origin,image_id,description,thumbnail",
        });

        // If query is present, usage /search, else simple list
        let endpoint = `${AIC_BASE}/search`;
        if (query) {
            params.append('q', query);
        } else {
            // Default "curated" query if empty
            params.append('q', "art");
            params.append('query[term][is_public_domain]', 'true');
        }

        const response = await fetchWithRetry(`${endpoint}?${params.toString()}`, { signal });
        const json = await response.json();

        return {
            data: (json.data || []).map(normalizeAIC),
            totalCount: json.pagination?.total || 0,
            totalPages: json.pagination?.total_pages || 0
        };
    } catch (error) {
        if (error.name === 'AbortError') throw error;
        console.warn("AIC fetch failed:", error);
        // Fail softly for robust parallel fetching (allow other API to succeed)
        return { data: [], totalCount: 0, totalPages: 0, error: error.message };
    }
};

/**
 * Legacy/Compat exports if needed for existing components not yet updated.
 * It's safer to keep these until full migration.
 */
export const artInstituteApi = {
    search: (params) => searchArtic(params.q, { signal: params.signal, page: params.page, limit: params.limit }),
    // ... support other existing methods if needed or refactor strictly
};
