/**
 * Logo Component
 * A modern, minimal SVG logo for ArtVista.
 * Styled to fit the "Museum Dark" aesthetic.
 */
import React from 'react';

export const Logo = ({ className = "w-8 h-8", color = "currentColor" }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="ArtVista Logo"
        >
            {/* The Frame - Represents the gallery/museum context */}
            <rect x="10" y="10" width="80" height="80" rx="12" stroke={color} strokeWidth="6" />

            {/* The "A" and "V" abstract shape */}
            {/* An abstract mountain/easel shape representing "Art" and "Vista" */}
            <path
                d="M30 70 L50 30 L70 70"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* A small dot/circle representing focus/lens or a sun */}
            <circle cx="50" cy="55" r="4" fill={color} />

            {/* Horizon line - "Vista" */}
            <path
                d="M25 70 H75"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default Logo;
