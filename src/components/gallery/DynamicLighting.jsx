import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * DynamicLighting Component
 * Lighting that transitions based on scroll position and time
 */
export default function DynamicLighting({ scrollProgress = 0 }) {
    const ambientRef = useRef();
    const directionalRef = useRef();
    const spotRef = useRef();
    const accentRef = useRef();

    // Animate lights based on scroll and time
    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (ambientRef.current) {
            // Pulse ambient light subtly
            ambientRef.current.intensity = 0.4 + Math.sin(time * 0.2) * 0.05;
        }

        if (directionalRef.current) {
            // Shift directional light intensity with scroll
            directionalRef.current.intensity = 0.6 + scrollProgress * 0.2;

            // Gentle color shift
            const hue = 0.5 + Math.sin(time * 0.1) * 0.1;
            directionalRef.current.color.setHSL(hue, 0.3, 0.7);
        }

        if (spotRef.current) {
            // Move spotlight along with camera
            spotRef.current.position.z = 5 - scrollProgress * 20;

            // Pulse intensity
            spotRef.current.intensity = 0.5 + Math.sin(time * 0.5) * 0.1;
        }

        if (accentRef.current) {
            // Rotate accent light
            const angle = time * 0.3;
            accentRef.current.position.x = Math.cos(angle) * 10;
            accentRef.current.position.z = -10 + Math.sin(angle) * 5;
        }
    });

    return (
        <>
            {/* Ambient light with subtle pulsing */}
            <ambientLight ref={ambientRef} intensity={0.4} color="#D8D1C8" />

            {/* Main directional light with color transitions */}
            <directionalLight
                ref={directionalRef}
                position={[5, 10, 5]}
                intensity={0.6}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />

            {/* Fill light */}
            <directionalLight
                position={[-5, 5, 2]}
                intensity={0.3}
                color="#C6B8A8"
            />

            {/* Dynamic spotlight */}
            <spotLight
                ref={spotRef}
                position={[0, 5, 5]}
                angle={0.6}
                penumbra={0.5}
                intensity={0.5}
                color="#3FB6B2"
                castShadow
            />

            {/* Rotating accent light */}
            <pointLight
                ref={accentRef}
                position={[10, 3, -10]}
                intensity={0.4}
                color="#B97A56"
                distance={15}
            />

            {/* Static accent light */}
            <pointLight
                position={[-10, 3, -10]}
                intensity={0.3}
                color="#1F6F6B"
                distance={15}
            />

            {/* Rim light */}
            <directionalLight
                position={[0, -5, -5]}
                intensity={0.2}
                color="#D8D1C8"
            />
        </>
    );
}
