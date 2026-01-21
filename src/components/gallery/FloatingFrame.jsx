import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * FloatingFrame Component
 * Decorative floating frames that add depth to the gallery
 */
export default function FloatingFrame({ position, size = [1.5, 2], color = '#B97A56' }) {
    const frameRef = useRef();
    const initialY = position[1];

    useFrame((state) => {
        if (!frameRef.current) return;

        const time = state.clock.getElapsedTime();

        // Floating animation
        frameRef.current.position.y = initialY + Math.sin(time * 0.5 + position[0]) * 0.3;

        // Gentle rotation
        frameRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
    });

    return (
        <group ref={frameRef} position={position}>
            {/* Frame edges */}
            <lineSegments>
                <edgesGeometry args={[new THREE.PlaneGeometry(size[0], size[1])]} />
                <lineBasicMaterial color={color} linewidth={2} transparent opacity={0.3} />
            </lineSegments>
        </group>
    );
}
