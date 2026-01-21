import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useGalleryScroll } from '../../hooks/useGalleryScroll';

/**
 * ScrollCamera Component
 * Controls camera movement along the gallery wall based on scroll
 */
export default function ScrollCamera({
    totalDepth = 20,
    startZ = 5,
    endZ = -15,
    onScrollUpdate,
}) {
    const cameraRef = useRef();
    const { camera } = useThree();

    // Set up scroll-triggered camera movement
    const { scrollTo, reset } = useGalleryScroll(cameraRef, {
        totalDepth,
        startZ,
        endZ,
        smoothness: 1.5,
        onScrollUpdate,
    });

    // Initialize camera position
    useEffect(() => {
        if (cameraRef.current) {
            cameraRef.current.position.set(0, 0, startZ);
            cameraRef.current.lookAt(0, 0, 0);
        }
    }, [startZ]);

    // Smooth camera follow
    useFrame((state) => {
        if (cameraRef.current) {
            // Subtle camera sway for organic feel
            const time = state.clock.getElapsedTime();
            cameraRef.current.position.x = Math.sin(time * 0.2) * 0.1;

            // Always look slightly ahead
            const lookAheadZ = cameraRef.current.position.z - 2;
            cameraRef.current.lookAt(0, 0, lookAheadZ);
        }
    });

    return (
        <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            fov={75}
            near={0.1}
            far={1000}
            position={[0, 0, startZ]}
        />
    );
}
