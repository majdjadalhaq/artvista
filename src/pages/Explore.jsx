import { Suspense, useCallback } from 'react';
import FilterBar from '../components/filters/FilterBar';
import MosaicGrid from '../components/gallery/MosaicGrid';
import LoadingFallback from '../components/gallery/LoadingFallback';
import DetailView from '../components/artwork/DetailView';
import { useArtworks } from '../hooks/useArtworks';
import { useUI } from '../context/UIContext';
import { motion } from 'framer-motion';

/**
 * Explore Page - Enhanced
 * Now features robust API integration and standard modern filters
 */
export default function Explore() {
    const {
        artworks,
        loading,
        error,
        hasMore,
        loadMore,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        onClearAll,
        availableArtists // Get derived list
    } = useArtworks();

    const { openArtwork } = useUI();

    const handleArtworkClick = useCallback((artwork) => {
        openArtwork(artwork);
    }, [openArtwork]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            // DetailView handles its own close
        }
    }, []);

    return (
        <div
            className="min-h-screen bg-charcoal-ink text-dust-sand"
            onKeyDown={handleKeyDown}
            role="main"
            aria-label="Explore Gallery"
        >
            {/* New Filter Bar */}
            <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filters={filters}
                setFilters={setFilters}
                onClearAll={onClearAll}
                availableArtists={availableArtists} // Pass to component
            />

            {/* Title Overlay */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="fixed top-24 left-8 z-30 pointer-events-none md:block hidden"
            >
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-dust-sand/90 tracking-tight">
                    Gallery
                </h1>
                <p className="text-soft-clay/70 mt-2 text-sm tracking-wide">
                    Discover artworks from world-class museums
                </p>
            </motion.div>

            {/* Artwork count indicator */}
            {artworks.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="fixed bottom-8 left-8 z-30 px-4 py-2 bg-graphite/80 backdrop-blur-md border border-turquoise-core/30 rounded-full text-turquoise-core text-sm font-medium hidden md:block"
                >
                    {artworks.length} artworks
                </motion.div>
            )}

            {/* Error display */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                >
                    <div className="bg-muted-copper/90 backdrop-blur-md border border-muted-copper text-dust-sand px-6 py-4 rounded-xl shadow-2xl max-w-md pointer-events-auto">
                        <h3 className="font-bold mb-2">Notice</h3>
                        <p className="text-sm">{error}</p>
                    </div>
                </motion.div>
            )}

            {/* Main content */}
            <div className="pt-32 pb-24">
                {loading && artworks.length === 0 ? (
                    <LoadingFallback progress={0} />
                ) : (
                    <MosaicGrid
                        artworks={artworks}
                        hasMore={hasMore}
                        lastElementRef={loadMore}
                    />
                )}

                {/* Empty State */}
                {!loading && artworks.length === 0 && !error && (
                    <div className="h-[50vh] flex flex-col items-center justify-center text-soft-clay">
                        <p className="text-xl font-serif mb-2">No artworks found</p>
                        <button onClick={onClearAll} className="text-turquoise-core hover:underline">Clear filters</button>
                    </div>
                )}
            </div>

            {/* Detail View Modal */}
            <DetailView />
        </div>
    );
}
