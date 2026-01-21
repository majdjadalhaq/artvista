import { useState, useCallback, memo, forwardRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCollection } from '../../context/CollectionContext';
import { Link } from 'react-router-dom';

const ArtworkCard = memo(forwardRef(function ArtworkCard({ artwork, index, className = '', onClick, gridMeta }, ref) {
    const { isSaved, addToCollection, removeFromCollection } = useCollection();
    const { performanceMode } = useUI();
    const saved = isSaved(artwork.id);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Helper to get best image source (prefer smaller thumbnails for grid performance)
    const getArtworkImage = useCallback(() => {
        // Prefer explicit small thumbnail fields
        const primary = artwork.image_small || artwork.thumbnail || artwork.image_url || artwork.imageUrl || artwork.image || artwork.image_large;
        if (!primary) return '/placeholder-art.jpg';
        // If IIIF from AIC, downscale to ~300px for grid
        if (typeof primary === 'string' && primary.includes('/iiif/2/') && primary.includes('/full/')) {
            try {
                const parts = primary.split('/iiif/2/');
                const idAndRest = parts[1];
                const id = idAndRest.split('/')[0];
                return `https://www.artic.edu/iiif/2/${id}/full/300,/0/default.jpg`;
            } catch {
                return primary;
            }
        }
        return primary;
    }, [artwork]);

    const toggleSave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        saved ? removeFromCollection(artwork.id) : addToCollection(artwork);
    }, [saved, artwork, addToCollection, removeFromCollection]);

    const handleImageLoad = useCallback(() => setImageLoaded(true), []);
    const handleImageError = useCallback(() => setImageError(true), []);

    const prefersReducedMotion = useReducedMotion();

    // Lightweight motion variants (transform-only, no heavy shadows)
    const cardVariants = {
        hover: {
            scale: 1.03,
            zIndex: 10,
            transition: { duration: 0.18, ease: 'easeOut' }
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

    const onKeyDown = useCallback((e) => {
        if (!gridMeta) return;
        const { index: i, columnCount, total } = gridMeta;
        let target = null;
        switch (e.key) {
            case 'ArrowRight':
                target = Math.min(i + 1, total - 1); break;
            case 'ArrowLeft':
                target = Math.max(i - 1, 0); break;
            case 'ArrowDown':
                target = Math.min(i + columnCount, total - 1); break;
            case 'ArrowUp':
                target = Math.max(i - columnCount, 0); break;
            default:
                return;
        }
        e.preventDefault();
        const el = document.querySelector(`[data-grid-index="${target}"]`);
        if (el) {
            const focusable = el.querySelector('[role="article"]');
            (focusable || el).focus({ preventScroll: false });
        }
    }, [gridMeta]);

    return (
        <motion.div
            ref={ref}
            custom={index}
            variants={cardVariants}
            initial={false}
            whileHover={!prefersReducedMotion ? 'hover' : undefined}
            whileFocus={!prefersReducedMotion ? 'hover' : undefined}
            whileTap={!prefersReducedMotion ? 'tap' : undefined}
            className={`group relative w-full aspect-[3/4] bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] overflow-hidden cursor-pointer transition-transform ${className}`}
            style={{ willChange: 'transform' }}
            onKeyDown={onKeyDown}
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
                            decoding="async"
                            fetchpriority="low"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            srcSet={(() => {
                                const src = getArtworkImage();
                                if (typeof src === 'string' && src.includes('/iiif/2/') && src.includes('/full/')) {
                                    try {
                                        const parts = src.split('/iiif/2/');
                                        const idAndRest = parts[1];
                                        const id = idAndRest.split('/')[0];
                                        const mk = (w) => `https://www.artic.edu/iiif/2/${id}/full/${w},/0/default.jpg ${w}w`;
                                        return [mk(200), mk(300), mk(400), mk(600), mk(800)].join(', ');
                                    } catch { /* noop */ }
                                }
                                // Fallback: no srcSet
                                return undefined;
                            })()}
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
                    className={`absolute inset-x-0 bottom-0 p-4 ${performanceMode ? 'bg-[var(--bg-secondary)]/60' : 'bg-[var(--bg-secondary)]/70'} border-t border-[var(--border)] transition-opacity`}
                    variants={overlayVariants}
                    initial="initial"
                    whileHover={performanceMode ? undefined : 'hover'}
                    whileFocus={performanceMode ? undefined : 'hover'}
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
