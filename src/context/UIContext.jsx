import { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within UIProvider');
    return context;
};

export const UIProvider = ({ children }) => {
    const [showIntro, setShowIntro] = useState(true);
    const [detailItem, setDetailItem] = useState(null);

    const finishIntro = () => setShowIntro(false);
    const openDetail = (item) => setDetailItem(item);
    const closeDetail = () => setDetailItem(null);

    return (
        <UIContext.Provider value={{ showIntro, finishIntro, detailItem, openDetail, closeDetail }}>
            {children}
        </UIContext.Provider>
    );
};
