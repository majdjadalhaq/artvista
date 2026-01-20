import { motion } from 'framer-motion';
import { Search, Filter, XCircle } from 'lucide-react';
import { useSearchAndFilter } from '../hooks/useSearchAndFilter';
import { useArtData } from '../hooks/useArtData';
import { useUI } from '../context/UIContext';
import { useState, useEffect } from 'react';

const ExplorePage = () => {
    const { search, setSearch, debouncedSearch } = useSearchAndFilter();
    const [artistFilter, setArtistFilter] = useState("");
    const [eraFilter, setEraFilter] = useState("");
    const [debouncedArtist, setDebouncedArtist] = useState("");
    const [debouncedEra, setDebouncedEra] = useState("");

    // Debouce for filters
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedArtist(artistFilter);
            setDebouncedEra(eraFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [artistFilter, eraFilter]);

    const { data, loading, error } = useArtData({
        q: debouncedSearch,
        artist: debouncedArtist,
        era: debouncedEra
    });

    const { openDetail } = useUI();

    const resetFilters = () => {
        setSearch("");
        setArtistFilter("");
        setEraFilter("");
    };

    const hasFilters = search || artistFilter || eraFilter;

    return (
        <div className="min-h-screen pt-32 px-6 md:px-12 pb-20">
            <motion.div
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <header className="mb-12">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">Explore</h1>

                    <div className="flex flex-col md:flex-row gap-6 items-end">

                        {/* Main Search */}
                        <div className="flex-grow w-full md:w-auto relative group">
                            <label className="text-xs uppercase text-art-muted tracking-widest mb-2 block">Keywords</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Titles, subjects..."
                                className="w-full bg-art-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-art-accent focus:bg-white/5 transition-all"
                            />
                            <Search className="absolute right-4 bottom-3 text-art-muted" size={20} />
                        </div>

                        {/* Artist Filter */}
                        <div className="w-full md:w-64">
                            <label className="text-xs uppercase text-art-muted tracking-widest mb-2 block">Artist</label>
                            <input
                                type="text"
                                value={artistFilter}
                                onChange={(e) => setArtistFilter(e.target.value)}
                                placeholder="e.g. Monet, Picasso"
                                className="w-full bg-art-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-art-accent focus:bg-white/5 transition-all"
                            />
                        </div>

                        {/* Era/Style Filter */}
                        <div className="w-full md:w-64">
                            <label className="text-xs uppercase text-art-muted tracking-widest mb-2 block">Era / Style</label>
                            <input
                                type="text"
                                value={eraFilter}
                                onChange={(e) => setEraFilter(e.target.value)}
                                placeholder="e.g. Modernism, Surrealism"
                                className="w-full bg-art-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-art-accent focus:bg-white/5 transition-all"
                            />
                        </div>

                        {/* Limit Indicator & Reset */}
                        <div className="flex items-center gap-4 pb-2">
                            {hasFilters && (
                                <button onClick={resetFilters} className="text-art-accent hover:text-white text-sm flex items-center gap-1 transition-colors">
                                    <XCircle size={16} /> Clear
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Quick Style Chips */}
                <div className="flex gap-3 mb-12 overflow-x-auto pb-2 scrollbar-hide">
                    {["Impressionism", "Renaissance", "Surrealism", "Modernism", "Abstract", "Gothic"].map(style => (
                        <button
                            key={style}
                            onClick={() => setEraFilter(style)}
                            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider border border-white/10 transition-all ${eraFilter === style ? 'bg-art-accent text-black font-bold' : 'hover:bg-white/10 text-art-muted'}`}
                        >
                            {style}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="aspect-[3/4] bg-white/5 rounded-sm animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="py-20 text-center text-red-400">Error loading artworks: {error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[300px]">
                        {data.map((art, i) => (
                            <motion.div
                                key={art.id}
                                layoutId={`card-${art.id}`}
                                className={`relative group cursor-pointer overflow-hidden rounded-md bg-art-surface shadow-lg hover:shadow-2xl transition-shadow ${i % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                onClick={() => openDetail(art)}
                            >
                                <div className="absolute inset-0 bg-art-surface animate-pulse" />
                                <motion.img
                                    layoutId={`img-${art.id}`}
                                    src={art.image_small || art.image}
                                    alt={art.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-0"
                                    onLoad={(e) => e.target.classList.remove('opacity-0')}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                                    <h3 className="text-white font-serif text-lg leading-tight line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{art.title}</h3>
                                    <p className="text-art-accent text-sm mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{art.artist}</p>
                                </div>
                            </motion.div>
                        ))}
                        {data.length === 0 && !loading && (
                            <div className="col-span-full py-20 text-center flex flex-col items-center">
                                <div className="text-6xl mb-4">🎨</div>
                                <h2 className="text-2xl text-white font-serif">No artworks found</h2>
                                <p className="text-art-muted mt-2">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ExplorePage;
