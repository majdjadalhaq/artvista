import { useEffect, useRef } from "react";
import { TRANSITION_STATE } from "./useArtworkTransition";

export const useScrollExit = (transitionState, onExit) => {
    const scrollAccumulator = useRef(0);
    const lastScrollTime = useRef(0);
    const THRESHOLD = 120; // Need a deliberate swipe/scroll
    const VELOCITY_THRESHOLD = 1.5; // Fast flick

    useEffect(() => {
        const isLocked = transitionState === TRANSITION_STATE.ACTIVE;

        if (!isLocked) {
            scrollAccumulator.current = 0;
            return;
        }

        const handleWheel = (e) => {
            // Prevent default behavior to separate UI logic from browser scroll
            // Note: handling 'wheel' prevents trackpad swipe navigation in some browsers if not careful,
            // but is necessary for "app-like" feel.
            e.preventDefault();

            const now = Date.now();
            const dt = now - lastScrollTime.current;
            lastScrollTime.current = now;

            // Simple velocity check (delta / time) is noisy, so we rely on accumulator primarily,
            // but reset sticky if pause is detected.
            if (dt > 100) {
                scrollAccumulator.current = 0;
            }

            // Damping: ignore small jitters
            if (Math.abs(e.deltaY) < 4) return;

            scrollAccumulator.current += e.deltaY;

            // Trigger Exit
            // We only support scrolling 'away' (e.g. up or down depending on visual metaphor).
            // Usually scrolling down (pulling down) or up (pushing away) exits.
            // Let's implement: Any significant scroll movement exits.
            if (Math.abs(scrollAccumulator.current) > THRESHOLD) {
                onExit();
                scrollAccumulator.current = 0;
            }
        };

        // Touch handling for mobile
        let touchStartY = 0;
        let touchStartTime = 0;

        const handleTouchStart = (e) => {
            // Only if single touch
            if (e.touches.length === 1) {
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
            }
        };

        const handleTouchMove = (e) => {
            if (transitionState === TRANSITION_STATE.ACTIVE) {
                e.preventDefault(); // Stop page scroll
            }
        };

        const handleTouchEnd = (e) => {
            if (transitionState !== TRANSITION_STATE.ACTIVE) return;

            const touchEndY = e.changedTouches[0].clientY;
            const dist = touchStartY - touchEndY; // Positive = swipe up
            const time = Date.now() - touchStartTime;
            const velocity = Math.abs(dist / time);

            // Swipe Up or Down triggers exit
            if (Math.abs(dist) > 80 || velocity > 0.5) {
                onExit();
            }
        };

        // Add non-passive listeners to allow preventDefault
        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchstart", handleTouchStart, { passive: true }); // passive true for start usually fine
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [transitionState, onExit]);
};
