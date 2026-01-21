import { useCallback, useMemo, forwardRef } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import ArtworkCard from '../artwork/ArtworkCard';
import { useUI } from '../../context/UIContext';
import { useWindowSize } from '../../hooks/useWindowSize';

export default function MosaicGrid({ artworks, hasMore, onLoadMore, loading }) {
    const { openArtwork } = useUI();
    const { width } = useWindowSize(); // height unused here as we use window.innerHeight

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
    // const baseRowHeight = Math.floor(columnWidth * 4 / 3); // maintain 3:4 aspect
    const baseRowHeight = Math.floor(columnWidth * 1.5); // Taller aspect for elegance

    const rowCount = Math.ceil(items.length / columnCount);

    // Calculate top offset for header (replaces the padding we removed from Explore.jsx)
    // pt-40 (160px) for mobile, pt-48 (192px) for desktop
    const topOffset = width < 768 ? 160 : 192;
    const bottomOffset = 100; // Space for "Loading more" indicator

    // Complex splitting illusion: vary row heights in a repeating pattern
    // Rhythmic pattern: 3-step cycle for a cleaner, gallery-like feel
    const getRowHeight = useCallback((rowIndex) => {
        const pattern = rowIndex % 3;
        if (pattern === 0) return Math.floor(baseRowHeight * 1.3); // Tall hero
        if (pattern === 1) return Math.floor(baseRowHeight * 0.9); // Compact
        return Math.floor(baseRowHeight * 1.4); // Feature
    }, [baseRowHeight]);

    const itemData = useMemo(() => ({
        items,
        columnCount,
        gap,
        columnWidth,
        getRowHeight,
        openArtwork,
        topOffset
    }), [items, columnCount, gap, columnWidth, getRowHeight, openArtwork, topOffset]);

    const onItemsRendered = useCallback(({ visibleRowStopIndex }) => {
        const lastVisibleIndex = (visibleRowStopIndex + 1) * columnCount;
        if (hasMore && !loading && lastVisibleIndex >= items.length - columnCount * 2) {
            onLoadMore?.();
        }
    }, [hasMore, loading, items.length, columnCount, onLoadMore]);

    // Custom inner element to accommodate the top offset in scroll height
    const InnerGridElement = useMemo(() => forwardRef(({ style, ...rest }, ref) => (
        <div
            ref={ref}
            style={{
                ...style,
                height: `${parseFloat(style.height) + topOffset + bottomOffset}px`
            }}
            {...rest}
        />
    )), [topOffset, bottomOffset]);

    return (
        <div className="w-full h-full"> {/* Full height container */}
            <div className="w-full max-w-[2000px] mx-auto h-full">
                <Grid
                    columnCount={columnCount}
                    columnWidth={() => columnWidth}
                    height={window.innerHeight} // Full window scroll
                    rowCount={rowCount}
                    rowHeight={getRowHeight}
                    width={contentWidth}
                    style={{ overflowX: 'hidden' }}
                    containerStyle={{ overflowX: 'hidden' }}
                    onItemsRendered={onItemsRendered}
                    overscanRowCount={3}
                    itemData={itemData}
                    innerElementType={InnerGridElement}
                    className="custom-scrollbar"
                >
                    {Cell}
                </Grid>
            </div>
        </div>
    );
}

const Cell = ({ columnIndex, rowIndex, style, data }) => {
    const { items, columnCount, gap, columnWidth, getRowHeight, openArtwork, topOffset } = data;
    const index = rowIndex * columnCount + columnIndex;
    if (index >= items.length) return null;
    const art = items[index];

    // Adjust style for gap AND top offset
    const adjustedStyle = {
        ...style,
        left: (style.left ?? 0) + (columnIndex ? gap * columnIndex : 0),
        top: (style.top ?? 0) + (rowIndex ? gap * rowIndex : 0) + topOffset,
        width: columnWidth,
        height: getRowHeight(rowIndex),
        padding: 0
    };

    return (
        <div
            data-grid-index={index}
            style={adjustedStyle}
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
