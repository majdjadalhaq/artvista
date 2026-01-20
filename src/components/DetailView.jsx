import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Info, ArrowLeft } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useCollections } from '../context/CollectionsContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import clsx from 'clsx';
import { useEffect } from 'react';

const DetailView = ({ item }) => {
    const { closeDetail } = useUI();
    const { addToCollection, removeFromCollection, isSaved } = useCollections();
    const saved = isSaved(item.id);

    useKeyboardNavigation({ onEscape: closeDetail });

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handleToggleSave = (e) => {
        e.stopPropagation();
        if (saved) {
            removeFromCollection(item.id);
        } else {
            addToCollection(item);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-black overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >

            {/* 1. Ambient Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.img
                    src={item.image_small || item.image}
                    className="w-full h-full object-cover blur-[80px] opacity-40 scale-150"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ duration: 1.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/50 to-transparent" />
            </div>

            {/* 2. Controls - Floating Top Layer */}
            <button
                onClick={closeDetail}
                className="absolute top-6 right-6 z-50 p-4 bg-white/5 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md transition-all duration-300 border border-white/10 group group-hover:rotate-90"
            >
                <X size={24} className="transition-transform duration-300 group-hover:rotate-90" />
            </button>

            {/* 3. Main Content Grid */}
            <div className="relative z-10 w-full h-full flex flex-col md:flex-row">

                {/* Left: Interactive Image Area (Hero) */}
                <div
                    className="w-full md:w-[65%] h-[50vh] md:h-full flex items-center justify-center p-8 md:p-20 relative cursor-grab active:cursor-grabbing"
                    onClick={closeDetail} // Clicking empty space closes
                >
                    <motion.img
                        src={item.image_large || item.image}
                        alt={item.title}
                        layoutId={`img-${item.id}`}
                        className="max-h-full max-w-full object-contain drop-shadow-2xl shadow-black relative z-20"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()} // Click on image doesn't close
                    />
                </div>

                {/* Right: Editorial Information Panel (Glassmorphism) */}
                <motion.div
                    className="w-full md:w-[35%] h-full bg-black/40 backdrop-blur-3xl border-l border-white/5 flex flex-col relative"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >

                    {/* Scrollable Content */}
                    <div className="flex-grow overflow-y-auto custom-scrollbar p-8 md:p-12">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
                                }
                            }}
                        >
                            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                                <span className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-[0.2em] text-art-accent border border-art-accent/30 rounded-full uppercase bg-art-accent/5">
                                    {item.year}
                                </span>

                                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-[1.1] mb-8 tracking-tight">
                                    {item.title}
                                </h1>

                                <div className="flex items-center gap-4 mb-12">
                                    <div className="h-[1px] w-12 bg-white/50" />
                                    <p className="text-xl md:text-2xl text-gray-200 font-light italic">
                                        {item.artist}
                                    </p>
                                </div>

                                <div className="space-y-8 text-gray-400 font-light text-lg leading-relaxed">
                                    <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-white first-letter:mr-3 first-letter:float-left">
                                        {item.description ? item.description.replace(/<[^>]*>?/gm, '') : "An exquisite piece from the collection, showcasing the unique style and mastery of the artist."}
                                    </p>

                                    <div className="bg-white/5 p-6 rounded-lg border border-white/5 mt-8 space-y-2 text-sm font-mono text-gray-500">
                                        <p className="flex justify-between"><span>Source</span> <span className="text-gray-300">{item.source}</span></p>
                                        <p className="flex justify-between"><span>ID</span> <span className="text-gray-300">{item.id}</span></p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="p-8 border-t border-white/10 bg-black/20 backdrop-blur-lg">
                        <button
                            onClick={handleToggleSave}
                            className={clsx(
                                "w-full py-5 rounded-sm flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em] font-bold transition-all duration-500 border group overflow-hidden relative",
                                saved
                                    ? "bg-transparent border-art-accent text-art-accent"
                                    : "bg-white text-black border-white hover:bg-transparent hover:text-white"
                            )}
                        >
                            {/* Button Hover Fill Effect */}
                            {!saved && <div className="absolute inset-0 bg-art-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0 opacity-20" />}

                            <Heart
                                className="relative z-10 transition-transform duration-300 group-hover:scale-125 group-active:scale-90"
                                size={20}
                                fill={saved ? "currentColor" : "none"}
                            />
                            <span className="relative z-10">{saved ? "Saved to Collection" : "Add to Collection"}</span>
                        </button>
                    </div>

                </motion.div>
            </div>
        </motion.div>
    );
};

export default DetailView;
