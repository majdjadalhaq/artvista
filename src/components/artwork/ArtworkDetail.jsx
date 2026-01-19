import React, { useState } from 'react';
import useArtworkDetail from '../../hooks/useArtworkDetail';
import useCollections from '../../hooks/useCollections';
import { getImageUrl } from '../../services/artInstituteAPI';

/**
 * ArtworkDetail Component
 * Modal that displays full details about an artwork
 * Allows adding/removing from specific collections
 */
function ArtworkDetail({ artworkId, onClose }) {
    const { artwork, loading, error } = useArtworkDetail(artworkId);
    const { collections, addToCollection, removeFromCollection, isInCollection } = useCollections();
    const [collectionMenuOpen, setCollectionMenuOpen] = useState(false);

    // Close when clicking outside content
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleCollectionToggle = (collectionName) => {
        if (isInCollection(artworkId, collectionName)) {
            removeFromCollection(artworkId, collectionName);
        } else {
            addToCollection(artworkId, collectionName);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleBackdropClick}>
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary"></div>
            </div>
        );
    }

    if (error || !artwork) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleBackdropClick}>
                <div className="bg-surface p-8 rounded-lg max-w-md text-center">
                    <h2 className="text-xl font-bold mb-4 text-text-primary">Error Loading Artwork</h2>
                    <p className="text-text-secondary mb-6">{error || 'Artwork not found'}</p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-primary/90"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto" onClick={handleBackdropClick}>
            <div className="bg-surface rounded-xl max-w-5xl w-full flex flex-col md:flex-row overflow-hidden shadow-2xl animate-fade-in relative">

                {/* Close Button (Mobile) */}
                <button
                    onClick={onClose}
                    className="md:hidden absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full backdrop-blur-md"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Image Section */}
                <div className="md:w-1/2 bg-black flex items-center justify-center p-4">
                    <img
                        src={artwork.imageUrl || getImageUrl(artwork.image_id, '843')}
                        alt={artwork.title}
                        className="max-h-[80vh] max-w-full object-contain"
                    />
                </div>

                {/* Info Section */}
                <div className="md:w-1/2 p-8 flex flex-col h-full max-h-[90vh] overflow-y-auto bg-surface">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-display font-bold text-text-primary mb-2">
                                {artwork.title}
                            </h2>
                            <p className="text-xl text-accent-primary font-medium">
                                {artwork.artist}
                            </p>
                        </div>
                        {/* Close Button (Desktop) */}
                        <button
                            onClick={onClose}
                            className="hidden md:block p-2 hover:bg-surface-hover rounded-full transition-colors text-text-secondary"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="space-y-6 flex-grow">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-text-secondary">Date</span>
                                <span className="font-medium text-text-primary">{artwork.date}</span>
                            </div>
                            <div>
                                <span className="block text-text-secondary">Medium</span>
                                <span className="font-medium text-text-primary">{artwork.medium}</span>
                            </div>
                            {artwork.placeOfOrigin && (
                                <div>
                                    <span className="block text-text-secondary">Place of Origin</span>
                                    <span className="font-medium text-text-primary">{artwork.placeOfOrigin}</span>
                                </div>
                            )}
                            {artwork.dimensions && (
                                <div>
                                    <span className="block text-text-secondary">Dimensions</span>
                                    <span className="font-medium text-text-primary">{artwork.dimensions}</span>
                                </div>
                            )}
                        </div>

                        {artwork.description && (
                            <div
                                className="prose prose-sm max-w-none text-text-secondary"
                                dangerouslySetInnerHTML={{ __html: artwork.description }}
                            />
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 pt-6 border-t border-border">
                        <div className="relative">
                            <button
                                onClick={() => setCollectionMenuOpen(!collectionMenuOpen)}
                                className="w-full py-3 bg-accent-primary text-white font-medium rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                Manage Collections
                            </button>

                            {collectionMenuOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-surface border border-border rounded-lg shadow-xl p-2 z-10 max-h-48 overflow-y-auto">
                                    <h4 className="px-3 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">Save to...</h4>
                                    {collections.map(col => (
                                        <button
                                            key={col.name}
                                            onClick={() => handleCollectionToggle(col.name)}
                                            className="w-full text-left px-3 py-2 rounded flex items-center justify-between hover:bg-surface-hover transition-colors text-text-primary"
                                        >
                                            <span>{col.name}</span>
                                            {isInCollection(artwork.id, col.name) && (
                                                <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </button>
                                    ))}
                                    {collections.length === 0 && (
                                        <p className="px-3 py-2 text-sm text-text-secondary">No collections created yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArtworkDetail;
