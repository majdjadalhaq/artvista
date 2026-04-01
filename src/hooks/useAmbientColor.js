import { useCallback, useRef } from 'react';

// Module-level cache so the same URL is never sampled twice across card instances.
const colorCache = new Map();

/**
 * Samples the dominant color of an image URL by drawing it onto a tiny offscreen
 * canvas and reading the average RGB of the 5×5 centre region.
 *
 * Returns a promise that resolves to an `rgb(r,g,b)` string, or null on failure
 * (e.g. CORS-blocked images — we degrade silently, keeping the default charcoal bg).
 */
function sampleColor(url) {
    if (colorCache.has(url)) return Promise.resolve(colorCache.get(url));

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            try {
                const SIZE = 5;
                const canvas = document.createElement('canvas');
                canvas.width = SIZE;
                canvas.height = SIZE;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, SIZE, SIZE);
                const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

                let r = 0, g = 0, b = 0;
                const pixels = SIZE * SIZE;
                for (let i = 0; i < data.length; i += 4) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                }
                const color = `rgb(${Math.round(r / pixels)},${Math.round(g / pixels)},${Math.round(b / pixels)})`;
                colorCache.set(url, color);
                resolve(color);
            } catch {
                resolve(null); // CORS or canvas taint — degrade gracefully
            }
        };

        img.onerror = () => resolve(null);
        img.src = url;
    });
}

/**
 * useAmbientColor — returns { onHoverStart, onHoverEnd } handlers for an artwork card.
 * The caller passes `setAmbientColor` from UIContext to push the extracted colour up.
 */
export function useAmbientColor(imageUrl, setAmbientColor) {
    const pendingRef = useRef(false);

    const onHoverStart = useCallback(async () => {
        if (!imageUrl || !setAmbientColor) return;
        pendingRef.current = true;
        const color = await sampleColor(imageUrl);
        if (pendingRef.current && color) {
            setAmbientColor(color);
        }
    }, [imageUrl, setAmbientColor]);

    const onHoverEnd = useCallback(() => {
        pendingRef.current = false;
        setAmbientColor?.(null);
    }, [setAmbientColor]);

    return { onHoverStart, onHoverEnd };
}
