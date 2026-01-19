import React, { useState } from 'react';
import useCollections from '../../hooks/useCollections';

/**
 * ArtworkCard Component
 * Displays a single artwork in the grid with image, title, artist
 * Includes "Add to Collection" functionality
 */
function ArtworkCard({ artwork, onClick }) {
    const { addToCollection, removeFromCollection, isInCollection } = useCollections();
    const [imageError, setImageError] = useState(false);
    const inFavorites = isInCollection(artwork.id, 'Favorites');

    const handleToggleFavorite = (e) => {
        e.stopPropagation(); // Prevent card click

        if (inFavorites) {
            removeFromCollection(artwork.id, 'Favorites');
        } else {
            addToCollection(artwork.id, 'Favorites');
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div
            onClick={() => onClick && onClick(artwork)}
            className="group bg-surface border border-border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-accent-primary/50"
        >
            {/* Image */}
            <div className="aspect-[3/4] bg-surface-hover relative overflow-hidden">
                {!imageError && artwork.imageUrl ? (
                    <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        onError={handleImageError}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-secondary">
                        <svg
                            className="w-16 h-16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}

                {/* Favorite Button */}
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-2 right-2 p-2 bg-surface/90 backdrop-blur-sm rounded-full hover:bg-surface transition-colors"
                    aria-label={inFavorites ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <svg
                        className={`w-5 h-5 transition-colors ${inFavorites ? 'fill-accent-primary text-accent-primary' : 'text-text-secondary'
                            }`}
                        fill={inFavorites ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                </button>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-semibold text-text-primary line-clamp-2 mb-1">
                    {artwork.title}
                </h3>
                <p className="text-sm text-text-secondary line-clamp-1">
                    {artwork.artist}
                </p>
                {artwork.date && (
                    <p className="text-xs text-text-secondary mt-1">{artwork.date}</p>
                )}
            </div>
        </div>
    );
}

export default ArtworkCard;
