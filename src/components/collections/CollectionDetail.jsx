import React, { useState, useEffect } from 'react';
import { fetchArtworkById } from '../../services/artInstituteAPI';
import { normalizeArtInstitute } from '../../utils/artworkNormalizer';
import ArtworkGrid from '../artwork/ArtworkGrid';
import ArtworkDetail from '../artwork/ArtworkDetail';

/**
 * CollectionDetail Component
 * Displays all artworks within a specific collection
 * Fetches artwork data based on stored IDs
 */
function CollectionDetail({ collection, onBack }) {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedArtworkId, setSelectedArtworkId] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadCollectionArtworks() {
            try {
                setLoading(true);
                setError(null);

                if (collection.artworkIds.length === 0) {
                    setArtworks([]);
                    setLoading(false);
                    return;
                }

                // Fetch all artworks in parallel
                const promises = collection.artworkIds.map(id => fetchArtworkById(id));
                const results = await Promise.all(promises);

                if (isMounted) {
                    const normalized = results.map(normalizeArtInstitute);
                    setArtworks(normalized);
                }
            } catch (err) {
                console.error('Error fetching collection items:', err);
                if (isMounted) {
                    setError('Failed to load some artworks. They might have been removed from the API.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadCollectionArtworks();

        return () => {
            isMounted = false;
        };
    }, [collection.artworkIds]);

    return (
        <div>
            {selectedArtworkId && (
                <ArtworkDetail
                    artworkId={selectedArtworkId}
                    onClose={() => setSelectedArtworkId(null)}
                />
            )}

            <div className="mb-8 flex items-center md:flex-row flex-col md:justify-between gap-4">
                <div>
                    <button
                        onClick={onBack}
                        className="text-sm text-text-secondary hover:text-text-primary mb-2 flex items-center"
                    >
                        ← Back to Collections
                    </button>
                    <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
                        {collection.name}
                    </h1>
                    <p className="text-text-secondary">
                        {collection.artworkIds.length} {collection.artworkIds.length === 1 ? 'artwork' : 'artworks'} collected
                    </p>
                </div>
            </div>

            <ArtworkGrid
                artworks={artworks}
                loading={loading}
                error={error}
                onArtworkClick={(artwork) => setSelectedArtworkId(artwork.id)}
            />
        </div>
    );
}

export default CollectionDetail;
