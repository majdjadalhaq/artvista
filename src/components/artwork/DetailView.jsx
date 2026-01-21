import { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { useCollection } from '../../context/CollectionContext';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { X, Heart, MapPin, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DetailView() {
    const { selectedArtwork, closeArtwork } = useUI();
    const { addToCollection, removeFromCollection, collection } = useCollection();


    useKeyboardNavigation({ onEscape: closeArtwork });

    if (!selectedArtwork) return null;

    const isSaved = collection.some(item => item.id === selectedArtwork.id);
    const imageSrc = selectedArtwork.image_large || selectedArtwork.image || selectedArtwork.imageUrl;
    const isKnownArtist = selectedArtwork.artist && selectedArtwork.artist.toLowerCase() !== 'unknown';

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.25, 0.4, 0.25, 1] }}
                className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-charcoal-ink overflow-hidden"
            >
                {/* Left Side - Artwork Image */}
                <div className="relative w-full h-[45dvh] md:h-full md:w-3/5 lg:w-2/3 bg-black overflow-hidden group">
                    {/* Blurred Backdrop */}
                    <div
                        className="absolute inset-0 opacity-20 scale-110 blur-xl transition-opacity duration-700"
                        style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />

                    {/* Main Image Container */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-8 md:p-12">
                        <motion.img
                            layoutId={`artwork-${selectedArtwork.id}`}
                            src={imageSrc}
                            alt={selectedArtwork.title}
                            className="max-w-full max-h-full object-contain shadow-2xl rounded-sm will-change-transform transform transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <button onClick={closeArtwork} className="md:hidden absolute top-4 right-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-black/70 transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Right Side - Info Panel */}
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ duration: 0.18, ease: [0.25, 0.4, 0.25, 1] }}
                    className="w-full h-[55dvh] md:h-full md:w-2/5 lg:w-1/3 bg-gradient-to-b from-charcoal-ink via-charcoal-ink to-black/80 border-l border-white/5 flex flex-col relative shadow-2xl overflow-hidden"
                >
                    {/* Close Button - Desktop */}
                    <div className="hidden md:flex justify-end p-6 pb-2">
                        <button onClick={closeArtwork} className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-8 py-2 md:py-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08, duration: 0.16 }}
                            className="space-y-6"
                        >
                            {/* Badge */}
                            <div>
                                <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-turquoise-core bg-turquoise-core/10 rounded-full border border-turquoise-core/30">
                                    {selectedArtwork.source}
                                </span>
                            </div>

                            {/* Artwork Title */}
                            <div>
                                <h1 className="text-2xl md:text-4xl font-serif text-dust-sand leading-tight mb-2">
                                    {selectedArtwork.title}
                                </h1>
                            </div>

                            {/* Artist Section - Only if Known */}
                            {isKnownArtist ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1, duration: 0.14 }}
                                    className="pt-4 border-t border-white/10"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Artist Avatar/Placeholder */}
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-turquoise-core/40 to-muted-copper/40 border border-turquoise-core/30 flex items-center justify-center flex-shrink-0">
                                                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                                                    <span className="text-sm font-serif text-turquoise-core">
                                                        {selectedArtwork.artist.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Artist Info */}
                                        <div className="flex-1 pt-1">
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Artist</p>
                                            <p className="text-soft-clay font-serif text-lg">
                                                {selectedArtwork.artist}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : null}

                            {/* Metadata Grid */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.12, duration: 0.13 }}
                                className="grid grid-cols-2 gap-4 py-4 border-y border-white/10"
                            >
                                {selectedArtwork.year && (
                                    <div>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Year</p>
                                        <p className="text-dust-sand font-medium">{selectedArtwork.year}</p>
                                    </div>
                                )}
                                {selectedArtwork.medium && (
                                    <div>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <Palette size={12} /> Medium
                                        </p>
                                        <p className="text-dust-sand font-medium text-sm">{selectedArtwork.medium}</p>
                                    </div>
                                )}
                                {selectedArtwork.origin && (
                                    <div className="col-span-2">
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <MapPin size={12} /> Origin
                                        </p>
                                        <p className="text-dust-sand font-medium text-sm">{selectedArtwork.origin}</p>
                                    </div>
                                )}
                            </motion.div>

                            {/* Description (plain text only) */}
                            {selectedArtwork.description && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.14, duration: 0.13 }}
                                >
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Description</p>
                                    <p className="text-soft-clay/90 leading-relaxed font-light text-sm line-clamp-6 whitespace-pre-line">
                                        {String(selectedArtwork.description).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>

                    {/* Action Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 0.16, duration: 0.13 }}
                        className="p-6 md:p-8 border-t border-white/5 bg-black/40 backdrop-blur-md flex-shrink-0"
                    >
                        <button
                            onClick={() => isSaved ? removeFromCollection(selectedArtwork.id) : addToCollection(selectedArtwork)}
                            className={`w-full py-3 md:py-4 rounded-lg uppercase tracking-widest text-xs font-bold transition-all flex items-center justify-center gap-3 shadow-lg transform hover:scale-105 active:scale-95 ${isSaved
                                ? 'bg-muted-copper text-white border border-muted-copper/50 hover:bg-muted-copper/90'
                                : 'bg-turquoise-core text-charcoal-ink border border-turquoise-core/50 hover:bg-white'
                                }`}
                        >
                            <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                            {isSaved ? 'In Collection' : 'Add to Collection'}
                        </button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
