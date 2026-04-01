import { createContext, useContext, useRef, useState } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [ambientColor, setAmbientColor] = useState(null);
    // useRef avoids stale-closure issues — the current value is always the latest.
    const scrollPositionRef = useRef(0);

    const openArtwork = (artwork) => {
        scrollPositionRef.current = window.scrollY;
        setSelectedArtwork(artwork);
    };

    const closeArtwork = () => {
        setSelectedArtwork(null);
        // Restore scroll position after a brief delay to allow animation
        setTimeout(() => {
            window.scrollTo({ top: scrollPositionRef.current, behavior: 'instant' });
        }, 150);
    };

    return (
        <UIContext.Provider value={{ selectedArtwork, openArtwork, closeArtwork, ambientColor, setAmbientColor }}>
            {children}
        </UIContext.Provider>
    );
}

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within UIProvider');
    return context;
};
