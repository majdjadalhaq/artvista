import { createContext, useContext, useState, useEffect } from 'react';

const CollectionsContext = createContext();

export const useCollections = () => {
    const context = useContext(CollectionsContext);
    if (!context) {
        throw new Error('useCollections must be used within a CollectionsProvider');
    }
    return context;
};

export const CollectionsProvider = ({ children }) => {
    const [savedArtworks, setSavedArtworks] = useState(() => {
        try {
            const local = localStorage.getItem('artvista_collections');
            return local ? JSON.parse(local) : [];
        } catch (e) {
            console.error("Failed to parse collections", e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('artvista_collections', JSON.stringify(savedArtworks));
    }, [savedArtworks]);

    const addToCollection = (art) => {
        setSavedArtworks(prev => {
            if (prev.some(a => a.id === art.id)) return prev;
            return [...prev, art];
        });
    };

    const removeFromCollection = (id) => {
        setSavedArtworks(prev => prev.filter(a => a.id !== id));
    };

    const isSaved = (id) => savedArtworks.some(a => a.id === id);

    return (
        <CollectionsContext.Provider value={{ savedArtworks, addToCollection, removeFromCollection, isSaved }}>
            {children}
        </CollectionsContext.Provider>
    );
};
