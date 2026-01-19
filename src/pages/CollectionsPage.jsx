import React, { useState } from 'react';
import useCollections from '../hooks/useCollections';
import CollectionCard from '../components/collections/CollectionCard';
import CollectionDetail from '../components/collections/CollectionDetail';

/**
 * Collections page component
 * Allows users to view, create, and manage their artwork collections
 */
function CollectionsPage() {
    const { collections, createCollection, deleteCollection } = useCollections();
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');

    // If a collection is selected, show its detail view
    if (selectedCollection) {
        return (
            <CollectionDetail
                collection={selectedCollection}
                onBack={() => setSelectedCollection(null)}
            />
        );
    }

    const handleCreateCollection = (e) => {
        e.preventDefault();
        if (createCollection(newCollectionName)) {
            setNewCollectionName('');
            setIsCreating(false);
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
                        My Collections
                    </h1>
                    <p className="text-text-secondary">
                        Organize and manage your favorite artworks
                    </p>
                </div>

                <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors shadow-sm"
                >
                    + New Collection
                </button>
            </div>

            {/* Create Collection Modal/Form */}
            {isCreating && (
                <div className="mb-8 p-6 bg-surface border border-border rounded-lg shadow-sm">
                    <form onSubmit={handleCreateCollection} className="flex gap-4">
                        <input
                            type="text"
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                            placeholder="Collection name (e.g. Impressionism)"
                            className="flex-1 px-4 py-2 bg-surface-hover border border-border rounded-lg focus:outline-none focus:border-accent-primary text-text-primary"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!newCollectionName.trim()}
                            className="px-6 py-2 bg-accent-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-primary/90"
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="px-6 py-2 border border-border rounded-lg hover:bg-surface-hover text-text-secondary"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {/* Collections Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {collections.map((collection) => (
                    <CollectionCard
                        key={collection.name}
                        collection={collection}
                        onClick={setSelectedCollection}
                        onDelete={deleteCollection}
                    />
                ))}
            </div>

            {collections.length === 0 && (
                <div className="text-center py-20 bg-surface border border-border rounded-lg">
                    <div className="text-6xl mb-4">🎨</div>
                    <h2 className="text-xl font-semibold text-text-primary mb-2">
                        No Collections Yet
                    </h2>
                    <p className="text-text-secondary mb-6">
                        Create your first collection to start saving artworks!
                    </p>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-6 py-2 border border-accent-primary text-accent-primary rounded-lg hover:bg-accent-primary/5 transition-colors"
                    >
                        Create Collection
                    </button>
                </div>
            )}
        </div>
    );
}

export default CollectionsPage;
