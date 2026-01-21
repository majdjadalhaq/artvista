import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Optimized ParticleField Component
 * High-performance floating particles with minimal overhead
 */
export default function ParticleField({ count = 200, scrollProgress = 0 }) {
    const pointsRef = useRef();
    const velocitiesRef = useRef();

    // Generate particles once and cache
    const { positions, colors, velocities } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Positions
            positions[i3] = (Math.random() - 0.5) * 30;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = -Math.random() * 40;

            // Velocities for smooth movement
            velocities[i3] = (Math.random() - 0.5) * 0.002;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.001;
            velocities[i3 + 2] = Math.random() * 0.001;

            // Colors
            const colorVariation = Math.random();
            if (colorVariation > 0.7) {
                colors[i3] = 0.247;
                colors[i3 + 1] = 0.714;
                colors[i3 + 2] = 0.698;
            } else if (colorVariation > 0.4) {
                colors[i3] = 0.122;
                colors[i3 + 1] = 0.435;
                colors[i3 + 2] = 0.420;
            } else {
                colors[i3] = 0.725;
                colors[i3 + 1] = 0.478;
                colors[i3 + 2] = 0.337;
            }
        }

        return { positions, colors, velocities };
    }, [count]);

    // Store velocities in ref to avoid recreating
    velocitiesRef.current = velocities;

    // Optimized animation with minimal calculations
    useFrame((state) => {
        if (!pointsRef.current) return;

        const positions = pointsRef.current.geometry.attributes.position.array;
        const velocities = velocitiesRef.current;
        const time = state.clock.getElapsedTime();

        // Batch update positions
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Use velocities for smooth movement
            positions[i3] += velocities[i3];
            positions[i3 + 1] += velocities[i3 + 1] + Math.sin(time * 0.5 + i * 0.1) * 0.001;
            positions[i3 + 2] += velocities[i3 + 2] + scrollProgress * 0.005;

            // Reset particles that go too far
            if (positions[i3 + 2] > 5) {
                positions[i3 + 2] = -40;
            }
            if (positions[i3 + 1] > 10) {
                positions[i3 + 1] = -10;
            }
            if (positions[i3 + 1] < -10) {
                positions[i3 + 1] = 10;
            }
        }

        // Single update call
        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Minimal rotation
        pointsRef.current.rotation.y = time * 0.02;
    });

    return (
        <Points
            ref={pointsRef}
            positions={positions}
            colors={colors}
            stride={3}
            frustumCulled={true}
        >
            <PointMaterial
                transparent
                vertexColors
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}
