import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function RelatedCarousel({ artworks }) {
    const scrollRef = useRef(null);

    if (!artworks || artworks.length === 0) return null;

    return (
        <div className="py-12 border-t border-[var(--border)]">
            <h3 className="text-2xl font-serif font-bold mb-8 px-4">More by this Artist</h3>

            <div className="relative overflow-hidden group">
                <motion.div
                    ref={scrollRef}
                    className="flex gap-6 px-4 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
                    whileTap={{ cursor: "grabbing" }}
                >
                    {artworks.map((art, i) => (
                        <motion.div
                            key={art.id}
                            className="min-w-[280px] md:min-w-[320px] snap-center"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link to={`/artwork/${art.id.replace('aic-', '')}`} className="block group/card">
                                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[var(--bg-secondary)] mb-3 relative">
                                    <img
                                        src={art.image_small || art.thumbnail || '/placeholder-art.jpg'}
                                        alt={art.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition-colors" />
                                </div>
                                <h4 className="font-medium text-lg leading-tight group-hover/card:text-[var(--accent-primary)] transition-colors">{art.title}</h4>
                                <p className="text-sm text-[var(--text-secondary)]">{art.year}</p>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Fade edges */}
                <div className="absolute top-0 bottom-8 left-0 w-12 bg-gradient-to-r from-[var(--bg-primary)] to-transparent pointer-events-none" />
                <div className="absolute top-0 bottom-8 right-0 w-12 bg-gradient-to-l from-[var(--bg-primary)] to-transparent pointer-events-none" />
            </div>
        </div>
    );
}
