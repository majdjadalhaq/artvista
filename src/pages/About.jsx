import PageTransition from '../components/animations/PageTransition';

export default function About() {
    return (
        <PageTransition>
            <div className="min-h-screen pt-24 pb-12 bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-center">About ArtVista</h1>

                    <div className="prose prose-lg dark:prose-invert mx-auto">
                        <p className="lead text-xl text-[var(--text-secondary)] mb-8 text-center">
                            ArtVista is a digital museum experience designed to bring the world's most beautiful artworks to your screen.
                        </p>

                        <h3>Project Vision</h3>
                        <p>
                            Bringing museum-quality art to the digital space with cinematic interactions and seamless performance.
                            This project showcases modern web development techniques including React, Three.js, and Framer Motion.
                        </p>

                        <h3>Data Source</h3>
                        <p>
                            All artwork data and images are provided by the
                            <a href="https://api.artic.edu/docs/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline ml-1">
                                Art Institute of Chicago API
                            </a>.
                            We are grateful for their open access policy which makes projects like this possible.
                        </p>

                        <div className="mt-12 p-8 bg-[var(--bg-secondary)] rounded-2xl text-center">
                            <p className="font-bold mb-2">Developed by</p>
                            <p className="text-2xl font-serif">Majd Jadalhaq</p>
                            <div className="mt-4 flex justify-center gap-4">
                                <a href="#" className="px-4 py-2 border border-[var(--border)] rounded-full text-sm hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors">GitHub</a>
                                <a href="#" className="px-4 py-2 border border-[var(--border)] rounded-full text-sm hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors">Portfolio</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
