import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] p-8 text-center">
                    <div>
                        <h1 className="text-4xl font-serif mb-4">Something went wrong.</h1>
                        <p className="font-sans text-[var(--text-secondary)] mb-8">
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded hover:opacity-90 transition-opacity font-sans"
                        >
                            Refresh Page
                        </button>
                        {process.env.NODE_ENV === 'development' && (
                            <pre className="mt-8 text-left text-xs text-red-500 overflow-auto max-w-2xl bg-gray-100 p-4 rounded">
                                {this.state.error?.toString()}
                            </pre>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
