import { useRef, useEffect } from 'react';
import ArtworkCard from '../artwork/ArtworkCard';
import { useUI } from '../../context/UIContext';
import '../../styles/grid.css';

// Creative Masonry MosaicGrid
export default function MosaicGrid({ artworks, hasMore, onLoadMore, loading }) {
    const { openArtwork } = useUI();
    const observerTarget = useRef(null);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    onLoadMore?.();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading, onLoadMore]);

    if (!artworks || artworks.length === 0) return null;

    // Filter out unknown artists if needed, though arguably we should show all art
    // const items = artworks.filter(art => art.artist && art.artist.toLowerCase() !== 'unknown');
    // For now, let's show everything to fill the grid, the card handles "Unknown" gracefully.
    const items = artworks;

    return (
        <div className="w-full max-w-[2000px] mx-auto min-h-[60vh] px-4 md:px-8 lg:px-12 pt-40 pb-24">

            {/* CSS Masonry Grid */}
            <div className="masonry-grid">
                {items.map((artwork, i) => (
                    <div
                        key={artwork.id || i}
                        className="masonry-item animate-fade-in-up"
                        style={{ animationDelay: `${(i % 12) * 0.05}s` }}
                    >
                        <ArtworkCard
                            artwork={artwork}
                            index={i}
                            onClick={() => openArtwork(artwork)}
                        />
                    </div>
                ))}
            </div>

            {/* Scroll Observer Target */}
            <div ref={observerTarget} className="h-20 w-full" aria-hidden="true" />
        </div>
    );
}
