import { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
    const [selectedArtwork, setSelectedArtwork] = useState(null);

    const openArtwork = (artwork) => {
        setSelectedArtwork(artwork);
    };

    const closeArtwork = () => {
        setSelectedArtwork(null);
    };

    return (
        <UIContext.Provider value={{ selectedArtwork, openArtwork, closeArtwork }}>
            {children}
        </UIContext.Provider>
    );
}

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within UIProvider');
    return context;
};
