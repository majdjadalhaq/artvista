import React from 'react';

/**
 * Explore page component
 * Displays artwork grid with filters (to be implemented in Phase 5)
 */
function ExplorePage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
                    Explore Artworks
                </h1>
                <p className="text-text-secondary">
                    Discover masterpieces from renowned museums around the world
                </p>
            </div>

            {/* Placeholder for filters and grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filter Sidebar Placeholder */}
                <aside className="lg:col-span-1">
                    <div className="bg-surface border border-border rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-text-primary mb-4">Filters</h2>
                        <p className="text-sm text-text-secondary">
                            Filter functionality will be added in Phase 5
                        </p>
                    </div>
                </aside>

                {/* Artwork Grid Placeholder */}
                <div className="lg:col-span-3">
                    <div className="bg-surface border border-border rounded-lg p-8 text-center">
                        <p className="text-text-secondary">
                            Artwork grid will be implemented in Phase 5
                        </p>
                        <p className="text-sm text-text-secondary mt-2">
                            (API integration and custom hooks coming next)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExplorePage;
