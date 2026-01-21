import { motion } from 'framer-motion';
import { ImageOff, RotateCcw } from 'lucide-react';

export default function EmptyResult({ onReset }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
        >
            <div className="bg-white/5 p-6 rounded-full mb-6 border border-white/10 backdrop-blur-sm">
                <ImageOff size={48} className="text-soft-clay/50" />
            </div>

            <h3 className="text-2xl font-serif text-dust-sand mb-2">
                No masterpieces found
            </h3>

            <p className="text-soft-clay max-w-md mb-8">
                We couldn't find any artworks matching your search filters. Try adjusting your terms or clearing the filters to start fresh.
            </p>

            <button
                onClick={onReset}
                className="group flex items-center gap-2 px-6 py-3 bg-turquoise-core/10 hover:bg-turquoise-core/20 text-turquoise-core rounded-full transition-all border border-turquoise-core/30 hover:border-turquoise-core"
            >
                <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
                <span className="font-semibold tracking-wide text-sm">Clear Filters & Explore</span>
            </button>
        </motion.div>
    );
}
