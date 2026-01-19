import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * Main layout wrapper component
 * Provides consistent layout structure across all pages
 */
function MainLayout() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen bg-canvas">
            <Navbar />
            <main className={isHome ? '' : 'container-custom py-8'}>
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
