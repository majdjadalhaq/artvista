import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, ChevronDown } from 'lucide-react';
import { ERA_CONFIG, extractArtistName } from '../../utils/filterUtils';

/**
 * FilterBar Component
 * Real-time filter controls: Keyword Search + Dropdowns + Chips
 */
export default function FilterBar({
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    onClearAll,
    facets
}) {
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Dynamic Filter Options
    const filterOptions = {
        era: facets?.eras?.map(key => ({
            name: key,
            label: ERA_CONFIG[key].label
        })) || [],
        artist: facets?.artists?.map(a => ({
            name: a.name,
            label: extractArtistName(a.name)
        })) || []
    };

    const toggleDropdown = (key) => {
        setActiveDropdown(activeDropdown === key ? null : key);
    };

    const handleSelect = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setActiveDropdown(null);
    };

    const removeFilter = (key) => {
        setFilters(prev => ({ ...prev, [key]: '' }));
    };

    // Get display label for selected era
    const getEraLabel = () => {
        if (!filters.era) return 'ERA';
        return ERA_CONFIG[filters.era]?.label || filters.era;
    };

    return (
        <div className="fixed top-24 right-4 md:right-12 z-40 flex flex-col items-end gap-3 max-w-[90vw]">

            {/* Search Input */}
            <div className="bg-charcoal-ink/90 backdrop-blur-md border border-turquoise-core/30 rounded-full px-4 py-2 flex items-center gap-2 shadow-xl focus-within:border-turquoise-core transition-colors w-full md:w-80">
                <Search size={16} className="text-turquoise-core" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artist or artwork..."
                    className="bg-transparent border-none outline-none text-dust-sand text-sm placeholder:text-soft-clay/50 w-full"
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')}>
                        <X size={14} className="text-soft-clay hover:text-white" />
                    </button>
                )}
            </div>

            {/* Filter Dropdowns Row */}
            <div className="flex flex-wrap justify-end gap-2">
                {Object.keys(filterOptions).map((key) => {
                    const isActive = !!filters[key];
                    return (
                        <div key={key} className="relative">
                            <button
                                onClick={() => toggleDropdown(key)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border flex items-center gap-2 transition-all ${isActive
                                    ? 'bg-turquoise-core/20 border-turquoise-core text-turquoise-core'
                                    : 'bg-charcoal-ink/80 border-white/20 text-white hover:border-turquoise-core/50 hover:text-white'
                                    }`}
                            >
                                {key === 'era' ? getEraLabel() : (isActive ? filters[key] : key)}
                                <ChevronDown size={12} className={`transition-transform ${activeDropdown === key ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {activeDropdown === key && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="absolute right-0 mt-2 w-48 bg-charcoal-ink border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2"
                                    >
                                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                            {filterOptions[key].map(option => {
                                                const optionValue = option.name || option;
                                                const optionLabel = option.label || option;
                                                return (
                                                    <button
                                                        key={optionValue}
                                                        onClick={() => handleSelect(key, optionValue)}
                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${filters[key] === optionValue ? 'text-turquoise-core font-bold' : 'text-gray-50'
                                                            }`}
                                                    >
                                                        {optionLabel}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}

                {/* Clear All */}
                {(searchQuery || Object.values(filters).some(Boolean)) && (
                    <button
                        onClick={onClearAll}
                        className="px-3 py-1.5 text-xs text-muted-copper hover:text-white underline underline-offset-4 transition-colors font-medium"
                    >
                        Clear All
                    </button>
                )}
            </div>

        </div>
    );
}
