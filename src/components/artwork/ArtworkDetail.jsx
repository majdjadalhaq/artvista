import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../context/UIContext';
import { useCollections } from '../context/CollectionsContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

export default function ArtworkDetail() {
    const { selectedArtwork, closeArtwork } = useUI();
    const { add, remove, items } = useCollections();

    useKeyboardNavigation({ onEscape: closeArtwork });

    if (!selectedArtwork) return null;

    const isSaved = items.some(i => i.id === selectedArtwork.id);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeArtwork}
        >
            <motion.div
                className="bg-[var(--bg-secondary)] border border-[var(--border)] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row rounded-lg shadow-2xl"
                layoutId={`card-${selectedArtwork.id}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="w-full md:w-1/2 bg-[var(--bg-primary)] relative">
                    <motion.img
                        layoutId={`img-${selectedArtwork.id}`}
                        src={selectedArtwork.image}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col justify-center">
                    <h2 className="text-4xl font-serif text-[var(--text-primary)] mb-2">{selectedArtwork.title}</h2>
                    <p className="text-xl text-[var(--accent-muted)] italic mb-6">{selectedArtwork.artist}</p>
                    <div className="text-[var(--text-secondary)] space-y-4 mb-8">
                        <p className="border-l-2 border-[var(--accent-primary)] pl-4">
                            {selectedArtwork.year} • {selectedArtwork.medium_display || 'Unknown Medium'}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {selectedArtwork.description === "No details available."
                                ? "A masterpiece from the collection."
                                : selectedArtwork.description}
                        </p>
                    </div>

                    <button
                        onClick={() => isSaved ? remove(selectedArtwork.id) : add(selectedArtwork)}
                        className={`py-3 px-6 uppercase tracking-widest font-bold text-sm border transition-colors ${isSaved
                            ? 'bg-transparent text-red-500 border-red-500 hover:bg-red-500 hover:text-[var(--bg-primary)]'
                            : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--bg-secondary)]'
                            }`}
                    >
                        {isSaved ? 'Remove from Collection' : 'Add to Collection'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
