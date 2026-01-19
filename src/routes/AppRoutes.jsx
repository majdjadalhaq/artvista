import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/HomePage';
import ExplorePage from '../pages/ExplorePage';
import CollectionsPage from '../pages/CollectionsPage';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * Application routing configuration
 * Defines all routes and their corresponding page components
 */
function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="explore" element={<ExplorePage />} />
                <Route path="collections" element={<CollectionsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
