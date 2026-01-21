import { useCallback, useMemo, useRef } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import ArtworkCard from '../artwork/ArtworkCard';
import { useUI } from '../../context/UIContext';
import { useWindowSize } from '../../hooks/useWindowSize';

export default function MosaicGrid({ artworks, hasMore, onLoadMore, loading }) {
    const { openArtwork } = useUI();
    const { width } = useWindowSize();

    // Filter out artworks with "Unknown" artists - only show art pieces
    const items = useMemo(
        () => artworks.filter(art => art.artist && art.artist.toLowerCase() !== 'unknown'),
        [artworks]
    );

    if (!items || items.length === 0) return null;

    // Responsive columns and sizes
    const padding = width < 1024 ? (width < 768 ? 16 : 32) : 64; // px
    const gap = width < 1024 ? 16 : 24; // px
    const columnCount = width < 768 ? 2 : (width < 1024 ? 3 : 4);
    const contentWidth = Math.min(width, 2000) - padding * 2;
    const columnWidth = Math.floor((contentWidth - gap * (columnCount - 1)) / columnCount);
    const baseRowHeight = Math.floor(columnWidth * 4 / 3); // maintain 3:4 aspect
    const rowCount = Math.ceil(items.length / columnCount);

    // Complex splitting illusion: vary row heights in a repeating pattern
    const getRowHeight = useCallback((rowIndex) => {
        const pattern = rowIndex % 10;
        if (pattern === 0 || pattern === 5) return Math.floor(baseRowHeight * 1.35);
        if (pattern === 7) return Math.floor(baseRowHeight * 1.15);
        return baseRowHeight;
    }, [baseRowHeight]);

    const Cell = ({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * columnCount + columnIndex;
        if (index >= items.length) return null;
        const art = items[index];
        return (
            <div
                data-grid-index={index}
                style={{
                    ...style,
                    left: (style.left ?? 0) + (columnIndex ? gap * columnIndex : 0),
                    top: (style.top ?? 0) + (rowIndex ? gap * rowIndex : 0),
                    width: columnWidth,
                    height: getRowHeight(rowIndex),
                    padding: 0
                }}
            >
                <ArtworkCard
                    artwork={art}
                    index={index}
                    gridMeta={{ index, columnCount, total: items.length }}
                    onClick={() => openArtwork(art)}
                />
            </div>
        );
    };

    const fetchTimerRef = useRef(null);
    const onItemsRendered = useCallback(({ visibleRowStopIndex }) => {
        const lastVisibleIndex = (visibleRowStopIndex + 1) * columnCount;
        if (hasMore && !loading && lastVisibleIndex >= items.length - columnCount * 2) {
            if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
            fetchTimerRef.current = setTimeout(() => {
                onLoadMore?.();
            }, 200);
        }
    }, [hasMore, loading, items.length, columnCount, onLoadMore]);

    return (
        <div className="w-full min-h-screen px-4 md:px-8 lg:px-16">
            <div className="w-full max-w-[2000px] mx-auto" style={{ height: Math.min(window.innerHeight * 1.2, 1200) }}>
                <Grid
                    columnCount={columnCount}
                    columnWidth={() => columnWidth}
                    height={Math.min(window.innerHeight * 1.2, 1200)}
                    rowCount={rowCount}
                    rowHeight={getRowHeight}
                    width={contentWidth}
                    onItemsRendered={onItemsRendered}
                    overscanRowCount={3}
                >
                    {Cell}
                </Grid>
            </div>
        </div>
    );
}
