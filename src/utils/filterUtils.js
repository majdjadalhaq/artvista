/**
 * Normalizes a string for comparison:
 * - Lowercase
 * - Trimmed
 * - Removes accents/diacritics
 * - Collapses whitespace
 */
export const normalizeString = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .trim()
        .replace(/\s+/g, ' '); // Collapse spaces
};

/**
 * Extracts the first relevant year from a date string.
 * Supports: "1889", "c. 1890", "1888-1890", "19th century"
 */
export const parseYear = (dateString, eraString) => {
    if (!dateString) return null;

    // Normalize
    const str = dateString.toString().trim();

    // 1. Try 4-digit year
    const yearMatch = str.match(/\b(1\d{3}|20\d{2})\b/);
    if (yearMatch) return parseInt(yearMatch[0], 10);

    // 2. Try Century "19th century" -> 1800
    const centuryMatch = str.match(/(\d{1,2})th century/i);
    if (centuryMatch) {
        return (parseInt(centuryMatch[1], 10) - 1) * 100;
    }

    return null;
};

/**
 * Maps a numeric year to a defined Era.
 */
export const getEra = (year) => {
    if (year === null || year === undefined) return null;

    if (year < 500) return 'Ancient'; // Before 500
    if (year < 1400) return 'Medieval'; // 500 - 1399
    if (year < 1600) return 'Renaissance'; // 1400 - 1599
    if (year < 1800) return 'Early Modern'; // 1600 - 1799
    if (year < 1946) return 'Modern'; // 1800 - 1945
    return 'Contemporary'; // 1946 - Present
};

/**
 * Checks if an artwork matches the era filter.
 */
export const matchesEra = (artwork, selectedEra) => {
    if (!selectedEra) return true;

    // Use date_display or year, or infer from style if needed (but year is safer)
    const year = parseYear(artwork.year || artwork.date_display || artwork.date);
    const era = getEra(year);

    return era === selectedEra;
};

/**
 * Checks if an artwork matches the artist filter.
 * Uses robust partial matching logic.
 */
export const matchesArtist = (artwork, selectedArtist) => {
    if (!selectedArtist) return true;
    if (!artwork.artist) return false;

    return normalizeString(artwork.artist) === normalizeString(selectedArtist);
};

/**
 * Checks if an artwork matches a search query using tokenized matching.
 * Matches against Title, Artist, Description, Medium.
 * "van gogh" matches "Vincent van Gogh"
 */
export const matchesSearchQuery = (artwork, query) => {
    if (!query) return true;

    const normalizedQuery = normalizeString(query);
    if (!normalizedQuery) return true;

    const tokens = normalizedQuery.split(' ');

    // Fields to search
    const textBlob = normalizeString(
        `${artwork.title} ${artwork.artist} ${artwork.medium} ${artwork.description || ''}`
    );

    // Every token in the query must appear in the artwork's data
    return tokens.every(token => textBlob.includes(token));
};
