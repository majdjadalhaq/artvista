import { useCallback } from 'react';
import { motion } from 'framer-motion';
import FilterBar from '../components/filters/FilterBar';
import MosaicGrid from '../components/gallery/MosaicGrid';
import LoadingFallback from '../components/gallery/LoadingFallback';
import DetailView from '../components/artwork/DetailView';
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
                <p className="text-white/60 mt-2 text-xs md:text-sm tracking-wide font-sans">
                    {artworks.length} masterpieces
                </p>
            </motion.div>

            {/* Main Grid Area */}
            <div id="explore-grid" className="min-h-screen w-full relative overflow-visible pt-32 pb-24">
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