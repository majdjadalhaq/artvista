import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import ArtworkCard from './ArtworkCard';

gsap.registerPlugin(ScrollTrigger);

export default function InteractiveGrid({ artworks }) {
    const containerRef = useRef(null);
    const gridRef = useRef(null);
    const itemRefs = useRef([]);
    const navigate = useNavigate();

    // 1. Scroll Momentum Logic (Fly Away + Skew)
    useLayoutEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        // "Scroll Momentum Warp" -> Skew/Translate based on velocity
        let proxy = { skew: 0, y: 0, z: 0 };
        let skewSetter = gsap.quickSetter(grid, "skewY", "deg");
        let ySetter = gsap.quickSetter(grid, "y", "px");
        let zSetter = gsap.quickSetter(grid, "z", "px"); // Add Z depth
        let clamp = gsap.utils.clamp(-5, 5); // Clamp skew
        let clampY = gsap.utils.clamp(-600, 600); // Larger fly distance (fly off screen)
        let clampZ = gsap.utils.clamp(-200, 100); // Depth effect

        const onScroll = ScrollTrigger.create({
            trigger: document.body,
            onUpdate: (self) => {
                const vel = self.getVelocity();
                // Velocity is pixels/sec. 
                const skew = clamp(vel / -400);
                const flyY = clampY(vel / -2.5); // More sensitive fly
                const flyZ = clampZ(Math.abs(vel) / -10); // Push back on scroll

                if (Math.abs(skew) > 0.1 || Math.abs(flyY) > 5) {
                    gsap.to(proxy, {
                        skew: skew,
                        y: flyY,
                        z: flyZ,
                        duration: 0.6,
                        ease: "power2.out", // Snappier
                        overwrite: true,
                        onUpdate: () => {
                            skewSetter(proxy.skew);
                            ySetter(proxy.y);
                            // zSetter(proxy.z); // Optional, might look weird if unchecked
                        }
                    });
                } else {
                    gsap.to(proxy, {
                        skew: 0,
                        y: 0,
                        z: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        overwrite: true,
                        onUpdate: () => {
                            skewSetter(proxy.skew);
                            ySetter(proxy.y);
                            // zSetter(0);
                        }
                    });
                }
            }
        });

        return () => {
            onScroll.kill();
        };
    }, []);

    // 2. Depth Focus Tunnel
    useLayoutEffect(() => {
        // "Center of viewport acts as a magnet"
        // We need to loop constantly or on scroll to update scales.
        // GSAP ticker is efficient for this.

        const updateScales = () => {
            const viewportCenter = window.innerHeight / 2;

            itemRefs.current.forEach((item) => {
                if (!item) return;
                const rect = item.getBoundingClientRect();
                const itemCenter = rect.top + rect.height / 2;

                // Distance from center (0 to viewportHeight/2)
                const dist = Math.abs(viewportCenter - itemCenter);
                const maxDist = window.innerHeight / 1.5;

                // Normalized closeness (1 = center, 0 = far)
                let closeness = 1 - (dist / maxDist);
                closeness = Math.max(0, closeness); // Clamp 0

                // "Closer to center lift (1.05), peripheral scale down (0.95)"
                const targetScale = 0.95 + (closeness * 0.1); // Range 0.95 to 1.05

                // Also "slide toward center" -> X translation? 
                // "Invisible Focus Tunnel: cards slightly slide toward center"
                // If item is left of center, move right. If right, move left.
                // We don't have X info easily unless we calc it or trust grid. 
                // Simple approach: Scale is enough for "Depth".

                gsap.set(item, { scale: targetScale });
            });
        };

        gsap.ticker.add(updateScales);
        return () => gsap.ticker.remove(updateScales);
    }, [artworks]);

    return (
        <div ref={containerRef} className="relative w-full z-10 perspective-[1000px]">
            {/* Grid Container with Skew Ref */}
            <div
                ref={gridRef}
                className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full origin-center will-change-transform"
            >
                {artworks.map((art, i) => (
                    <div
                        key={art.id}
                        ref={el => itemRefs.current[i] = el}
                        className="relative z-0 hover:z-20 transition-all duration-300" // Hover z-index boost
                    >
                        <ArtworkCard artwork={art} index={i} />

                        {/* Ghost Trail Layer? (Stretch Goal - Complex in DOM loop) */}
                    </div>
                ))}
            </div>
        </div>
    );
}
