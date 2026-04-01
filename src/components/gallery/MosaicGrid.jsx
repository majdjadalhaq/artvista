import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

    const gridRef = useRef(null);

    // Scroll-triggered card entrance via ScrollTrigger.batch — cards animate in only
    // when they enter the viewport, not all at once on mount.
    useEffect(() => {
        if (!gridRef.current || !artworks || artworks.length === 0) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.batch('.masonry-item', {
                onEnter: (elements) =>
                    gsap.fromTo(
                        elements,
                        { opacity: 0, y: 40 },
                        { opacity: 1, y: 0, duration: 0.65, stagger: 0.07, ease: 'power2.out' }
                    ),
                once: true,
                start: 'top 92%',
            });
        }, gridRef);

        return () => ctx.revert();
    }, [artworks]);

    if (!artworks || artworks.length === 0) return null;

    return (
        <div className="w-full max-w-[2000px] mx-auto min-h-[60vh] px-4 md:px-8 lg:px-12 pt-12 pb-24">

            {/* CSS Masonry Grid */}
            <div ref={gridRef} className="masonry-grid">
                {artworks.map((artwork, i) => (
                    // No animationDelay inline style — GSAP ScrollTrigger handles entrance timing.
                    <div key={artwork.id || i} className="masonry-item" style={{ opacity: 0 }}>
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
