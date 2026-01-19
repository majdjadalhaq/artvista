import React from 'react';

/**
 * CollectionCard Component
 * Displays a summary of a collection with preview thumbnails
 */
function CollectionCard({ collection, onClick, onDelete }) {
    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${collection.name}"?`)) {
            onDelete(collection.name);
        }
    };

    return (
        <div
            onClick={() => onClick(collection)}
            className="bg-surface border border-border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
        >
            {/* Preview Grid (Placeholder for actual thumbnails) */}
            <div className="h-48 bg-surface-hover p-2 grid grid-cols-2 gap-1 relative">
                {/* We would fetch thumbnails here in a real app, 
            but for now we'll use colored placeholders based on artwork count */}
                {collection.artworkIds.slice(0, 4).map((id, index) => (
                    <div
                        key={id}
                        className="bg-accent-primary/20 rounded flex items-center justify-center text-xs text-text-secondary"
                    >
                        Artwork {index + 1}
                    </div>
                ))}
                {collection.artworkIds.length === 0 && (
                    <div className="col-span-2 row-span-2 flex items-center justify-center text-text-secondary">
                        Empty Collection
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Info */}
            <div className="p-4 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-text-primary mb-1">
                        {collection.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                        {collection.artworkIds.length} {collection.artworkIds.length === 1 ? 'artwork' : 'artworks'}
                    </p>
                </div>

                {/* Delete Button (don't show for Favorites) */}
                {collection.name !== 'Favorites' && (
                    <button
                        onClick={handleDelete}
                        className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Delete collection"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

export default CollectionCard;
