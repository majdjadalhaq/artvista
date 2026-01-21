import { X, Filter, Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Redesigned FilterPanel Component
 * Floating, minimal filter panel with modern UI/UX
 */
export default function FilterPanel({ filters, onUpdateFilter, onReset }) {
    const [localQuery, setLocalQuery] = useState(filters?.query || '');
    const [isExpanded, setIsExpanded] = useState(false);
    const debouncedQuery = useDebounce(localQuery, 500);
    const [activeFilterCount, setActiveFilterCount] = useState(0);

    // Sync debounced query with parent filter
    useEffect(() => {
        if (filters && debouncedQuery !== filters.query) {
            onUpdateFilter('query', debouncedQuery);
        }
    }, [debouncedQuery, filters, onUpdateFilter]);

    // Count active filters
    useEffect(() => {
        let count = 0;
        if (filters?.artist) count++;
        if (filters?.medium) count++;
        if (filters?.era) count++;
        if (filters?.query) count++;
        setActiveFilterCount(count);
    }, [filters]);

    const filterOptions = {
        artist: [
            { value: '', label: 'All Artists' },
            { value: 'Van Gogh', label: 'Van Gogh' },
            { value: 'Monet', label: 'Monet' },
            { value: 'Picasso', label: 'Picasso' },
            { value: 'Da Vinci', label: 'Da Vinci' },
            { value: 'Rembrandt', label: 'Rembrandt' },
        ],
        medium: [
            { value: '', label: 'All Mediums' },
            { value: 'Painting', label: 'Painting' },
            { value: 'Sculpture', label: 'Sculpture' },
            { value: 'Print', label: 'Print' },
            { value: 'Photograph', label: 'Photo' },
        ],
        era: [
            { value: '', label: 'All Eras' },
            { value: 'Renaissance', label: 'Renaissance' },
            { value: 'Impressionism', label: 'Impressionism' },
            { value: 'Modern', label: 'Modern' },
            { value: 'Contemporary', label: 'Contemporary' },
        ],
    };

    return (
        <div className="fixed top-24 right-8 z-50">
            {/* Floating Filter Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="relative p-4 bg-graphite/90 backdrop-blur-xl border border-turquoise-core/30 rounded-full shadow-2xl hover:border-turquoise-core transition-all"
                aria-label="Toggle filters"
                aria-expanded={isExpanded}
            >
                <Filter className="text-turquoise-core" size={24} />

                {/* Active filter badge */}
                {activeFilterCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-turquoise-core rounded-full flex items-center justify-center text-charcoal-ink text-xs font-bold"
                    >
                        {activeFilterCount}
                    </motion.div>
                )}
            </motion.button>

            {/* Expanded Filter Panel */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="absolute top-20 right-0 w-80 bg-charcoal-ink/95 backdrop-blur-2xl border border-turquoise-core/30 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-turquoise-core/20">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-serif font-bold text-dust-sand">
                                    Filter Gallery
                                </h3>
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="p-2 hover:bg-graphite rounded-lg transition-colors"
                                    aria-label="Close filters"
                                >
                                    <X className="text-soft-clay" size={20} />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-clay"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Search artworks..."
                                    value={localQuery}
                                    onChange={(e) => setLocalQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-turquoise-core/20 bg-graphite text-dust-sand placeholder-soft-clay/50 focus:outline-none focus:ring-2 focus:ring-turquoise-core/50 transition-all text-sm"
                                    maxLength={50}
                                    aria-label="Search artworks"
                                />
                                {localQuery && (
                                    <button
                                        onClick={() => setLocalQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-soft-clay hover:text-turquoise-core transition-colors"
                                        aria-label="Clear search"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filter Options */}
                        <div className="p-6 space-y-4">
                            {Object.entries(filterOptions).map(([filterKey, options]) => (
                                <div key={filterKey}>
                                    <label className="block text-xs uppercase tracking-wider text-soft-clay/70 mb-2">
                                        {filterKey}
                                    </label>
                                    <select
                                        value={filters?.[filterKey] || ''}
                                        onChange={(e) => onUpdateFilter(filterKey, e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border bg-graphite text-dust-sand focus:ring-2 focus:ring-turquoise-core/50 focus:outline-none text-sm transition-all ${filters?.[filterKey]
                                                ? 'border-turquoise-core ring-2 ring-turquoise-core/20'
                                                : 'border-turquoise-core/20'
                                            }`}
                                        aria-label={`Filter by ${filterKey}`}
                                    >
                                        {options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        {activeFilterCount > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 border-t border-turquoise-core/20"
                            >
                                <button
                                    onClick={() => {
                                        onReset();
                                        setLocalQuery('');
                                    }}
                                    className="w-full py-3 px-4 rounded-xl bg-muted-copper/20 border border-muted-copper/40 text-muted-copper hover:bg-muted-copper hover:text-charcoal-ink transition-all font-medium text-sm"
                                >
                                    Clear All Filters
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
