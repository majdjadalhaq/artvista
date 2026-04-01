import { motion, AnimatePresence } from 'framer-motion';
import FilterBar from '../components/filters/FilterBar';
import MosaicGrid from '../components/gallery/MosaicGrid';
import LoadingFallback from '../components/gallery/LoadingFallback';
import EmptyResult from '../components/ui/EmptyResult';
import DetailView from '../components/artwork/DetailView';
import SpotlightOverlay from '../components/gallery/SpotlightOverlay';
import { useArtworks } from '../hooks/useArtworks';
import { useUI } from '../context/UIContext';

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
        facets
    } = useArtworks();

    const { spotlightActive, toggleSpotlight } = useUI();

    return (
        <div className="min-h-screen bg-charcoal-ink text-dust-sand relative overflow-x-hidden">
            <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filters={filters}
                setFilters={setFilters}
                onClearAll={onClearAll}
                facets={facets}
            />

            {/* Title Overlay */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="fixed top-24 left-4 md:left-8 z-30 pointer-events-none mix-blend-difference"
            >
                <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white">
                    Gallery
                </h1>
            </motion.div>

            {/* Museum Spotlight Toggle */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={toggleSpotlight}
                title={spotlightActive ? 'Exit museum mode' : 'Enter museum mode'}
                className={`fixed bottom-8 right-8 z-[50] w-12 h-12 rounded-full border flex items-center justify-center transition-colors duration-300 backdrop-blur-md shadow-lg
                    ${spotlightActive
                        ? 'bg-turquoise-core/20 border-turquoise-core text-turquoise-core'
                        : 'bg-white/5 border-white/20 text-white/50 hover:border-white/50 hover:text-white/80'}`}
                aria-pressed={spotlightActive}
                aria-label="Toggle museum spotlight mode"
            >
                {/* Torch icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
            </motion.button>

            {/* Museum-mode overlay — renders above grid, below header/modals */}
            <AnimatePresence>
                {spotlightActive && (
                    <motion.div
                        key="spotlight"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <SpotlightOverlay />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Grid Area */}
            <div id="explore-grid" className="min-h-screen w-full relative overflow-visible pb-24">
                {artworks.length === 0 && loading ? (
                    <LoadingFallback />
                ) : (
                    <>
                        <MosaicGrid
                            artworks={artworks}
                            hasMore={hasMore}
                            onLoadMore={loadMore}
                            loading={loading}
                        />
                        {/* Bottom Ribbon Loader */}
                        {loading && (
                            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
                                <div className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs md:text-sm shadow-lg backdrop-blur-md">
                                    Loading more artworks…
                                </div>
                            </div>
                        )}
                    </>
                )}
                {/* Empty State */}
                {!loading && artworks.length === 0 && !error && (
                    <EmptyResult onReset={onClearAll} />
                )}
            </div>

            <DetailView />
        </div>
    );
}