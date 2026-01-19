import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found page component
 * Displayed when user navigates to an invalid route
 */
function NotFoundPage() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
                <div className="text-8xl font-bold text-accent-primary mb-4">404</div>
                <h1 className="text-3xl font-display font-bold text-text-primary mb-4">
                    Page Not Found
                </h1>
                <p className="text-text-secondary mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-accent-primary text-white font-medium rounded-lg hover:bg-accent-primary/90 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default NotFoundPage;
