import { Suspense, useState, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Loader, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import ScrollCamera from './ScrollCamera';
import DynamicLighting from './DynamicLighting';
import ArtworkPlane from './ArtworkPlane';
import ParticleField from './ParticleField';
import FloatingFrame from './FloatingFrame';
import { calculateGalleryPositions, getResponsiveLayout } from '../../utils/galleryLayout';
import { useWindowSize } from '../../hooks/useWindowSize';

/**
 * GalleryWall Component (Enhanced)
 * Main 3D gallery scene with particles, floating elements, and optimizations
 */
export default function GalleryWall({ artworks = [], onArtworkClick }) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const windowSize = useWindowSize();

    // Get responsive layout configuration
    const layoutConfig = useMemo(() => getResponsiveLayout(windowSize.width), [windowSize.width]);

    // Mobile optimization: reduce quality on smaller devices
    const isMobile = windowSize.width < 768;
    const performanceMode = isMobile || windowSize.width < 1024;

    // Calculate artwork positions
    const positions = useMemo(() => calculateGalleryPositions(artworks.length, {
        ...layoutConfig,
        wallDepth: 30,
        staggerAmount: 0.2,
    }), [artworks.length, layoutConfig]);

    // Calculate total depth for scroll spacer
    const totalDepth = useMemo(() => {
        if (positions.length === 0) return 20;
        const maxRow = Math.max(...positions.map(p => p.row));
        return (maxRow + 1) * layoutConfig.rowSpacing + 10;
    }, [positions, layoutConfig]);

    // Generate floating frames positions
    const floatingFrames = useMemo(() => {
        if (performanceMode) return []; // Skip on mobile for performance
        const frames = [];
        const frameCount = Math.min(6, Math.floor(artworks.length / 4)); // Fewer frames for performance
        for (let i = 0; i < frameCount; i++) {
            frames.push({
                position: [
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 15,
                    -Math.random() * totalDepth,
                ],
                size: [1 + Math.random(), 1.5 + Math.random()],
                color: Math.random() > 0.5 ? '#3FB6B2' : '#B97A56',
            });
        }
        return frames;
    }, [artworks.length, totalDepth, performanceMode]);

    const handleArtworkClick = useCallback((artwork) => {
        if (onArtworkClick) onArtworkClick(artwork);
    }, [onArtworkClick]);

    const handleScrollUpdate = useCallback((progress) => setScrollProgress(progress), []);

    if (!artworks || artworks.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-soft-clay text-lg">No artworks to display</p>
            </div>
        );
    }

    return (
        <>
            {/* 3D Canvas */}
            <div className="gallery-container fixed inset-0 w-full h-screen">
                <Canvas
                    shadows={false}
                    gl={{
                        antialias: !performanceMode,
                        alpha: false,
                        powerPreference: 'high-performance',
                        stencil: false,
                        depth: true,
                        logarithmicDepthBuffer: true,
                    }}
                    dpr={performanceMode ? [1, 1.2] : [1, 2]}
                    performance={{ min: 0.5 }}
                    frameloop="demand"
                    flat
                >
                    <AdaptiveDpr pixelated />
                    <AdaptiveEvents />
                    <Suspense fallback={null}>
                        <ScrollCamera
                            totalDepth={totalDepth}
                            startZ={5}
                            endZ={-(totalDepth - 10)}
                            onScrollUpdate={handleScrollUpdate}
                        />
                        <DynamicLighting scrollProgress={scrollProgress} />
                        <Environment preset="city" background={false} />
                        <fog attach="fog" args={['#1E1E1E', 10, 40]} />
                        {/* Particle field (skip on mobile) */}
                        {!performanceMode && (
                            <ParticleField
                                count={isMobile ? 60 : 120}
                                scrollProgress={scrollProgress}
                            />
                        )}
                        {/* Floating frames (skip on mobile) */}
                        {floatingFrames.map((frame, index) => (
                            <FloatingFrame
                                key={`frame-${index}`}
                                position={frame.position}
                                size={frame.size}
                                color={frame.color}
                            />
                        ))}
                        {/* Gallery wall background */}
                        <mesh
                            position={[0, 0, -totalDepth - 5]}
                            receiveShadow={!performanceMode}
                        >
                            <planeGeometry args={[50, 50]} />
                            <meshStandardMaterial
                                color="#2A2A2A"
                                roughness={0.8}
                                metalness={0.1}
                            />
                        </mesh>
                        {/* Floor */}
                        <mesh
                            rotation={[-Math.PI / 2, 0, 0]}
                            position={[0, -3, 0]}
                            receiveShadow={!performanceMode}
                        >
                            <planeGeometry args={[50, totalDepth + 20]} />
                            <meshStandardMaterial
                                color="#1E1E1E"
                                roughness={0.9}
                                metalness={0.05}
                            />
                        </mesh>
                        {/* Artworks */}
                        {artworks.map((artwork, index) => {
                            const pos = positions[index];
                            if (!pos) return null;
                            return (
                                <ArtworkPlane
                                    key={artwork.id || index}
                                    artwork={artwork}
                                    position={[pos.x, pos.y, pos.z]}
                                    rotation={pos.rotation}
                                    index={index}
                                    onClick={() => handleArtworkClick(artwork)}
                                />
                            );
                        })}
                    </Suspense>
                </Canvas>
                <Loader
                    containerStyles={{ background: 'rgba(30, 30, 30, 0.9)' }}
                    innerStyles={{ background: '#3FB6B2' }}
                    barStyles={{ background: '#3FB6B2' }}
                    dataStyles={{ color: '#D8D1C8', fontFamily: 'Inter, sans-serif' }}
                />
            </div>
            {/* Scroll spacer to enable scrolling */}
            <div
                className="pointer-events-none"
                style={{ height: `${totalDepth * 100}vh` }}
                aria-hidden="true"
            />
        </>
    );
}
