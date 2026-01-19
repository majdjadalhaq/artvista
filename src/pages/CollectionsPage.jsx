import React from 'react';

/**
 * Collections page component
 * Displays user's saved collections (to be implemented in Phase 6)
 */
function CollectionsPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
                    My Collections
                </h1>
                <p className="text-text-secondary">
                    Organize and manage your favorite artworks
                </p>
            </div>

            {/* Empty State Placeholder */}
            <div className="bg-surface border border-border rounded-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-4">🎨</div>
                    <h2 className="text-2xl font-semibold text-text-primary mb-2">
                        No Collections Yet
                    </h2>
                    <p className="text-text-secondary mb-6">
                        Start exploring artworks and create your first collection!
                    </p>
                    <p className="text-sm text-text-secondary">
                        Collections functionality will be implemented in Phase 4 & 6
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CollectionsPage;
