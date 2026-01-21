import { useCallback } from 'react';
import { motion } from 'framer-motion';
import FilterBar from '../components/filters/FilterBar';
import MosaicGrid from '../components/gallery/MosaicGrid';
import LoadingFallback from '../components/gallery/LoadingFallback';
import DetailView from '../components/artwork/DetailView';
import { useArtworks } from '../hooks/useArtworks';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
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
        onClearAll
    } = useArtworks();

    // Attach Infinite Scroll to the 'loadMore' function
    const lastElementRef = useInfiniteScroll(loading, hasMore, loadMore);

    return (
        <div className="min-h-screen bg-charcoal-ink text-dust-sand relative">
            <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filters={filters}
                setFilters={setFilters}
                onClearAll={onClearAll}
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
                <p className="text-white/60 mt-2 text-xs md:text-sm tracking-wide font-sans">
                    {artworks.length} masterpieces
                </p>
            </motion.div>

            {/* Main Grid Area */}
            <div className="pt-40 md:pt-48 pb-24 min-h-screen">
                {artworks.length === 0 && loading ? (
                    <LoadingFallback />
                ) : (
                    <>
                        <MosaicGrid
                            artworks={artworks}
                            hasMore={hasMore}
                            lastElementRef={lastElementRef}
                        />

                        {/* Bottom Loader Indicator */}
                        {loading && (
                            <div className="w-full flex justify-center py-12">
                                <div className="w-8 h-8 border-2 border-turquoise-core border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </>
                )}

                {/* Empty State */}
                {!loading && artworks.length === 0 && !error && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-soft-clay">
                        <p className="text-xl font-serif mb-4">No artworks found</p>
                        <button onClick={onClearAll} className="text-turquoise-core hover:underline underline-offset-4">
                            Reset filters
                        </button>
                    </div>
                )}
            </div>

            <DetailView />
        </div>
    );
}