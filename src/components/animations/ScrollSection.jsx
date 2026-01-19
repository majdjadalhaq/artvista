import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ScrollSection Component
 * Adds scroll-based animations to content.
 * 
 * @param {string} type - 'fade-up', 'parallax', 'horizontal'
 * @param {string} className - Additional classes
 */
function ScrollSection({ children, type = 'fade-up', className = '', speed = 0.5 }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Parallax Y offset
    const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

    // Opacity fade
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

    if (type === 'parallax') {
        return (
            <div className={`overflow-hidden ${className}`} ref={ref}>
                <motion.div style={{ y }} className="relative z-0">
                    {children}
                </motion.div>
            </div>
        );
    }

    if (type === 'sticky') {
        return (
            <section ref={ref} className={`relative h-[300vh] ${className}`}>
                <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
                    {children}
                </div>
            </section>
        )
    }

    // Default: Fade Up Reveal
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default ScrollSection;
