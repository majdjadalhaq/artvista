import { getImageUrl } from '../services/artInstituteAPI';

/**
 * Normalize Art Institute of Chicago artwork data
 * Converts API response to consistent internal format
 * @param {Object} artwork - Raw artwork data from API
 * @returns {Object} Normalized artwork object
 */
export function normalizeArtInstitute(artwork) {
    return {
        id: artwork.id,
        title: artwork.title || 'Untitled',
        artist: artwork.artist_display || 'Unknown Artist',
        date: artwork.date_display || 'Date unknown',
        medium: artwork.medium_display || 'Medium not specified',
        imageUrl: artwork.image_id ? getImageUrl(artwork.image_id) : null,
        thumbnailUrl: artwork.thumbnail?.lqip || null,
        description: artwork.description || null,
        dimensions: artwork.dimensions || null,
        placeOfOrigin: artwork.place_of_origin || null,
        artworkType: artwork.artwork_type_title || null,
        style: artwork.style_title || null,
        classification: artwork.classification_title || null,
        source: 'Art Institute of Chicago'
    };
}

/**
 * Normalize an array of artworks
 * @param {Array} artworks - Array of raw artwork data
 * @returns {Array} Array of normalized artworks
 */
export function normalizeArtworks(artworks) {
    if (!Array.isArray(artworks)) {
        return [];
    }
    return artworks.map(normalizeArtInstitute).filter(artwork => artwork.id);
}

/**
 * Extract artist name from artist_display field
 * The field often contains additional info like dates and nationality
 * @param {string} artistDisplay - Full artist display string
 * @returns {string} Cleaned artist name
 */
export function extractArtistName(artistDisplay) {
    if (!artistDisplay) return 'Unknown Artist';

    // Split by newline and take first line (usually the name)
    const firstLine = artistDisplay.split('\n')[0];

    // Remove dates in parentheses or other metadata
    const cleaned = firstLine.replace(/\([^)]*\)/g, '').trim();

    return cleaned || 'Unknown Artist';
}
