import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for managing gallery scroll animations
 * @param {object} cameraRef - Reference to Three.js camera
 * @param {object} options - Scroll configuration
 * @returns {object} Scroll control functions
 */
export function useGalleryScroll(cameraRef, options = {}) {
    const {
        totalDepth = 20,
        startZ = 5,
        endZ = -15,
        smoothness = 1.5,
        onScrollUpdate = null,
    } = options;

    const scrollTriggerRef = useRef(null);
    const tlRef = useRef(null);

    useEffect(() => {
        if (!cameraRef?.current) return;

        // Create GSAP timeline for camera movement
        tlRef.current = gsap.timeline({
            scrollTrigger: {
                trigger: '.gallery-container',
                start: 'top top',
                end: `+=${totalDepth * 100}`,
                scrub: smoothness,
                pin: false,
                onUpdate: (self) => {
                    if (onScrollUpdate) {
                        onScrollUpdate(self.progress);
                    }
                },
            },
        });

        // Animate camera position along Z-axis
        tlRef.current.to(cameraRef.current.position, {
            z: endZ,
            ease: 'none',
        });

        // Optional: Add slight rotation for walking effect
        tlRef.current.to(
            cameraRef.current.rotation,
            {
                y: 0.05,
                ease: 'none',
            },
            0
        );

        scrollTriggerRef.current = tlRef.current.scrollTrigger;

        // Cleanup
        return () => {
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.kill();
            }
            if (tlRef.current) {
                tlRef.current.kill();
            }
        };
    }, [cameraRef, totalDepth, startZ, endZ, smoothness, onScrollUpdate]);

    const scrollTo = (progress) => {
        if (scrollTriggerRef.current) {
            const scrollPosition = scrollTriggerRef.current.start +
                (scrollTriggerRef.current.end - scrollTriggerRef.current.start) * progress;
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth',
            });
        }
    };

    const reset = () => {
        if (cameraRef?.current) {
            gsap.to(cameraRef.current.position, {
                z: startZ,
                duration: 1,
                ease: 'power2.out',
            });
        }
    };

    return {
        scrollTo,
        reset,
        timeline: tlRef.current,
    };
}

/**
 * Hook for managing scroll-triggered artwork animations
 * @param {Array} artworkRefs - Array of artwork mesh references
 * @param {object} options - Animation options
 */
export function useArtworkScrollAnimations(artworkRefs, options = {}) {
    const {
        stagger = 0.1,
        fadeDistance = 5,
    } = options;

    useEffect(() => {
        if (!artworkRefs || artworkRefs.length === 0) return;

        const triggers = artworkRefs.map((ref, index) => {
            if (!ref?.current) return null;

            return ScrollTrigger.create({
                trigger: ref.current,
                start: `top+=${fadeDistance} bottom`,
                end: `bottom-=${fadeDistance} top`,
                onEnter: () => {
                    gsap.to(ref.current.material, {
                        opacity: 1,
                        duration: 0.6,
                        delay: index * stagger,
                    });
                },
                onLeave: () => {
                    gsap.to(ref.current.material, {
                        opacity: 0.3,
                        duration: 0.4,
                    });
                },
                onEnterBack: () => {
                    gsap.to(ref.current.material, {
                        opacity: 1,
                        duration: 0.6,
                    });
                },
                onLeaveBack: () => {
                    gsap.to(ref.current.material, {
                        opacity: 0.3,
                        duration: 0.4,
                    });
                },
            });
        });

        return () => {
            triggers.forEach((trigger) => {
                if (trigger) trigger.kill();
            });
        };
    }, [artworkRefs, stagger, fadeDistance]);
}
