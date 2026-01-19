import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollSection from '../components/animations/ScrollSection';
import { getImageUrl } from '../services/artInstituteAPI';

/**
 * HomePage Component
 * Redesigned with premium interactive scroll animations
 */
function HomePage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Featured Artwork IDs for demo (Seurat, Van Gogh, Monet)
    const featuredIds = ['27992', '87088', '111624'];

    return (
        <div ref={containerRef} className="bg-canvas overflow-x-hidden">

            {/* 1. Hero Section with Parallax */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <motion.div
                        style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '50%']) }}
                        className="w-full h-[120%] -mt-[10%]"
                    >
                        <img
                            src={getImageUrl('27992', '843')}
                            alt="Hero Background"
                            className="w-full h-full object-cover opacity-60 grayscale-[30%]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-canvas" />
                    </motion.div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl">
                    <ScrollSection type="fade-up" speed={0.2}>
                        <span className="inline-block text-accent-primary font-medium tracking-[0.5em] uppercase mb-4 text-sm md:text-base">
                            The Digital Collection
                        </span>
                    </ScrollSection>

                    <ScrollSection type="fade-up" speed={0.4}>
                        <h1 className="text-6xl md:text-9xl font-display font-bold text-text-primary mb-6 leading-none mix-blend-overlay">
                            ArtVista
                        </h1>
                    </ScrollSection>

                    <ScrollSection type="fade-up" speed={0.6}>
                        <p className="text-xl md:text-2xl text-text-primary/80 font-light max-w-xl mx-auto mb-10 leading-relaxed">
                            Curating the world's beauty, one pixel at a time.
                        </p>

                        <Link
                            to="/explore"
                            className="inline-flex items-center gap-2 text-text-primary border-b border-text-primary pb-1 hover:text-accent-primary hover:border-accent-primary transition-all group"
                        >
                            Enter Gallery
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </ScrollSection>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-text-secondary text-xs uppercase tracking-widest flex flex-col items-center gap-2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Scroll
                    <div className="w-[1px] h-12 bg-text-secondary/50" />
                </motion.div>
            </section>

            {/* 2. Editorial Text Section */}
            <section className="py-24 md:py-40 px-6 container-custom">
                <ScrollSection>
                    <div className="max-w-4xl mx-auto text-center md:text-left">
                        <h2 className="text-4xl md:text-7xl font-display leading-tight mb-12 text-text-primary">
                            <span className="block text-text-secondary/40 text-2xl md:text-4xl mb-4 italic font-serif">Our Philosophy</span>
                            Art is not just seen,<br />
                            it is <span className="text-accent-primary italic">experienced.</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 text-lg md:text-xl text-text-secondary font-light">
                            <p>
                                We believe that great art should be accessible to everyone, everywhere.
                                ArtVista connects you directly to the archives of the Art Institute of Chicago,
                                bringing centuries of human creativity to your screen.
                            </p>
                            <p>
                                Explore high-resolution masterpieces, uncover hidden details, and curate your
                                own personal collection. This is your private museum, open 24/7.
                            </p>
                        </div>
                    </div>
                </ScrollSection>
            </section>

            {/* 3. Featured Horizontal Scroll */}
            <section className="py-20 bg-surface border-y border-border overflow-hidden">
                <div className="container-custom mb-12 flex items-end justify-between">
                    <ScrollSection>
                        <h3 className="text-3xl font-display font-bold">Featured Masterpieces</h3>
                    </ScrollSection>
                    <Link to="/explore" className="text-sm uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors">
                        View All
                    </Link>
                </div>

                {/* Horizontal Container */}
                <div className="flex gap-6 overflow-x-auto pb-12 px-6 snap-x md:px-20 scrollbar-hide">
                    {featuredIds.map((id, index) => (
                        <motion.div
                            key={id}
                            className="flex-shrink-0 w-80 md:w-96 snap-center group cursor-pointer"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4 relative">
                                <img
                                    src={getImageUrl(id, '843')}
                                    alt="Featured Artwork"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                            <h4 className="font-display text-xl font-bold group-hover:text-accent-primary transition-colors">Masterpiece #{index + 1}</h4>
                            <p className="text-text-secondary text-sm">Famous Artist</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 4. Interactive Call to Action */}
            <section className="h-[80vh] flex items-center justify-center relative bg-black text-white text-center px-4 overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-[50vh] h-[50vh] bg-accent-primary/50 blur-[100px] rounded-full mix-blend-screen" />
                    <div className="absolute bottom-0 left-0 w-[60vh] h-[60vh] bg-blue-600/30 blur-[120px] rounded-full mix-blend-screen" />
                </div>

                <ScrollSection type="sticky">
                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-8xl font-display font-bold mb-8 tracking-tight">
                            Start Your Collection
                        </h2>
                        <Link
                            to="/explore"
                            className="inline-block px-12 py-5 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:bg-transparent hover:text-white hover:border hover:border-white transition-all duration-300"
                        >
                            Begin Journey
                        </Link>
                    </div>
                </ScrollSection>
            </section>
        </div>
    );
}

export default HomePage;
