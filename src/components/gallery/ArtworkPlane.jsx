import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useTextureLoader } from '../../hooks/useTextureLoader';
import gsap from 'gsap';
import * as THREE from 'three';

/**
 * Optimized ArtworkPlane Component
 * High-performance 3D artwork display with frustum culling
 */
export default function ArtworkPlane({
    artwork,
    position,
    rotation = 0,
    onClick,
    index = 0,
}) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const { texture, loading, error } = useTextureLoader(artwork.image || artwork.image_small);
    const { camera } = useThree();

    // Shared geometry for all planes (performance optimization)
    const geometry = useMemo(() => {
        const aspectRatio = 3 / 4;
        const width = 2;
        const height = width / aspectRatio;
        return new THREE.PlaneGeometry(width, height);
    }, []);

    // Optimized hover animation with GSAP
    useEffect(() => {
        if (!meshRef.current) return;

        if (hovered) {
            gsap.to(meshRef.current.position, {
                z: position[2] + 0.5,
                duration: 0.3,
                ease: 'power2.out',
            });

            gsap.to(meshRef.current.scale, {
                x: 1.05,
                y: 1.05,
                z: 1.05,
                duration: 0.3,
                ease: 'power2.out',
            });

            setShowInfo(true);
        } else {
            gsap.to(meshRef.current.position, {
                z: position[2],
                duration: 0.2,
                ease: 'power2.in',
            });

            gsap.to(meshRef.current.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.2,
                ease: 'power2.in',
            });

            setShowInfo(false);
        }
    }, [hovered, position]);

    // Frustum culling for performance - only animate visible objects
    useFrame(() => {
        if (!meshRef.current) return;

        // Check if in camera view
        const frustum = new THREE.Frustum();
        const matrix = new THREE.Matrix4().multiplyMatrices(
            camera.projectionMatrix,
            camera.matrixWorldInverse
        );
        frustum.setFromProjectionMatrix(matrix);

        const visible = frustum.intersectsObject(meshRef.current);
        setIsVisible(visible);

        // Only animate if visible and not hovered
        if (visible && !hovered) {
            const time = Date.now() * 0.001;
            meshRef.current.position.y = position[1] + Math.sin(time + index * 0.5) * 0.02;
        }
    });

    // Change cursor on hover
    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = 'pointer';
        }
        return () => {
            document.body.style.cursor = 'auto';
        };
    }, [hovered]);

    if (loading) {
        return (
            <mesh
                ref={meshRef}
                position={position}
                rotation={[0, rotation, 0]}
                geometry={geometry}
            >
                <meshStandardMaterial color="#2A2A2A" />
            </mesh>
        );
    }

    if (error || !texture) {
        return (
            <mesh
                ref={meshRef}
                position={position}
                rotation={[0, rotation, 0]}
                geometry={geometry}
            >
                <meshStandardMaterial color="#1E1E1E" />
            </mesh>
        );
    }

    return (
        <group>
            <mesh
                ref={meshRef}
                position={position}
                rotation={[0, rotation, 0]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={onClick}
                castShadow={false}
                receiveShadow={false}
                geometry={geometry}
                frustumCulled={true}
                userData={{
                    interactive: true,
                    title: artwork.title,
                    artist: artwork.artist,
                }}
            >
                <meshStandardMaterial
                    map={texture}
                    transparent
                    opacity={1}
                    side={THREE.FrontSide}
                    toneMapped={false}
                />

                {/* Frame border - only render if visible */}
                {isVisible && (
                    <lineSegments>
                        <edgesGeometry args={[geometry]} />
                        <lineBasicMaterial color="#B97A56" linewidth={1} />
                    </lineSegments>
                )}
            </mesh>

            {/* Info overlay - only render if hovered and visible */}
            {showInfo && isVisible && (
                <Html
                    position={[position[0], position[1] - 1.4, position[2] + 0.6]}
                    center
                    distanceFactor={8}
                    style={{
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                >
                    <div
                        className="bg-charcoal-ink/95 backdrop-blur-md border border-turquoise-core/30 rounded-lg px-4 py-3 shadow-2xl min-w-[200px] max-w-[300px]"
                        role="tooltip"
                        aria-label={`${artwork.title} by ${artwork.artist || 'Unknown Artist'}`}
                    >
                        <h3 className="text-dust-sand font-serif font-bold text-sm mb-1 line-clamp-2">
                            {artwork.title}
                        </h3>
                        <p className="text-turquoise-core text-xs font-medium mb-1">
                            {artwork.artist || 'Unknown Artist'}
                        </p>
                        <p className="text-soft-clay text-xs">
                            {artwork.year || 'Date Unknown'}
                        </p>
                    </div>
                </Html>
            )}
        </group>
    );
}
