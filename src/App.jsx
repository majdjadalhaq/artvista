import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CollectionsProvider } from './context/CollectionsContext';
import { UIProvider, useUI } from './context/UIContext';
import Navbar from './components/Navbar';
import IntroAnimation from './components/IntroAnimation';
import DetailView from './components/DetailView';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CollectionsPage from './pages/CollectionsPage';
import AboutPage from './pages/AboutPage';

const AppContent = () => {
  const location = useLocation();
  const { showIntro, detailItem } = useUI();

  if (showIntro) {
    return <IntroAnimation />;
  }

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </AnimatePresence>
      <AnimatePresence>
        {detailItem && <DetailView item={detailItem} />}
      </AnimatePresence>
    </>
  );
};

function App() {
  return (
    <Router>
      <UIProvider>
        <CollectionsProvider>
          <div className="min-h-screen bg-art-bg text-art-text font-sans selection:bg-art-accent selection:text-black">
            <AppContent />
          </div>
        </CollectionsProvider>
      </UIProvider>
    </Router>
  );
}

export default App;
