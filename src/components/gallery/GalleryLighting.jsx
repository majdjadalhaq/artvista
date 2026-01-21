import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Gallery Lighting Component
 * Provides ambient, directional, and dynamic lighting for the 3D gallery
 */
export default function GalleryLighting({ scrollProgress = 0 }) {
    const spotLightRef = useRef();
    const directionalLightRef = useRef();

    // Animate lights based on scroll
    useFrame(() => {
        if (spotLightRef.current) {
            // Move spotlight along with camera
            spotLightRef.current.position.z = 5 - scrollProgress * 20;
        }

        if (directionalLightRef.current) {
            // Subtle intensity change based on scroll
            directionalLightRef.current.intensity = 0.5 + scrollProgress * 0.2;
        }
    });

    return (
        <>
            {/* Ambient light for overall illumination */}
            <ambientLight intensity={0.4} color="#D8D1C8" />

            {/* Main directional light from top-front */}
            <directionalLight
                ref={directionalLightRef}
                position={[5, 10, 5]}
                intensity={0.6}
                color="#3FB6B2"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />

            {/* Fill light from the side */}
            <directionalLight
                position={[-5, 5, 2]}
                intensity={0.3}
                color="#C6B8A8"
            />

            {/* Spotlight that follows the camera */}
            <spotLight
                ref={spotLightRef}
                position={[0, 5, 5]}
                angle={0.6}
                penumbra={0.5}
                intensity={0.5}
                color="#3FB6B2"
                castShadow
            />

            {/* Accent lights for depth */}
            <pointLight
                position={[10, 3, -10]}
                intensity={0.3}
                color="#B97A56"
                distance={15}
            />

            <pointLight
                position={[-10, 3, -10]}
                intensity={0.3}
                color="#1F6F6B"
                distance={15}
            />

            {/* Rim light for edges */}
            <directionalLight
                position={[0, -5, -5]}
                intensity={0.2}
                color="#D8D1C8"
            />
        </>
    );
}
