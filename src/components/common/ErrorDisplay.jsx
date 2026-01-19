import React from 'react';

/**
 * Universal Error Display Component
 * Shows a user-friendly error message with a retry action
 */
function ErrorDisplay({ title = 'Something went wrong', message, onRetry }) {
    return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 text-center bg-surface border border-border rounded-lg m-4">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
                {title}
            </h2>
            <p className="text-text-secondary mb-6 max-w-md">
                {message || 'An unexpected error occurred. Please try again later.'}
            </p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors"
                >
                    Try Again
                </button>
            )}

            <div className="mt-8 text-xs text-text-secondary">
                If this persists, please refresh the page.
            </div>
        </div>
    );
}

export default ErrorDisplay;
