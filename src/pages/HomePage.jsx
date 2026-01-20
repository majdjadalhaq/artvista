import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useArtData } from '../hooks/useArtData';
import { useUI } from '../context/UIContext';
import { ArrowDown } from 'lucide-react';

const HomePage = () => {
    // Fetch some beautiful art for the home grid
    const { data: artworks, loading } = useArtData("masterpiece", { page: 1, limit: 15 });
    const { openDetail } = useUI();

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const heroBlur = useTransform(scrollYProgress, [0, 0.4], ["blur(0px)", "blur(10px)"]);
    const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);

    return (
        <div ref={containerRef} className="relative bg-art-bg min-h-[250vh]">

            {/* Hero Section - Sticky */}
            <motion.section
                className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden"
                style={{ opacity: heroOpacity, filter: heroBlur, scale: heroScale }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-art-surface/20 to-art-bg pointer-events-none" />

                <h1 className="text-[12vw] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 leading-none tracking-tighter mix-blend-overlay">
                    ArtVista
                </h1>
                <p className="mt-8 text-xl tracking-[0.5em] text-art-accent font-light uppercase">
                    Enter the Gallery
                </p>

                <motion.div
                    className="absolute bottom-12 flex flex-col items-center gap-2 text-art-muted"
                    animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <ArrowDown size={20} />
                </motion.div>
            </motion.section>

            {/* Content Rising - Grid */}
            <div className="relative z-10 w-full min-h-screen bg-art-bg/95 backdrop-blur-sm -mt-[20vh] pt-32 pb-32 rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col gap-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif text-white">Curated Selection</h2>
                            <div className="w-12 h-1 bg-art-accent mx-auto mt-4" />
                        </div>

                        {loading ? (
                            <div className="h-96 flex items-center justify-center text-art-muted">Loading Gallery...</div>
                        ) : (
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                                {artworks.map((art, index) => (
                                    <motion.div
                                        key={art.id}
                                        layoutId={`card-${art.id}`}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-10%" }}
                                        transition={{ duration: 0.6, delay: index * 0.05 }}
                                        onClick={() => openDetail(art)}
                                        className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-sm"
                                    >
                                        <motion.img
                                            layoutId={`img-${art.id}`}
                                            src={art.image_small || art.image}
                                            alt={art.title}
                                            loading="lazy"
                                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                            <h3 className="text-white font-serif text-lg leading-tight">{art.title}</h3>
                                            <p className="text-art-accent text-sm mt-1">{art.artist}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
