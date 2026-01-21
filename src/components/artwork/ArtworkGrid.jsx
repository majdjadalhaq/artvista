import ParallaxImage from './ParallaxImage';
import { motion } from 'framer-motion';

export default function ArtworkGrid({ artworks, loading, lastElementRef }) {
    if (loading && artworks.length === 0) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (!loading && artworks.length === 0) return <div className="h-screen flex items-center justify-center">No artworks found.</div>;

    return (
        <div className="min-h-screen px-4 md:px-12 py-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-24 w-full">
            {artworks.map((art, index) => {
                // Stagger effect: Offset standard grid positions
                const isEven = index % 2 === 0;
                const speed = isEven ? 0.8 : 1.2;
                const offsetClass = index % 3 === 1 ? 'md:mt-32' : (index % 3 === 2 ? 'md:-mt-16' : '');

                return (
                    <div
                        key={`${art.id}-${index}`}
                        className={`w-full aspect-[3/4] ${offsetClass}`}
                        ref={index === artworks.length - 1 ? lastElementRef : null}
                    >
                        <ParallaxImage
                            src={art.image || art.image_small || '/placeholder-art.jpg'}
                            alt={art.title}
                            artworkId={art.id}
                            title={art.title}
                            artist={art.artist}
                            description={art.description}
                            year={art.year}
                            medium={art.medium}
                            speed={speed}
                            className="w-full h-full shadow-2xl"
                        />
                    </div>
                );
            })}
        </div>
    );
}
