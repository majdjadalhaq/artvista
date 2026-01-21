import { useCallback, useRef } from 'react';

export function useInfiniteScroll(loading, hasMore, onLoadMore) {
    const observer = useRef();

    const lastElementRef = useCallback((node) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                onLoadMore();
            }
        }, {
            rootMargin: '400px', // Fetch early for smooth scrolling
            threshold: 0
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, onLoadMore]);

    return lastElementRef;
}