import React from 'react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Root application component
 * Sets up routing and global providers
 */
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-canvas">
        <div className="container-custom py-20">
          <h1 className="text-6xl font-display text-center mb-8">
            ArtVista
          </h1>
          <p className="text-xl text-text-secondary text-center max-w-2xl mx-auto">
            A premium art exploration experience. Discover masterpieces from world-renowned museums.
          </p>
          <div className="mt-12 text-center">
            <span className="inline-block px-4 py-2 bg-accent-primary/10 text-accent-primary rounded-full text-sm font-medium">
              Phase 1: Foundation Complete ✓
            </span>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
