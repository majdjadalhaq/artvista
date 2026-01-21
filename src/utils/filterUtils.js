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
 * Era configuration with year ranges and labels
 */
export const ERA_CONFIG = {
    Ancient: { min: 0, max: 499, label: 'Ancient (0-499)' },
    Medieval: { min: 500, max: 1399, label: 'Medieval (500-1399)' },
    Renaissance: { min: 1400, max: 1599, label: 'Renaissance (1400-1599)' },
    Modern: { min: 1600, max: 1945, label: 'Modern (1600-1945)' },
    Contemporary: { min: 1946, max: 2100, label: 'Contemporary (1946-Present)' }
};

/**
 * Maps a numeric year to a defined Era.
 */
export const getEra = (year) => {
    if (year === null || year === undefined) return null;

    if (year < 500) return 'Ancient';
    if (year < 1400) return 'Medieval';
    if (year < 1600) return 'Renaissance';
    if (year < 1946) return 'Modern';
    return 'Contemporary';
};

/**
 * Check if a year falls within an era's range
 */
export const isYearInEra = (year, eraName) => {
    if (!year || !eraName || !ERA_CONFIG[eraName]) return false;
    const eraRange = ERA_CONFIG[eraName];
    return year >= eraRange.min && year <= eraRange.max;
};

/**
 * Checks if an artwork matches the era filter.
 */
export const matchesEra = (artwork, selectedEra) => {
    if (!selectedEra) return true;

    // Use date_display or year, or infer from style if needed (but year is safer)
    const year = parseYear(artwork.year || artwork.date_display || artwork.date);
    
    // Use the era range configuration for more flexible matching
    if (year && ERA_CONFIG[selectedEra]) {
        return isYearInEra(year, selectedEra);
    }
    
    // Fallback to era matching
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
 * Levenshtein distance for fuzzy matching
 * Lower score = better match
 */
export const levenshteinDistance = (str1, str2) => {
    const track = Array(str2.length + 1).fill(null).map(() =>
        Array(str1.length + 1).fill(null)
    );
    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1,
                track[j - 1][i] + 1,
                track[j - 1][i - 1] + indicator
            );
        }
    }
    return track[str2.length][str1.length];
};

/**
 * Calculate match score (0-100, higher is better)
 */
export const calculateMatchScore = (source, query) => {
    const normalizedSource = normalizeString(source);
    const normalizedQuery = normalizeString(query);
    
    if (!normalizedSource || !normalizedQuery) return 0;
    
    // Exact match
    if (normalizedSource === normalizedQuery) return 100;
    
    // Starts with match
    if (normalizedSource.startsWith(normalizedQuery)) return 90;
    
    // Contains match
    if (normalizedSource.includes(normalizedQuery)) return 80;
    
    // Partial/fuzzy match using Levenshtein
    const distance = levenshteinDistance(normalizedSource, normalizedQuery);
    const maxLength = Math.max(normalizedSource.length, normalizedQuery.length);
    const similarity = Math.max(0, 100 - (distance / maxLength) * 100);
    
    return similarity > 40 ? similarity : 0; // Only return matches with >40% similarity
};

/**
 * Instant search with fuzzy matching for both artist names and artwork titles
 * Returns results sorted by relevance score
 */
export const matchesSearchQuery = (artwork, query) => {
    if (!query) return true;

    const normalizedQuery = normalizeString(query).trim();
    if (!normalizedQuery) return true;

    // Search fields with weights
    const titleScore = calculateMatchScore(artwork.title || '', normalizedQuery) * 1.5; // Title is most relevant
    const artistScore = calculateMatchScore(artwork.artist || '', normalizedQuery) * 1.3; // Artist second
    const mediumScore = calculateMatchScore(artwork.medium || '', normalizedQuery);
    const descriptionScore = calculateMatchScore(artwork.description || '', normalizedQuery) * 0.5;

    const maxScore = Math.max(titleScore, artistScore, mediumScore, descriptionScore);
    
    // Return true if any field has a score > 40 (good match)
    artwork.searchScore = maxScore;
    return maxScore > 40;
};

/**
 * Sort artworks by search relevance score (descending)
 */
export const sortBySearchRelevance = (artworks) => {
    return [...artworks].sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
};
};
