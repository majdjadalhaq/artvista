import { useState, useCallback, memo, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useCollection } from '../../context/CollectionContext';
import { Link } from 'react-router-dom';

const ArtworkCard = memo(forwardRef(function ArtworkCard({ artwork, index, className = '', onClick }, ref) {
    const { isSaved, addToCollection, removeFromCollection } = useCollection();
    const saved = isSaved(artwork.id);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Helper to get best image source
    const getArtworkImage = useCallback(() => (
        artwork.image_large || artwork.image || artwork.image_url || artwork.imageUrl || '/placeholder-art.jpg'
    ), [artwork]);

    const toggleSave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        saved ? removeFromCollection(artwork.id) : addToCollection(artwork);
    }, [saved, artwork, addToCollection, removeFromCollection]);

    const handleImageLoad = useCallback(() => setImageLoaded(true), []);
    const handleImageError = useCallback(() => setImageError(true), []);

    // Framer Motion Variants
    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.03,
                duration: 0.32,
                ease: [0.25, 0.4, 0.25, 1],
            }
        }),
        hover: {
            scale: 1.05,
            zIndex: 10,
            boxShadow: '0 8px 32px -8px var(--accent-primary), 0 2px 8px -2px var(--accent-primary)',
            transition: { duration: 0.22, ease: 'easeOut' }
        },
        tap: { scale: 0.98 }
    };

    const overlayVariants = {
        initial: { opacity: 0, y: 20 },
        hover: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.22, ease: 'easeOut', delay: 0.08 }
        }
    };

    return (
        <motion.div
            ref={ref}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover="hover"
            whileFocus="hover"
            whileTap="tap"
            className={`group relative w-full aspect-[3/4] bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] overflow-hidden cursor-pointer shadow-md transition-all will-change-transform ${className}`}
            tabIndex={0}
            role="article"
            aria-label={`View artwork: ${artwork.title} by ${artwork.artist || 'Unknown Artist'}`}
        >
            <Link
                to={`/artwork/${artwork.id}`}
                onClick={(e) => {
                    if (onClick) {
                        e.preventDefault();
                        onClick(e);
                    }
                }}
                className="block w-full h-full relative z-0"
            >
                {/* Image Container */}
                <div className="w-full h-full relative overflow-hidden bg-[var(--bg-primary)]">
                    {/* Noise overlay for archival texture */}
                    <div className="absolute inset-0 pointer-events-none z-10 opacity-10 noise-bg" />

                    {/* Skeleton / Loading State */}
                    {!imageLoaded && !imageError && (
                        <div className="absolute inset-0 animate-pulse bg-gray-800" />
                    )}

                    {/* Artwork Image or Placeholder */}
                    {!imageError ? (
                        <motion.img
                            src={getArtworkImage()}
                            alt={artwork.title || 'Artwork'}
                            className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            loading="lazy"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            draggable={false}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-[var(--bg-secondary)]">
                            <span className="text-[var(--accent-warm)] font-serif text-lg opacity-70">No Image</span>
                        </div>
                    )}

                    {/* Subtle gradient for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)]/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                {/* Metadata Overlay - Reveal on Hover/Focus */}
                <motion.div
                    className="absolute inset-x-0 bottom-0 p-4 bg-[var(--bg-secondary)]/80 backdrop-blur-md border-t border-[var(--border)] transition-all"
                    variants={overlayVariants}
                    initial="initial"
                    whileHover="hover"
                    whileFocus="hover"
                    aria-hidden="true"
                >
                    <h3 className="font-serif text-lg font-bold text-[var(--accent-warm)] leading-tight mb-1 truncate">
                        {artwork.title}
                    </h3>
                    <p className="text-sm font-sans text-[var(--text-secondary)] mb-1 truncate">
                        {artwork.artist || 'Unknown Artist'}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-[var(--text-primary)] opacity-70">
                            {artwork.year || 'N/A'}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[var(--accent-primary)] opacity-80">
                            {artwork.source}
                        </span>
                    </div>
                </motion.div>
            </Link>

            {/* Favorite Button (outside Link for accessibility) */}
            <motion.button
                onClick={toggleSave}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm z-20 transition-opacity
                    ${saved
                        ? 'bg-[var(--bg-primary)]/40 text-red-500 opacity-100'
                        : 'bg-[var(--bg-primary)]/20 text-[var(--text-primary)] opacity-0 group-hover:opacity-100 group-focus:opacity-100'
                    }`}
                aria-label={saved ? "Remove from favorites" : "Add to favorites"}
            >
                <Heart size={18} className={saved ? 'fill-red-500' : ''} />
            </motion.button>
        </motion.div>
    );
}));

export default ArtworkCard;
