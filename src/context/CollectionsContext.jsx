import React, { createContext, useState, useEffect } from 'react';

/**
 * Collections Context
 * Manages user's artwork collections with localStorage persistence
 */
export const CollectionsContext = createContext(null);

const STORAGE_KEY = 'artvista_collections';

/**
 * Collections Provider Component
 * Wraps the app to provide collections state globally
 */
export function CollectionsProvider({ children }) {
    const [collections, setCollections] = useState([]);

    // Load collections from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setCollections(parsed);
            } else {
                // Initialize with a default "Favorites" collection
                const defaultCollections = [
                    {
                        name: 'Favorites',
                        artworkIds: []
                    }
                ];
                setCollections(defaultCollections);
            }
        } catch (error) {
            console.error('Error loading collections from localStorage:', error);
            setCollections([{ name: 'Favorites', artworkIds: [] }]);
        }
    }, []);

    // Save collections to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
        } catch (error) {
            console.error('Error saving collections to localStorage:', error);
        }
    }, [collections]);

    /**
     * Create a new collection
     * @param {string} name - Collection name
     * @returns {boolean} Success status
     */
    const createCollection = (name) => {
        if (!name || !name.trim()) {
            console.error('Collection name cannot be empty');
            return false;
        }

        // Check if collection already exists
        const exists = collections.some(
            (col) => col.name.toLowerCase() === name.trim().toLowerCase()
        );

        if (exists) {
            console.error('Collection already exists');
            return false;
        }

        setCollections([...collections, { name: name.trim(), artworkIds: [] }]);
        return true;
    };

    /**
     * Delete a collection
     * @param {string} name - Collection name
     * @returns {boolean} Success status
     */
    const deleteCollection = (name) => {
        // Prevent deleting the default Favorites collection
        if (name === 'Favorites') {
            console.error('Cannot delete the Favorites collection');
            return false;
        }

        setCollections(collections.filter((col) => col.name !== name));
        return true;
    };

    /**
     * Add artwork to a collection
     * @param {number|string} artworkId - Artwork ID
     * @param {string} collectionName - Collection name
     * @returns {boolean} Success status
     */
    const addToCollection = (artworkId, collectionName) => {
        const collection = collections.find((col) => col.name === collectionName);

        if (!collection) {
            console.error('Collection not found');
            return false;
        }

        // Check if artwork is already in collection
        if (collection.artworkIds.includes(artworkId)) {
            console.log('Artwork already in collection');
            return false;
        }

        setCollections(
            collections.map((col) =>
                col.name === collectionName
                    ? { ...col, artworkIds: [...col.artworkIds, artworkId] }
                    : col
            )
        );

        return true;
    };

    /**
     * Remove artwork from a collection
     * @param {number|string} artworkId - Artwork ID
     * @param {string} collectionName - Collection name
     * @returns {boolean} Success status
     */
    const removeFromCollection = (artworkId, collectionName) => {
        setCollections(
            collections.map((col) =>
                col.name === collectionName
                    ? {
                        ...col,
                        artworkIds: col.artworkIds.filter((id) => id !== artworkId)
                    }
                    : col
            )
        );

        return true;
    };

    /**
     * Check if artwork is in a specific collection
     * @param {number|string} artworkId - Artwork ID
     * @param {string} collectionName - Collection name
     * @returns {boolean} True if artwork is in collection
     */
    const isInCollection = (artworkId, collectionName) => {
        const collection = collections.find((col) => col.name === collectionName);
        return collection ? collection.artworkIds.includes(artworkId) : false;
    };

    /**
     * Get all collections that contain a specific artwork
     * @param {number|string} artworkId - Artwork ID
     * @returns {Array} Array of collection names
     */
    const getArtworkCollections = (artworkId) => {
        return collections
            .filter((col) => col.artworkIds.includes(artworkId))
            .map((col) => col.name);
    };

    const value = {
        collections,
        createCollection,
        deleteCollection,
        addToCollection,
        removeFromCollection,
        isInCollection,
        getArtworkCollections
    };

    return (
        <CollectionsContext.Provider value={value}>
            {children}
        </CollectionsContext.Provider>
    );
}
