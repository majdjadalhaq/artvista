import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useUI } from '../../context/UIContext';

/**
 * FeaturedStrip — cinematic horizontal scroll showcase.
 *
 * Displays the first N artworks in a full-bleed horizontal strip
 * above the masonry grid. Each slide has a Ken Burns zoom loop and
 * shows title + artist on hover. Wheel events on the strip are
 * intercepted and converted to smooth horizontal scrolling via GSAP.
 * Clicking a slide opens the artwork detail view.
 */
const FEATURED_COUNT = 7;

function FeaturedSlide({ artwork, onClick }) {
    const imgRef = useRef(null);
    const imageUrl = artwork.image_large || artwork.imageUrl || artwork.image || artwork.image_small || artwork.image_url;

    // Ken Burns: slow zoom in/out loop
    useEffect(() => {
        if (!imgRef.current) return;
        const tween = gsap.fromTo(
            imgRef.current,
            { scale: 1 },
            { scale: 1.08, duration: 9, yoyo: true, repeat: -1, ease: 'sine.inOut' }
        );
        return () => tween.kill();
    }, []);

    return (
        <div
            onClick={onClick}
            className="group relative flex-shrink-0 cursor-pointer overflow-hidden"
            style={{ width: '62vw', minWidth: 280, maxWidth: 900, height: '100%', scrollSnapAlign: 'start' }}
        >
            {/* Image */}
            <div className="absolute inset-0 overflow-hidden">
                {imageUrl ? (
                    <img
                        ref={imgRef}
                        src={imageUrl}
                        alt={typeof artwork.title === 'string' ? artwork.title : 'Artwork'}
                        className="w-full h-full object-cover origin-center"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-graphite" />
                )}
            </div>

            {/* Dark gradient veil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Metadata — slides up on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-400 ease-out">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2 font-sans">
                    {typeof artwork.artist === 'string' && artwork.artist.toLowerCase() !== 'unknown'
                        ? artwork.artist : ''}
                </p>
                <h2 className="text-white font-serif text-2xl md:text-3xl leading-tight line-clamp-2 drop-shadow-md">
                    {typeof artwork.title === 'string' ? artwork.title : 'Untitled'}
                </h2>
                {artwork.year && (
                    <p className="text-white/40 text-sm font-sans mt-2 tracking-widest">{artwork.year}</p>
                )}
            </div>

            {/* Right-edge fade hint — suggests more content */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-charcoal-ink/60 to-transparent pointer-events-none" />
        </div>
    );
}

export default function FeaturedStrip({ artworks }) {
    const { openArtwork } = useUI();
    const stripRef = useRef(null);
    const scrollXRef = useRef(0);

    const featured = artworks.slice(0, FEATURED_COUNT);
    if (featured.length < 2) return null; // don't show if not enough data yet

    // Intercept vertical wheel → horizontal scroll via GSAP
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const el = stripRef.current;
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        scrollXRef.current = Math.max(0, Math.min(maxScroll, scrollXRef.current + e.deltaY * 1.2));
        gsap.to(el, { scrollLeft: scrollXRef.current, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
    }, []);

    useEffect(() => {
        const el = stripRef.current;
        if (!el) return;
        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    return (
        <section className="w-full" aria-label="Featured artworks">
            <div
                ref={stripRef}
                className="flex overflow-x-auto gap-1 hide-scrollbar"
                style={{ height: '60vh', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
            >
                {featured.map((artwork) => (
                    <FeaturedSlide
                        key={artwork.id}
                        artwork={artwork}
                        onClick={() => openArtwork(artwork)}
                    />
                ))}
            </div>
        </section>
    );
}
