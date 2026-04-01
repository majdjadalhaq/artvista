import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from './ToastContext';

const CollectionContext = createContext(null);

export function CollectionProvider({ children }) {
    const { addToast } = useToast();

    const [collection, setCollection] = useState(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem('artvista_collection');
            return saved ? JSON.parse(saved) : [];
        } catch {
            // Toast shown after mount in the useEffect below.
            return [];
        }
    });

    // Notify the user if their saved collection was corrupted.
    useEffect(() => {
        const raw = localStorage.getItem('artvista_collection');
        if (!raw) return;
        try {
            JSON.parse(raw);
        } catch {
            localStorage.removeItem('artvista_collection');
            addToast('Your saved collection could not be loaded and has been reset.', 'error');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        localStorage.setItem('artvista_collection', JSON.stringify(collection));
    }, [collection]);

    const addToCollection = (artwork) => {
        setCollection((prev) => {
            if (prev.find((item) => item.id === artwork.id)) return prev;
            return [...prev, artwork];
        });
    };

    const removeFromCollection = (artworkId) => {
        setCollection((prev) => prev.filter((item) => item.id !== artworkId));
    };

    const isSaved = (artworkId) => {
        return collection.some((item) => item.id === artworkId);
    };

    return (
        <CollectionContext.Provider value={{ collection, addToCollection, removeFromCollection, isSaved }}>
            {children}
        </CollectionContext.Provider>
    );
}

export const useCollection = () => {
    const context = useContext(CollectionContext);
    if (!context) {
        throw new Error('useCollection must be used within a CollectionProvider');
    }
    return context;
};
