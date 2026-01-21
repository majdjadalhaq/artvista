/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                // Turquoise & Dust / StitchPunk Palette
                'dust-sand': '#D8D1C8',
                'soft-clay': '#C6B8A8',
                'charcoal-ink': '#1E1E1E',
                'graphite': '#2A2A2A',
                'turquoise-core': '#3FB6B2',
                'deep-teal': '#1F6F6B',
                'muted-copper': '#B97A56',

                background: "var(--bg-primary)",
                foreground: "var(--text-primary)",
                secondary: {
                    DEFAULT: "var(--bg-secondary)",
                    foreground: "var(--text-dark)",
                },
                muted: {
                    DEFAULT: "var(--bg-secondary)",
                    foreground: "var(--text-secondary)",
                },
                card: {
                    DEFAULT: "var(--bg-primary)",
                    foreground: "var(--text-primary)",
                },
            },
            fontFamily: {
                serif: ["Playfair Display", "serif"],
                sans: ["Inter", "sans-serif"],
            },
            borderRadius: {
                lg: "0.5rem",
                md: "calc(0.5rem - 2px)",
                sm: "calc(0.5rem - 4px)",
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fadeIn 0.5s ease-out forwards",
                "float": "float 6s ease-in-out infinite",
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
        },
    },
    plugins: [],
    darkMode: 'class',
}
