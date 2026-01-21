import { Link } from 'react-router-dom';
import { useCollection } from '../context/CollectionContext';
import MosaicGrid from '../components/gallery/MosaicGrid';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';

export default function Collection() {
    const { collection } = useCollection();

    return (
        <div className="min-h-screen bg-charcoal-ink text-dust-sand pt-24 md:pt-32 pb-20 relative overflow-hidden">

            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-turquoise-core/5 to-transparent pointer-events-none" />

            {/* Header Section */}
            <div className="container mx-auto px-4 mb-8 md:mb-16 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center justify-center p-3 mb-4 md:mb-6 rounded-full bg-turquoise-core/10 text-turquoise-core border border-turquoise-core/20"
                >
                    <Heart size={20} className="md:w-6 md:h-6 opacity-80" fill="currentColor" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="text-4xl md:text-7xl font-serif font-bold mb-2 md:mb-4 tracking-tight"
                >
                    Private Collection
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-soft-clay text-sm md:text-lg tracking-wide uppercase font-medium"
                >
                    {collection.length} {collection.length === 1 ? 'Masterpiece' : 'Masterpieces'} Curated
                </motion.p>
            </div>

            {/* Content Area */}
            {collection.length === 0 ? (
                <EmptyState />
            ) : (
                <MosaicGrid
                    artworks={collection}
                    hasMore={false} // Collections are fully loaded usually
                    lastElementRef={null}
                />
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
        >
            <div className="w-64 h-64 mb-8 rounded-full bg-gradient-to-tr from-white/5 to-transparent flex items-center justify-center backdrop-blur-sm border border-white/5">
                <Heart size={64} className="text-soft-clay/20" />
            </div>

            <h3 className="text-3xl font-serif mb-4 text-dust-sand">Your walls are bare</h3>
            <p className="text-soft-clay mb-8 max-w-md mx-auto leading-relaxed">
                Start your journey through art history. Save artworks you love to build your personal gallery.
            </p>

            <Link
                to="/explore"
                className="group flex items-center gap-2 px-8 py-4 bg-turquoise-core text-charcoal-ink font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105"
            >
                Start Collecting
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </motion.div>
    );
}
