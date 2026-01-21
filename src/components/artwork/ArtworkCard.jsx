import { useState, useCallback, memo, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Maximize2 } from 'lucide-react';
import { useCollection } from '../../context/CollectionContext';
import { Link } from 'react-router-dom';

const ArtworkCard = memo(forwardRef(function ArtworkCard({ artwork, index, className = '', onClick }, ref) {
    const { isSaved, addToCollection, removeFromCollection } = useCollection();
    const saved = isSaved(artwork.id);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Helper to get best image source, returns null if none
    const getArtworkImage = useCallback(() => {
        return (
            artwork.image_large ||
            artwork.imageUrl ||
            artwork.image ||
            artwork.image_small ||
            artwork.image_url ||
            null
        );
    }, [artwork]);

    const toggleSave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        saved ? removeFromCollection(artwork.id) : addToCollection(artwork);
    }, [saved, artwork, addToCollection, removeFromCollection]);

    // Card Parent Variants
    const mainVariants = {
        hidden: { opacity: 0, y: 20 },
        idle: { opacity: 1, y: 0 },
        hover: { transition: { duration: 0.2 } }
    };

    const imageVariants = {
        idle: { scale: 1, filter: 'brightness(1)' },
        hover: { scale: 1.02, filter: 'brightness(1.05)' }
    };

    const overlayVariants = {
        hidden: { opacity: 0, y: 20 },
        idle: { opacity: 0, y: 20 },
        hover: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
        }
    };

    const actionsVariants = {
        hidden: { opacity: 0, x: 20 },
        idle: { opacity: 0, x: 20 },
        hover: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, delay: 0.1, ease: 'easeOut' }
        }
    };

    return (
        <motion.div
            ref={ref}
            variants={mainVariants}
            initial="hidden"
            animate="idle"
            whileHover="hover"
            className={`group relative w-full mb-6 break-inside-avoid rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-500 bg-charcoal-surface ${className}`}
        >
            <Link
                to={`/artwork/${artwork.id}`}
                onClick={(e) => onClick && (e.preventDefault(), onClick(e))}
                className="block w-full h-full relative"
            >
                {/* Image Container - No fixed aspect ratio, adapts to image */}
                <div className="relative w-full overflow-hidden bg-gray-900">

                    {/* Placeholder / Loading Skeleton */}
                    {!imageLoaded && !imageError && (
                        <div className="absolute inset-0 z-0 bg-gray-800 animate-pulse min-h-[200px]" />
                    )}

                    {/* Show fallback if image fails or is missing */}
                    {(!imageError && getArtworkImage()) ? (
                        <motion.img
                            variants={imageVariants}
                            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                            src={getArtworkImage()}
                            alt={typeof artwork.title === 'string' ? artwork.title : 'Artwork'}
                            className={`w-full h-auto object-cover block align-bottom transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                            loading="lazy"
                        />
                    ) : (
                        <img
                            src="/placeholder-art.jpg"
                            alt="Artwork unavailable"
                            className="w-full h-auto object-cover block align-bottom opacity-80"
                            style={{ minHeight: 200 }}
                        />
                    )}

                    {/* Gradient Overlay for Text Readability - Only on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Glassmorphic Actions (Top Right) */}
                    <motion.div
                        variants={actionsVariants}
                        className="absolute top-4 right-4 flex flex-col gap-2 z-20 pointer-events-none group-hover:pointer-events-auto"
                    >
                        <button
                            onClick={toggleSave}
                            className={`p-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg transition-transform active:scale-95 flex items-center justify-center
                                ${saved ? 'bg-white/90 text-red-500' : 'bg-black/40 text-white hover:bg-white hover:text-red-500'}`}
                            aria-label="Save artwork"
                        >
                            <Heart size={18} className={saved ? 'fill-current' : ''} />
                        </button>
                        <div className="p-3 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-white hover:text-black transition-colors">
                            <Maximize2 size={18} />
                        </div>
                    </motion.div>

                    {/* Metadata Overlay (Bottom) */}
                    <motion.div
                        variants={overlayVariants}
                        className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white transform-gpu"
                    >
                        <h3 className="font-serif text-xl md:text-2xl font-medium tracking-tight leading-none mb-2 line-clamp-2 drop-shadow-md">
                            {typeof artwork.title === 'string' ? artwork.title : 'Untitled'}
                        </h3>
                        <div className="flex items-center justify-between text-white/80 text-sm font-sans tracking-wide">
                            <span className="truncate pr-4 border-r border-white/20 mr-4">
                                {typeof artwork.artist === 'string' ? artwork.artist : 'Unknown Artist'}
                            </span>
                            <span className="whitespace-nowrap tabular-nums opacity-70">
                                {typeof artwork.year === 'string' ? artwork.year : ''}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </Link>
        </motion.div>
    );
}));

export default ArtworkCard;
