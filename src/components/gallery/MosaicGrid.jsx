import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import ArtworkCard from '../artwork/ArtworkCard';
import { useUI } from '../../context/UIContext';
import '../../styles/grid.css';

// Deterministic tilt: same index always yields the same rotation (-3° to +3°).
function getTiltAngle(i) {
    return ((i * 37 + 13) % 7) - 3;
}

// Detects touch-primary devices so we skip the magnetic effect there.
const isTouchDevice = () =>
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/**
 * MosaicItem — wrapper that owns the tilt rotation and magnetic pull effect.
 * Keeps ArtworkCard free of animation concerns.
 */
function MosaicItem({ artwork, index, onClick }) {
    const wrapperRef = useRef(null);
    const tilt = getTiltAngle(index);

    const handleMouseMove = useCallback((e) => {
        const el = wrapperRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dx = Math.max(-8, Math.min(8, (e.clientX - (rect.left + rect.width / 2)) * 0.06));
        const dy = Math.max(-8, Math.min(8, (e.clientY - (rect.top + rect.height / 2)) * 0.06));
        gsap.to(el, { x: dx, y: dy, rotation: 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    }, []);

    const handleMouseEnter = useCallback(() => {
        gsap.to(wrapperRef.current, {
            rotation: 0, scale: 1.03,
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            duration: 0.3, ease: 'power2.out', overwrite: 'auto',
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        gsap.to(wrapperRef.current, {
            x: 0, y: 0, rotation: tilt, scale: 1,
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            duration: 0.55, ease: 'elastic.out(1,0.5)', overwrite: 'auto',
        });
    }, [tilt]);

    // Set the initial tilt immediately after mount so it never flashes at 0°.
    useEffect(() => {
        gsap.set(wrapperRef.current, { rotation: tilt, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' });
    }, [tilt]);

    const touch = isTouchDevice();

    return (
        <div
            ref={wrapperRef}
            className="masonry-item animate-fade-in-up"
            style={{ animationDelay: `${(index % 12) * 0.05}s`, willChange: 'transform' }}
            onMouseMove={touch ? undefined : handleMouseMove}
            onMouseEnter={touch ? undefined : handleMouseEnter}
            onMouseLeave={touch ? undefined : handleMouseLeave}
        >
            <ArtworkCard artwork={artwork} index={index} onClick={onClick} />
        </div>
    );
}

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

    return (
        <div className="w-full max-w-[2000px] mx-auto min-h-[60vh] px-4 md:px-8 lg:px-12 pt-40 pb-24">

            {/* CSS Masonry Grid */}
            <div className="masonry-grid">
                {artworks.map((artwork, i) => (
                    <MosaicItem
                        key={artwork.id || i}
                        artwork={artwork}
                        index={i}
                        onClick={() => openArtwork(artwork)}
                    />
                ))}
            </div>

            {/* Scroll Observer Target */}
            <div ref={observerTarget} className="h-20 w-full" aria-hidden="true" />
        </div>
    );
}
