import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * Main layout wrapper component
 * Provides consistent layout structure across all pages
 */
function MainLayout() {
    return (
        <div className="min-h-screen bg-canvas">
            <Navbar />
            <main className="container-custom py-8">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
