import { motion } from 'framer-motion';
import { Trash2, ExternalLink } from 'lucide-react';
import { useCollections } from '../context/CollectionsContext';
import { useUI } from '../context/UIContext';
import { Link } from 'react-router-dom';

const CollectionsPage = () => {
    const { savedArtworks, removeFromCollection } = useCollections();
    const { openDetail } = useUI();

    return (
        <div className="min-h-screen pt-32 px-6 md:px-12 pb-20 max-w-7xl mx-auto">
            <header className="mb-16 border-b border-white/10 pb-8">
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">
                    Your Collection
                </h1>
                <p className="text-art-muted">
                    {savedArtworks.length} {savedArtworks.length === 1 ? 'artwork' : 'artworks'} curated
                </p>
            </header>

            {savedArtworks.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center gap-6"
                >
                    <div className="w-24 h-24 rounded-full border border-dashed border-art-muted flex items-center justify-center text-art-muted">
                        <span className="text-4xl">+</span>
                    </div>
                    <h2 className="text-2xl text-white font-serif">Your gallery is empty</h2>
                    <p className="text-art-muted max-w-md">Start exploring the museum to curate your own personal collection of masterpieces.</p>
                    <Link to="/explore" className="px-8 py-3 bg-art-accent text-black font-bold uppercase tracking-widest hover:bg-white transition-colors mt-4">
                        Start Exploring
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {savedArtworks.map((art, index) => (
                        <motion.div
                            layout
                            key={art.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative bg-art-surface rounded-sm overflow-hidden shadow-lg border border-white/5"
                        >
                            <div onClick={() => openDetail(art)} className="cursor-pointer aspect-[4/5] overflow-hidden">
                                <img src={art.image} alt={art.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>

                            <div className="p-4 flex justify-between items-start">
                                <div onClick={() => openDetail(art)} className="cursor-pointer">
                                    <h3 className="text-white font-serif line-clamp-1">{art.title}</h3>
                                    <p className="text-art-accent text-xs mt-1">{art.artist}</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFromCollection(art.id); }}
                                    className="p-2 text-art-muted hover:text-red-400 transition-colors"
                                    title="Remove from collection"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CollectionsPage;
