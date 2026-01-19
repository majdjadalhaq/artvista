import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CollectionsProvider } from './context/CollectionsContext';
import AppRoutes from './routes/AppRoutes';
import IntroAnimation from './components/animations/IntroAnimation';

function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <CollectionsProvider>
      <Router>
        {!introComplete && (
          <IntroAnimation onComplete={() => setIntroComplete(true)} />
        )}

        {/* Main Content loads behind but is revealed after intro */}
        <div className={`transition-opacity duration-1000 ${introComplete ? 'opacity-100' : 'opacity-0'}`}>
          <AppRoutes />
        </div>
      </Router>
    </CollectionsProvider>
  );
}

export default App;
