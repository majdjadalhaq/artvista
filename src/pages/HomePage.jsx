import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Home page component
 * Landing page with hero section and call-to-action
 */
function HomePage() {
    return (
        <div className="max-w-4xl mx-auto text-center py-12">
            {/* Hero Section */}
            <h1 className="text-6xl md:text-7xl font-display font-bold text-text-primary mb-6">
                Welcome to ArtVista
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-2xl mx-auto">
                Discover and collect masterpieces from world-renowned museums.
                Explore thousands of artworks, create personal collections, and immerse yourself in art history.
            </p>

            {/* Featured Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
                <div className="p-6 bg-surface rounded-lg border border-border">
                    <div className="text-3xl font-bold text-accent-primary mb-2">10,000+</div>
                    <div className="text-sm text-text-secondary">Artworks</div>
                </div>
                <div className="p-6 bg-surface rounded-lg border border-border">
                    <div className="text-3xl font-bold text-accent-primary mb-2">Multiple</div>
                    <div className="text-sm text-text-secondary">Museums</div>
                </div>
                <div className="p-6 bg-surface rounded-lg border border-border">
                    <div className="text-3xl font-bold text-accent-primary mb-2">Custom</div>
                    <div className="text-sm text-text-secondary">Collections</div>
                </div>
            </div>

            {/* Call to Action */}
            <Link
                to="/explore"
                className="inline-block px-8 py-4 bg-accent-primary text-white font-medium rounded-lg hover:bg-accent-primary/90 transition-colors shadow-lg hover:shadow-xl"
            >
                Explore Gallery
            </Link>

            {/* Additional Info */}
            <div className="mt-16 text-left max-w-2xl mx-auto">
                <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
                    Features
                </h2>
                <ul className="space-y-3 text-text-secondary">
                    <li className="flex items-start">
                        <span className="text-accent-primary mr-2">✓</span>
                        <span>Browse artworks from Art Institute of Chicago and more</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-accent-primary mr-2">✓</span>
                        <span>Filter by artist, medium, era, and keywords</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-accent-primary mr-2">✓</span>
                        <span>Create and manage personal collections</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-accent-primary mr-2">✓</span>
                        <span>View detailed artwork information and high-resolution images</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default HomePage;
