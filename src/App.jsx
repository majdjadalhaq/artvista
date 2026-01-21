import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CollectionProvider } from './context/CollectionContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { UIProvider } from './context/UIContext';
import ToastContainer from './components/ui/ToastContainer';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const Collection = lazy(() => import('./pages/Collection'));
const About = lazy(() => import('./pages/About'));
const ArtworkDetail = lazy(() => import('./pages/ArtworkDetail'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
    <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function AppContent() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          } />
          <Route path="/explore" element={
            <Suspense fallback={<PageLoader />}>
              <Explore />
            </Suspense>
          } />
          <Route path="/collection" element={
            <Suspense fallback={<PageLoader />}>
              <Collection />
            </Suspense>
          } />
          <Route path="/about" element={
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          } />
          <Route path="/artwork/:id" element={
            <Suspense fallback={<PageLoader />}>
              <ArtworkDetail />
            </Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={<PageLoader />}>
              <NotFoundPage />
            </Suspense>
          } />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <CollectionProvider>
            <UIProvider>
              <ToastContainer />
              <AppContent />
            </UIProvider>
          </CollectionProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
