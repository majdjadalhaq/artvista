import React from 'react';
import ArtworkCard from './ArtworkCard';

/**
 * ArtworkGrid Component
 * Displays artworks in a responsive grid layout
 * Handles loading and error states
 */
function ArtworkGrid({ artworks, loading, error, onArtworkClick }) {
    // Loading state - show skeleton cards
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="aspect-[3/4] bg-surface-hover rounded-t-lg" />
                        <div className="p-4 bg-surface border border-border rounded-b-lg">
                            <div className="h-4 bg-surface-hover rounded mb-2" />
                            <div className="h-3 bg-surface-hover rounded w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-surface border border-border rounded-lg p-12 text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Error Loading Artworks
                </h3>
                <p className="text-text-secondary">{error}</p>
            </div>
        );
    }

    // Empty state
    if (!artworks || artworks.length === 0) {
        return (
            <div className="bg-surface border border-border rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                    No Artworks Found
                </h3>
                <p className="text-text-secondary">
                    Try adjusting your filters or search query
                </p>
            </div>
        );
    }

    // Display artworks
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((artwork) => (
                <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onClick={onArtworkClick}
                />
            ))}
        </div>
    );
}

export default ArtworkGrid;
