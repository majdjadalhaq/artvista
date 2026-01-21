import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ArtworkCard from '../artwork/ArtworkCard';
import { useUI } from '../../context/UIContext';
import { useWindowSize } from '../../hooks/useWindowSize';

// Creative Masonry MosaicGrid
export default function MosaicGrid({ artworks, hasMore, onLoadMore, loading }) {
    const { openArtwork } = useUI();
    const { width } = useWindowSize(); // height unused here as we use window.innerHeight

    // Filter out artworks with "Unknown" artists - only show art pieces
    const items = useMemo(
        () => artworks.filter(art => art.artist && art.artist.toLowerCase() !== 'unknown'),
        [artworks]
    );

    if (!items || items.length === 0) return null;


    // Masonry logic: assign items to columns for a natural, staggered look
    const padding = width < 1024 ? (width < 768 ? 12 : 24) : 48;
    const gap = width < 1024 ? 14 : 20;
    const columnCount = width < 768 ? 2 : (width < 1024 ? 3 : 4);
    const contentWidth = Math.min(width, 2000) - padding * 2;
    const columnWidth = Math.floor((contentWidth - gap * (columnCount - 1)) / columnCount);
    const topOffset = width < 768 ? 120 : 160;
    const bottomOffset = 100;

    // Assign items to columns for masonry
    const columns = useMemo(() => {
        const cols = Array.from({ length: columnCount }, () => []);
        items.forEach((item, i) => {
            // Assign to the shortest column
            const colHeights = cols.map(col => col.reduce((sum, it) => sum + (it.height || 1), 0));
            const minCol = colHeights.indexOf(Math.min(...colHeights));
            cols[minCol].push(item);
        });
        return cols;
    }, [items, columnCount]);

    // Estimate card heights for staggered effect (simulate variable height)
    const getCardHeight = (item, i) => {
        // Use a pseudo-random but deterministic height for visual variety
        const base = columnWidth * 1.3;
        const mod = 0.9 + ((i * 31) % 10) / 20;
        return Math.floor(base * mod);
    };

    // For infinite scroll
    const lastRowIndex = Math.max(...columns.map(col => col.length));
    const onScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (hasMore && !loading && scrollTop + clientHeight > scrollHeight - 600) {
            onLoadMore?.();
        }
    };



    return (
        <div
            className="w-full max-w-[2000px] mx-auto min-h-[60vh] px-2 md:px-8 lg:px-16"
            style={{ paddingTop: topOffset, paddingBottom: bottomOffset }}
            onScroll={onScroll}
        >
            <div
                className="flex w-full gap-x-4 md:gap-x-8 lg:gap-x-12"
                style={{ alignItems: 'flex-start' }}
            >
                {columns.map((col, colIdx) => (
                    <div
                        key={colIdx}
                        className="flex flex-col gap-y-6 md:gap-y-10 lg:gap-y-14"
                        style={{ width: columnWidth }}
                    >
                        {col.map((item, i) => (
                            <motion.div
                                key={item.id || i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: (i + colIdx) * 0.06 }}
                                style={{ height: getCardHeight(item, i), width: '100%' }}
                            >
                                <ArtworkCard
                                    artwork={item}
                                    index={i + colIdx * 1000}
                                    gridMeta={{ index: i, columnCount, total: items.length }}
                                    onClick={() => openArtwork(item)}
                                />
                            </motion.div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

// No Cell needed for new layout
