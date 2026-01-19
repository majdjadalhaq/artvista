import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * IntroAnimation Component
 * Displays a cinematic "Zoom Through" effect for the brand name.
 * 
 * @param {Function} onComplete - Callback when animation finishes
 */
function IntroAnimation({ onComplete }) {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <AnimatePresence mode="wait" onExitComplete={onComplete}>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                >
                    <motion.div
                        className="text-center relative"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: [0.8, 1, 50],
                            opacity: [0, 1, 1, 0],
                            filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(20px)"]
                        }}
                        transition={{
                            duration: 3.5,
                            times: [0, 0.2, 0.8, 1],
                            ease: [0.76, 0, 0.24, 1] // Custom bezier for cinematic feel
                        }}
                        onAnimationComplete={() => setIsVisible(false)}
                    >
                        <h1 className="text-white text-9xl md:text-[12rem] font-display font-bold tracking-tighter whitespace-nowrap">
                            ArtVista
                        </h1>
                        <motion.p
                            className="text-white/60 text-xl font-sans tracking-[0.5em] uppercase mt-4 absolute w-full text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 1 }}
                        >
                            Digital Gallery
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default IntroAnimation;
