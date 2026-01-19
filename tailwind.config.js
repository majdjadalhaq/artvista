/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Light theme gallery aesthetics
                canvas: '#ffffff', // Main background
                surface: '#f8f8f8', // Cards/Modals
                'surface-hover': '#f0f0f0',
                border: '#e5e5e5',

                text: {
                    primary: '#1a1a1a',
                    secondary: '#666666',
                },

                accent: {
                    primary: '#d64d4d', // Muted red for gallery feel
                    secondary: '#2d5a88',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Playfair Display', 'serif'], // Elegant serif for headings
            },
            container: {
                center: true,
                padding: '2rem',
                screens: {
                    '2xl': '1400px',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
