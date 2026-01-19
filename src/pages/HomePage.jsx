import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Home page component
 * Landing page with premium gallery aesthetic
 */
function HomePage() {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="text-center py-20 md:py-32 max-w-5xl mx-auto">
                <span className="inline-block px-4 py-1 mb-6 text-sm font-medium tracking-widest text-accent-primary uppercase border border-accent-primary/20 rounded-full">
                    Discover Art History
                </span>
                <h1 className="text-6xl md:text-8xl font-display font-bold text-text-primary mb-8 leading-tight">
                    Curate Your <br />
                    <span className="italic text-text-secondary">Digital Gallery</span>
                </h1>

                <p className="text-xl md:text-2xl text-text-secondary mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                    Explore over 100,000 artworks from the world's most prestigious museums.
                    Collect, categorize, and admire masterpieces from every era.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/explore"
                        className="px-8 py-4 bg-text-primary text-white font-medium rounded-full hover:bg-black transition-all hover:scale-105 shadow-lg"
                    >
                        Start Exploring
                    </Link>
                    <Link
                        to="/collections"
                        className="px-8 py-4 bg-surface text-text-primary border border-border font-medium rounded-full hover:bg-surface-hover transition-all"
                    >
                        View Collections
                    </Link>
                </div>
            </section>

            {/* Featured Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-4xl mx-auto px-4">
                {[
                    { label: 'Artworks', value: '100k+' },
                    { label: 'Museums', value: 'Global' },
                    { label: 'Styles', value: 'Diverse' },
                ].map((stat, index) => (
                    <div
                        key={stat.label}
                        className="p-8 bg-surface rounded-2xl border border-border text-center hover:border-accent-primary/20 transition-colors"
                    >
                        <div className="text-4xl font-display font-bold text-text-primary mb-2">
                            {stat.value}
                        </div>
                        <div className="text-sm uppercase tracking-wider text-text-secondary">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Features List */}
            <section className="py-20 border-t border-border">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-display font-bold mb-6">
                                Designed for <br />
                                <span className="text-accent-primary">Art Lovers</span>
                            </h2>
                            <p className="text-text-secondary mb-8 leading-relaxed">
                                ArtVista connects you directly to the Art Institute of Chicago's vast collection.
                                Experience art without barriers—high-resolution images, detailed history, and
                                curation tools at your fingertips.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'High-resolution viewing',
                                    'Detailed provenance & history',
                                    'Personal curation tools',
                                    'Advanced filtering & search'
                                ].map((item) => (
                                    <li key={item} className="flex items-center text-text-primary">
                                        <span className="w-2 h-2 bg-accent-primary rounded-full mr-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/5] bg-surface-hover rounded-lg overflow-hidden relative z-10">
                                {/* Decorative abstract art placeholder using CSS gradients */}
                                <div className="absolute inset-0 bg-gradient-to-br from-surface to-border opacity-50" />
                                <div className="absolute inset-0 flex items-center justify-center text-text-secondary/20 font-display text-9xl font-bold">
                                    Av
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-10 -right-10 w-full h-full border border-border rounded-lg -z-0 hidden md:block" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
