import { useContext } from 'react';
import { CollectionsContext } from '../context/CollectionsContext';

/**
 * Custom hook to access Collections Context
 * Provides access to collections state and actions
 * 
 * @returns {Object} Collections context value
 * @throws {Error} If used outside CollectionsProvider
 */
function useCollections() {
    const context = useContext(CollectionsContext);

    if (!context) {
        throw new Error(
            'useCollections must be used within a CollectionsProvider'
        );
    }

    return context;
}

export default useCollections;
