import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { CollectionsProvider } from './context/CollectionsContext';

/**
 * Root application component
 * Sets up routing and global providers
 */
function App() {
  return (
    <BrowserRouter>
      <CollectionsProvider>
        <AppRoutes />
      </CollectionsProvider>
    </BrowserRouter>
  );
}

export default App;
