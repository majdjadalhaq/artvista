import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useUI } from '../context/UIContext';

const IntroAnimation = () => {
    const { finishIntro } = useUI();

    useEffect(() => {
        // Safety timeout in case animation fails
        const timer = setTimeout(finishIntro, 3500);
        return () => clearTimeout(timer);
    }, [finishIntro]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
                animate={{
                    scale: [0.8, 1, 1, 50],
                    opacity: [0, 1, 1, 0],
                    filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(20px)'],
                }}
                transition={{
                    duration: 3,
                    times: [0, 0.2, 0.7, 1],
                    ease: "easeInOut"
                }}
                onAnimationComplete={() => finishIntro()}
                className="text-center"
            >
                <h1 className="text-8xl md:text-9xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-art-accent to-white tracking-tighter">
                    ArtVista
                </h1>
                <motion.p
                    className="mt-4 text-art-muted text-lg tracking-[0.3em] uppercase"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2.5, times: [0.3, 0.5, 0.9] }}
                >
                    Enter the Gallery
                </motion.p>
            </motion.div>
        </motion.div>
    );
};

export default IntroAnimation;
