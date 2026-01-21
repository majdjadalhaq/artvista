import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useUI } from '../../context/UIContext';
import { Link } from 'react-router-dom';

/**
 * 3D Tilt Card Component
 * Encapsulates the Tilt logic for better performance isolation
 */
function TiltCard({ art, spanClass, isLast, lastElementRef, openArtwork }) {
    const cardRef = useRef(null);

    // Mouse Position for 3D Tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth Tilt
    const rotateX = useTransform(y, [-0.5, 0.5], [7, -7]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-7, 7]);

    // Gloss/Sheen gradients based on mouse
    const sheenX = useTransform(x, [-0.5, 0.5], [0, 100]);
    const sheenY = useTransform(y, [-0.5, 0.5], [0, 100]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

        // Calculate normalized mouse position (-0.5 to 0.5)
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Smart Image Selection
    // Use Large Image for 2x2 (span-2) items, Small for others to save bandwidth
    const isLarge = spanClass.includes('col-span-2');
    const imageSrc = isLarge
        ? (art.image_large || art.image || art.image_small)
        : (art.image_small || art.image || art.image_large);

    return (
        <motion.div
            ref={isLast ? lastElementRef : cardRef}
            className={`relative group perspective-1000 ${spanClass}`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1000 }}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="w-full h-full relative rounded-xl bg-[var(--bg-secondary)] shadow-lg overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-turquoise-core/10"
            >
                <Link
                    to={`/artwork/${art.id}`}
                    onClick={(e) => {
                        e.preventDefault();
                        openArtwork(art);
                    }}
                    className="block w-full h-full relative h-[300px] md:h-full min-h-[300px]"
                >
                    {/* Image Layer */}
                    <div className="absolute inset-0 w-full h-full transform-gpu">
                        <img
                            src={imageSrc || '/placeholder-art.jpg'}
                            alt={art.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            loading="lazy"
                            decoding="async"
                        />
                        {/* Cinematic Vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/90 via-transparent to-transparent opacity-80" />

                        {/* Gloss Effect Overlay */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none"
                            style={{
                                backgroundPosition: useMotionTemplate`${sheenX}% ${sheenY}%`
                            }}
                        />
                    </div>

                    {/* Content Reveal Layer (Z-index lifted) */}
                    <div
                        className="absolute bottom-0 left-0 w-full p-6 translate-z-20"
                        style={{ transform: "translateZ(30px)" }} // Parallax Text
                    >
                        <h3 className="text-dust-sand font-serif text-xl md:text-2xl leading-none mb-2 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out drop-shadow-md">
                            {art.title}
                        </h3>

                        <div className="flex items-center justify-between translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 ease-out">
                            <p className="text-turquoise-core text-sm font-medium uppercase tracking-widest truncate max-w-[70%]">
                                {art.artist}
                            </p>

                            {/* Source Badge */}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border backdrop-blur-md ${art.source === 'Europeana'
                                ? 'bg-purple-500/20 border-purple-500/30 text-purple-200'
                                : 'bg-white/10 border-white/20 text-white/70'
                                }`}>
                                {art.source === 'Europeana' ? 'EU' : 'AIC'}
                            </span>
                        </div>
                    </div>
                </Link>
            </motion.div>
        </motion.div>
    );
}

/**
 * MosaicGrid - The Ultimate Grid
 * Redesigned for Best UI/UX + Performance + Cool Effects
 */
export default function MosaicGrid({ artworks, hasMore, lastElementRef }) {
    const containerRef = useRef(null);
    const { openArtwork } = useUI(); // MOVED TO TOP LEVEL - Fixes Hook Violation

    // Global Scroll Physics (Camera Warp)
    // We keep this subtle for "cinematic" feel without motion sickness
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 300 });
    const skewY = useTransform(smoothVelocity, [-2000, 2000], [-2, 2]); // Very subtle skew
    const scale = useTransform(smoothVelocity, [-2000, 0, 2000], [0.98, 1, 0.98]); // Breath effect

    // Layout Pattern Generator (Refined for Art)
    const getSpanClass = (index) => {
        const pattern = index % 10;
        // 0: Feature Hero (2x2)
        if (pattern === 0) return 'col-span-2 row-span-2';
        // 5: Landscape Feature (2x1)
        if (pattern === 5) return 'col-span-2 row-span-1';
        // 7: Portrait Feature (1x2) - Good for standing art
        if (pattern === 7) return 'col-span-1 row-span-2';
        return 'col-span-1 row-span-1';
    };

    if (!artworks || artworks.length === 0) return null;

    return (
        <div ref={containerRef} className="w-full min-h-screen px-4 md:px-8 lg:px-16 overflow-hidden">
            <motion.div
                style={{ skewY, scale }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-[2000px] mx-auto auto-dense will-change-transform"
            >
                {artworks.map((art, i) => (
                    <TiltCard
                        key={`${art.id}-${i}`}
                        art={art}
                        spanClass={getSpanClass(i)}
                        openArtwork={openArtwork}
                        isLast={i === artworks.length - 1}
                        lastElementRef={lastElementRef}
                    />
                ))}
            </motion.div>
        </div>
    );
}
