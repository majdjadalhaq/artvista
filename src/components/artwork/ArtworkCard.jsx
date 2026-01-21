import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useCollection } from '../../context/CollectionContext';
import { Link } from 'react-router-dom';

export default function ArtworkCard({ artwork, index }) {
    const { isSaved, addToCollection, removeFromCollection } = useCollection();
    const saved = isSaved(artwork.id);
    const [isHovered, setIsHovered] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const cardRef = useRef(null);

    const updateCoords = () => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height,
                right: rect.right // Store right for checking overflow if needed
            });
        }
    };

    const handleMouseEnter = () => {
        updateCoords();
        setIsHovered(true);
    };

    const handleMouseLeave = () => setIsHovered(false);

    const toggleSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        saved ? removeFromCollection(artwork.id) : addToCollection(artwork);
    };

    return (
        <>
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative w-full aspect-[3/4] cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Link to={`/artwork/${artwork.id}`} className="block w-full h-full relative">
                    <div className="absolute inset-0 bg-[var(--bg-secondary)] rounded-lg overflow-hidden shadow-md">
                        <img
                            src={artwork.image_url || '/placeholder-art.jpg'}
                            alt={artwork.title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                </Link>
            </motion.div>

            {/* Portal Hover Card - Guaranteed to be on top */}
            {createPortal(
                <AnimatePresence>
                    {isHovered && (
                        <div
                            className="absolute pointer-events-none z-[9999]"
                            style={{
                                top: coords.top,
                                left: coords.left,
                                width: coords.width,
                                height: coords.height
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1.05, y: -10 }}
                                exit={{ opacity: 0, scale: 0.95, y: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className="absolute top-0 left-0 w-full h-auto min-h-full bg-[var(--bg-primary)] rounded-lg shadow-2xl overflow-hidden border border-[var(--border)] pointer-events-auto"
                            >
                                <div className="relative h-full flex flex-col">
                                    {/* Image Clone for seamless feel */}
                                    <div className="aspect-[3/4] w-full relative">
                                        <img
                                            src={artwork.image_url || '/placeholder-art.jpg'}
                                            alt={artwork.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent" />
                                    </div>

                                    {/* Info Content */}
                                    <div className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--border)]">
                                        <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] leading-tight mb-1">{artwork.title}</h3>
                                        <p className="text-sm text-[var(--accent-primary)] mb-2">{artwork.artist}</p>
                                        <p className="text-xs text-[var(--text-secondary)]">{artwork.year}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-[var(--accent-secondary)] mt-1 opacity-70">
                                            {artwork.source}
                                        </p>

                                        <button
                                            onClick={toggleSave}
                                            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md bg-[var(--bg-primary)]/20 hover:bg-[var(--bg-primary)]/40 transition-all ${saved ? 'text-red-500 fill-current' : 'text-[var(--text-primary)]'}`}
                                        >
                                            <Heart size={18} className={saved ? 'fill-red-500' : ''} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
