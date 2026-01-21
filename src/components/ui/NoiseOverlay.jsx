import { useEffect, useState } from 'react';

export default function NoiseOverlay() {
    const [opacity, setOpacity] = useState(0.15);

    useEffect(() => {
        const handleScroll = () => {
            const newOpacity = Math.max(0.05, 0.15 - window.scrollY / 2000);
            setOpacity(newOpacity);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className="noise-bg fixed inset-0 z-50 pointer-events-none mix-blend-overlay"
            style={{ opacity }}
        />
    );
}
