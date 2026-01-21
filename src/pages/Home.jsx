import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

export default function Home() {
    const navigate = useNavigate();
    const titleRef = useRef(null);
    const containerRef = useRef(null);

    const handleEnter = () => {
        // Animation sequence for entering
        const tl = gsap.timeline();

        tl.to(titleRef.current, {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: "power2.inOut"
        })
            .to('.enter-btn', {
                opacity: 0,
                duration: 0.5
            }, "-=0.8")
            .to(containerRef.current, {
                y: '-100vh',
                duration: 1.5,
                ease: "expo.inOut",
                onComplete: () => {
                    navigate('/explore'); // Navigate to Explore page
                }
            });
    };

    return (
        <div className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden">
            <AnimatePresence>
                <motion.div
                    ref={containerRef}
                    className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div ref={titleRef} className="text-center z-10 mix-blend-difference">
                        <h1 className="text-[12vw] md:text-[8vw] font-serif leading-[0.8] tracking-tight">
                            Art
                            <br />
                            Vista
                        </h1>
                        <p className="mt-8 text-sm uppercase tracking-[0.3em] opacity-60">
                            Explore artworks from world-class museums
                        </p>
                    </div>

                    <button
                        onClick={handleEnter}
                        className="enter-btn mt-16 px-12 py-4 border border-[var(--text-primary)] rounded-full uppercase tracking-widest text-xs hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-500"
                    >
                        Enter Gallery
                    </button>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
