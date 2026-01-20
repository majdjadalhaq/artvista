/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            colors: {
                art: {
                    bg: '#0a0a0a',
                    card: '#141414',
                    surface: '#1f1f1f',
                    text: '#f0f0f0',
                    accent: '#c4a05f', // Muted Gold
                    muted: '#a0a0a0',
                    border: '#333333',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
