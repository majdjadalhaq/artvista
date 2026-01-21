/**
 * Gallery Layout Utility
 * Calculates positions for artworks on a 3D gallery wall
 */

/**
 * Calculate staggered positions for artworks on the gallery wall
 * @param {number} count - Number of artworks
 * @param {object} options - Layout options
 * @returns {Array} Array of position objects {x, y, z, rotation}
 */
export function calculateGalleryPositions(count, options = {}) {
    const {
        columns = 4,
        rowSpacing = 3.5,
        columnSpacing = 3,
        wallDepth = 20,
        staggerAmount = 0.3,
        isMobile = false,
    } = options;

    const positions = [];
    const mobileColumns = 2;
    const actualColumns = isMobile ? mobileColumns : columns;

    for (let i = 0; i < count; i++) {
        const row = Math.floor(i / actualColumns);
        const col = i % actualColumns;

        // Center the grid
        const xOffset = ((actualColumns - 1) * columnSpacing) / 2;
        const x = col * columnSpacing - xOffset;

        // Stagger vertically for visual interest
        const stagger = (col % 2 === 0) ? staggerAmount : -staggerAmount;
        const y = -(row * rowSpacing) + stagger;

        // Position along the wall depth
        const z = -(row * (wallDepth / Math.ceil(count / actualColumns)));

        // Slight random rotation for organic feel
        const rotation = (Math.random() - 0.5) * 0.02;

        positions.push({
            x,
            y,
            z,
            rotation,
            row,
            col,
        });
    }

    return positions;
}

/**
 * Calculate camera path along the gallery
 * @param {number} artworkCount - Number of artworks
 * @param {object} options - Camera options
 * @returns {object} Camera path configuration
 */
export function calculateCameraPath(artworkCount, options = {}) {
    const {
        columns = 4,
        rowSpacing = 3.5,
        startZ = 5,
        viewingDistance = 8,
    } = options;

    const rows = Math.ceil(artworkCount / columns);
    const totalDepth = rows * rowSpacing;

    return {
        startPosition: [0, 0, startZ],
        endPosition: [0, 0, -(totalDepth - viewingDistance)],
        lookAt: [0, 0, 0],
        totalDepth,
    };
}

/**
 * Check if two artworks would overlap
 * @param {object} pos1 - First position
 * @param {object} pos2 - Second position
 * @param {number} threshold - Minimum distance
 * @returns {boolean} True if overlapping
 */
export function checkOverlap(pos1, pos2, threshold = 2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < threshold;
}

/**
 * Get responsive layout configuration
 * @param {number} width - Viewport width
 * @returns {object} Layout configuration
 */
export function getResponsiveLayout(width) {
    if (width < 768) {
        return {
            columns: 2,
            columnSpacing: 2.5,
            rowSpacing: 3,
            isMobile: true,
        };
    } else if (width < 1024) {
        return {
            columns: 3,
            columnSpacing: 2.8,
            rowSpacing: 3.2,
            isMobile: false,
        };
    } else {
        return {
            columns: 4,
            columnSpacing: 3,
            rowSpacing: 3.5,
            isMobile: false,
        };
    }
}
