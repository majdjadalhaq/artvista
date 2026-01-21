import { useRef } from 'react';
import { motion, useScroll, useTransform, useVelocity, useSpring, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useUI } from '../../context/UIContext';

function TiltCard({ art, spanClass, isLast, lastElementRef, openArtwork }) {
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => { x.set(0); y.set(0); };
    const imageSrc = art.image_large || art.imageUrl || art.image || art.image_small;

    return (
        <motion.div
            ref={isLast ? lastElementRef : cardRef}
            className={`relative group perspective-1000 ${spanClass}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ duration: 0.5 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="w-full h-full relative rounded-xl bg-charcoal-ink shadow-lg overflow-hidden border border-white/5"
            >
                <div onClick={() => openArtwork(art)} className="block w-full h-full cursor-pointer relative min-h-[250px]">
                    <div className="absolute inset-0 bg-gray-900 animate-pulse" />
                    <img src={imageSrc || '/placeholder-art.jpg'} alt={art.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-0 left-0 p-6 z-20">
                        <h3 className="text-dust-sand font-serif text-lg leading-tight mb-1 drop-shadow-md">{art.title}</h3>
                        <p className="text-turquoise-core text-xs font-bold uppercase tracking-wider">{art.artist}</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function MosaicGrid({ artworks, hasMore, lastElementRef }) {
    const { openArtwork } = useUI();
    
    // Filter out artworks with "Unknown" artists - only show art pieces
    const filteredArtworks = artworks.filter(art => art.artist && art.artist.toLowerCase() !== 'unknown');
    
    const getSpanClass = (index) => {
        const pattern = index % 10;
        if (pattern === 0) return 'col-span-2 row-span-2';
        if (pattern === 5) return 'col-span-2 row-span-1';
        if (pattern === 7) return 'col-span-1 row-span-2';
        return 'col-span-1 row-span-1';
    };

    if (!filteredArtworks || filteredArtworks.length === 0) return null;

    return (
        <div className="w-full min-h-screen px-4 md:px-8 lg:px-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-[2000px] mx-auto auto-dense">
                {filteredArtworks.map((art, i) => (
                    <TiltCard
                        key={`${art.id}-${i}`}
                        art={art}
                        spanClass={getSpanClass(i)}
                        openArtwork={openArtwork}
                        isLast={i === filteredArtworks.length - 1}
                        lastElementRef={lastElementRef}
                    />
                ))}
            </div>
        </div>
    );
}
