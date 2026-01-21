import { useState, useCallback, useRef, useEffect } from "react";

export const TRANSITION_STATE = {
    IDLE: "idle",
    ENTERING: "entering", // Grid is splitting, Hero is moving
    ACTIVE: "active",     // Full overlay is visible
    EXITING: "exiting",   // Reversing animation
};

export const useArtworkTransition = () => {
    const [transitionState, setTransitionState] = useState(TRANSITION_STATE.IDLE);
    const [activeId, setActiveId] = useState(null);
    const [heroRect, setHeroRect] = useState(null);

    // Store refs to all card DOM elements to calculate geometry on demand
    const cardRefs = useRef(new Map());

    const registerCard = useCallback((id, node) => {
        if (node) {
            cardRefs.current.set(id, node);
        } else {
            cardRefs.current.delete(id);
        }
    }, []);

    const startTransition = useCallback((id) => {
        if (transitionState !== TRANSITION_STATE.IDLE) return;

        const node = cardRefs.current.get(id);
        if (!node) {
            console.error(`Attempted to transition to unknown card: ${id}`);
            return;
        }

        // Capture geometry at the moment of click
        const rect = node.getBoundingClientRect();
        setHeroRect(rect);
        setActiveId(id);

        // Lock body scroll immediately
        document.body.style.overflow = 'hidden';

        setTransitionState(TRANSITION_STATE.ENTERING);

        // Transition timing: Match this with your CSS/Framer easing duration
        // CSS: cubic-bezier(0.22, 1, 0.36, 1) usually takes ~0.8s - 1s for full heavy feel
        setTimeout(() => {
            setTransitionState(TRANSITION_STATE.ACTIVE);
        }, 1100);

    }, [transitionState]);

    const exitTransition = useCallback(() => {
        if (transitionState !== TRANSITION_STATE.ACTIVE) return;

        setTransitionState(TRANSITION_STATE.EXITING);

        setTimeout(() => {
            setTransitionState(TRANSITION_STATE.IDLE);
            setActiveId(null);
            setHeroRect(null);
            // Unlock body scroll
            document.body.style.overflow = '';
        }, 1000); // Wait for exit animation to finish
    }, [transitionState]);

    // Force exit cleanup if component unmounts
    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
        }
    }, []);

    // Calculate motion variants for grid items based on their position relative to the hero
    const getSplitVariants = useCallback((id) => {
        // If not active or no hero rect recorded, return minimal idle state
        if (!heroRect || id === activeId) return {};

        const node = cardRefs.current.get(id);
        if (!node) return {};

        const rect = node.getBoundingClientRect();

        // Determine position relative to hero
        // Note: Using a fuzz factor (e.g. 10px) to handle minor grid misalignments
        const isAbove = rect.bottom < heroRect.top + 10;
        const isBelow = rect.top > heroRect.bottom - 10;
        const isLeft = !isAbove && !isBelow && rect.right < heroRect.left + 10;
        const isRight = !isAbove && !isBelow && rect.left > heroRect.right - 10;

        let x = 0;
        let y = 0;

        if (isAbove) y = -150; // Move up
        if (isBelow) y = 150;  // Move down
        if (isLeft) x = -100;  // Move left
        if (isRight) x = 100;  // Move right

        return {
            idle: { opacity: 1, filter: "blur(0px)", x: 0, y: 0, scale: 1 },
            active: {
                opacity: 0.3,
                filter: "blur(4px)",
                x,
                y,
                scale: 0.95,
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
            }
        };
    }, [heroRect, activeId]);

    return {
        transitionState,
        activeId,
        heroRect,
        registerCard,
        startTransition,
        exitTransition,
        getSplitVariants, // Export new helper
        TRANSITION_STATE // Export for consumers
    };
};
