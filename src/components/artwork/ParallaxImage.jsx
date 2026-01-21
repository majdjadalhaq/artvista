import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useUI } from '../../context/UIContext';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxImage({ src, alt, speed = 1, className, artworkId, title, artist, description, year, medium }) {
    const containerRef = useRef(null);
    const imgRef = useRef(null);
    const { openArtwork } = useUI();

    useEffect(() => {
        const el = containerRef.current;
        const img = imgRef.current;
        if (!el || !img) return;

        // Create specific ScrollTrigger for this instance
        const ctx = gsap.context(() => {
            gsap.fromTo(img,
                { y: '-15%', scale: 1.1 },
                {
                    y: '15%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );
        }, el); // Scope to element

        return () => {
            ctx.revert(); // Clean cleanup using gsap.context
        };
    }, []);

    const handleClick = (e) => {
        e.preventDefault();
        openArtwork({
            id: artworkId,
            title,
            artist,
            image: src,
            description,
            year: year || 'Unknown',
            medium_display: medium || 'Art'
        });
    };

    return (
        <div ref={containerRef} className={`relative overflow-hidden group ${className}`}>
            <a href={`/artwork/${artworkId}`} onClick={handleClick} className="block w-full h-full cursor-none">
                <div className="w-full h-[120%] -mt-[10%] relative">
                    <img
                        ref={imgRef}
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover filter sepia-[0.2] contrast-[1.1] brightness-[0.9] group-hover:sepia-0 group-hover:contrast-100 group-hover:brightness-100 transition-all duration-700 ease-out"
                        loading="lazy"
                    />
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

                {/* Text Reveal on Hover */}
                <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 text-white mix-blend-difference pointer-events-none">
                    <h3 className="font-serif text-lg italic">{title}</h3>
                    <p className="text-xs uppercase tracking-widest">{artist}</p>
                </div>
            </a>
        </div>
    );
}
