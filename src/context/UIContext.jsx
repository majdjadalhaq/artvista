import { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    const openArtwork = (artwork) => {
        // Save current scroll position before opening detail view
        setScrollPosition(window.scrollY);
        setSelectedArtwork(artwork);
    };

    const closeArtwork = () => {
        setSelectedArtwork(null);
        // Restore scroll position after a brief delay to allow animation
        setTimeout(() => {
            window.scrollTo({ top: scrollPosition, behavior: 'instant' });
        }, 150);
    };

    return (
        <UIContext.Provider value={{ selectedArtwork, openArtwork, closeArtwork, scrollPosition }}>
            {children}
        </UIContext.Provider>
    );
}

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within UIProvider');
    return context;
};
