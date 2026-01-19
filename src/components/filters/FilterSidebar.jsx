import React from 'react';

/**
 * FilterSidebar Component
 * Provides search and filter controls for the artwork explorer
 */
function FilterSidebar({ filters, onFilterChange }) {
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value, page: 1 }); // Reset page on filter change
    };

    return (
        <aside className="space-y-6">
            {/* Search Filter */}
            <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-semibold text-text-primary mb-4">Search</h3>
                <div className="relative">
                    <input
                        type="text"
                        value={filters.query}
                        onChange={(e) => handleChange('query', e.target.value)}
                        placeholder="Search artworks..."
                        className="w-full pl-10 pr-4 py-2 bg-surface-hover border border-border rounded-lg focus:outline-none focus:border-accent-primary text-text-primary"
                    />
                    <svg
                        className="absolute left-3 top-2.5 w-5 h-5 text-text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Note: Additional filters (artist, medium, era) requires simpler 
          implementation since API doesn't support easy faceting without complex queries. 
          We'll stick to search for now as the primary filter mechanism which covers most needs. 
      */}
            <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-semibold text-text-primary mb-2">Tips</h3>
                <p className="text-sm text-text-secondary mb-4">
                    Try searching for styles, artists, or mediums directly in the search bar.
                </p>
                <div className="flex flex-wrap gap-2">
                    {['Impressionism', 'Van Gogh', 'Oil on Canvas', 'Ancient'].map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleChange('query', tag)}
                            className="px-3 py-1 bg-surface-hover hover:bg-accent-primary/10 hover:text-accent-primary rounded-full text-xs text-text-secondary transition-colors"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            {filters.query && (
                <button
                    onClick={() => onFilterChange({ query: '', page: 1, limit: 20 })}
                    className="w-full py-2 text-sm text-accent-primary hover:text-accent-primary/80"
                >
                    Clear Search
                </button>
            )}
        </aside>
    );
}

export default FilterSidebar;
