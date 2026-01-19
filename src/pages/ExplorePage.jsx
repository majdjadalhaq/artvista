import React, { useState } from 'react';
import useFetchArtworks from '../hooks/useFetchArtworks';
import useDebounce from '../hooks/useDebounce';
import ArtworkGrid from '../components/artwork/ArtworkGrid';
import FilterSidebar from '../components/filters/FilterSidebar';
import ArtworkDetail from '../components/artwork/ArtworkDetail';

/**
 * Explore page component
 * Integrates filtering, searching, and artwork grid display
 */
function ExplorePage() {
    const [filters, setFilters] = useState({
        query: '',
        page: 1,
        limit: 12
    });
    const [selectedArtworkId, setSelectedArtworkId] = useState(null);

    // Debounce the search query to avoid API spam
    const debouncedQuery = useDebounce(filters.query, 500);

    // Fetch artworks using the debounced query
    const { artworks, loading, error, pagination } = useFetchArtworks({
        ...filters,
        query: debouncedQuery
    });

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleArtworkClick = (artwork) => {
        setSelectedArtworkId(artwork.id);
    };

    return (
        <div>
            {selectedArtworkId && (
                <ArtworkDetail
                    artworkId={selectedArtworkId}
                    onClose={() => setSelectedArtworkId(null)}
                />
            )}

            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
                    Explore Artworks
                </h1>
                <p className="text-text-secondary">
                    Discover masterpieces from renowned museums around the world
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <aside className="lg:col-span-1">
                    <FilterSidebar
                        filters={filters}
                        onFilterChange={setFilters} // Direct setter works for simple updates, but wrapper is better if complex logic needed
                    />
                </aside>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <ArtworkGrid
                        artworks={artworks}
                        loading={loading}
                        error={error}
                        onArtworkClick={handleArtworkClick}
                    />

                    {/* Pagination */}
                    {!loading && !error && artworks.length > 0 && (
                        <div className="mt-8 flex justify-center items-center space-x-4">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage <= 1}
                                className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-text-secondary">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage >= pagination.totalPages}
                                className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExplorePage;
