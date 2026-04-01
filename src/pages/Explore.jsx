import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import FilterBar from '../components/filters/FilterBar';
import MosaicGrid from '../components/gallery/MosaicGrid';
import LoadingFallback from '../components/gallery/LoadingFallback';
import EmptyResult from '../components/ui/EmptyResult';
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

    const { ambientColor } = useUI();
    const bgRef = useRef(null);

    // Smoothly tween the ambient background tint whenever the hovered artwork changes.
    useEffect(() => {
        if (!bgRef.current) return;
        if (ambientColor) {
            gsap.to(bgRef.current, {
                '--ambient-r': parseInt(ambientColor.match(/\d+/g)[0]),
                '--ambient-g': parseInt(ambientColor.match(/\d+/g)[1]),
                '--ambient-b': parseInt(ambientColor.match(/\d+/g)[2]),
                '--ambient-opacity': 0.12,
                duration: 1.5, ease: 'power1.out',
            });
        } else {
            gsap.to(bgRef.current, { '--ambient-opacity': 0, duration: 1, ease: 'power1.out' });
        }
    }, [ambientColor]);

    return (
        <div
            ref={bgRef}
            style={{
                '--ambient-r': 30, '--ambient-g': 30, '--ambient-b': 30, '--ambient-opacity': 0,
                background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),var(--ambient-opacity)) 0%, #1E1E1E 65%)',
            }}
            className="min-h-screen text-dust-sand relative overflow-x-hidden transition-none"
        >
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