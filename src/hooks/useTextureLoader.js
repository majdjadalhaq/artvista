import { useState, useEffect } from 'react';
import { TextureLoader } from 'three';
import * as THREE from 'three';

// Global texture cache to prevent reloading
const textureCache = new Map();

/**
 * Optimized texture loader with caching and compression
 * @param {string} url - Image URL to load as texture
 * @returns {object} { texture, loading, error }
 */
export function useTextureLoader(url) {
    const [texture, setTexture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) {
            setLoading(false);
            return;
        }

        // Check cache first
        if (textureCache.has(url)) {
            setTexture(textureCache.get(url));
            setLoading(false);
            return;
        }

        const loader = new TextureLoader();
        setLoading(true);
        setError(null);

        loader.load(
            url,
            (loadedTexture) => {
                // Optimize texture settings for performance
                loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
                loadedTexture.magFilter = THREE.LinearFilter;
                loadedTexture.anisotropy = 4; // Reduced from default for performance
                loadedTexture.generateMipmaps = true;
                loadedTexture.needsUpdate = true;

                // Cache the texture
                textureCache.set(url, loadedTexture);

                setTexture(loadedTexture);
                setLoading(false);
            },
            undefined,
            (err) => {
                console.error('Texture loading error:', err);
                setError(err);
                setLoading(false);
            }
        );

        // Cleanup function
        return () => {
            // Don't dispose cached textures
            // They'll be reused across components
        };
    }, [url]);

    return { texture, loading, error };
}

/**
 * Hook for batch loading multiple textures with progress
 * @param {Array<string>} urls - Array of image URLs
 * @returns {object} { textures, loading, error, progress }
 */
export function useBatchTextureLoader(urls) {
    const [textures, setTextures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!urls || urls.length === 0) {
            setLoading(false);
            return;
        }

        const loader = new TextureLoader();
        const loadedTextures = [];
        let loadedCount = 0;

        const loadTexture = (url, index) => {
            // Check cache first
            if (textureCache.has(url)) {
                loadedTextures[index] = textureCache.get(url);
                loadedCount++;
                setProgress((loadedCount / urls.length) * 100);
                return Promise.resolve(textureCache.get(url));
            }

            return new Promise((resolve, reject) => {
                loader.load(
                    url,
                    (texture) => {
                        // Optimize texture
                        texture.minFilter = THREE.LinearMipmapLinearFilter;
                        texture.magFilter = THREE.LinearFilter;
                        texture.anisotropy = 4;
                        texture.generateMipmaps = true;

                        // Cache it
                        textureCache.set(url, texture);

                        loadedTextures[index] = texture;
                        loadedCount++;
                        setProgress((loadedCount / urls.length) * 100);
                        resolve(texture);
                    },
                    undefined,
                    (err) => {
                        console.error(`Texture loading error for ${url}:`, err);
                        loadedTextures[index] = null;
                        loadedCount++;
                        setProgress((loadedCount / urls.length) * 100);
                        reject(err);
                    }
                );
            });
        };

        Promise.allSettled(urls.map((url, index) => loadTexture(url, index)))
            .then(() => {
                setTextures(loadedTextures);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });

        // Don't dispose cached textures
        return () => { };
    }, [urls]);

    return { textures, loading, error, progress };
}

/**
 * Clear texture cache (call when unmounting app or changing routes)
 */
export function clearTextureCache() {
    textureCache.forEach((texture) => {
        texture.dispose();
    });
    textureCache.clear();
}

/**
 * Get cache size for debugging
 */
export function getTextureCacheSize() {
    return textureCache.size;
}
