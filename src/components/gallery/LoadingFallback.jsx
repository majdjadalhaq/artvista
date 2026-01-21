import { motion } from 'framer-motion';

/**
 * LoadingFallback Component
 * Beautiful loading screen for 3D gallery initialization
 */
export default function LoadingFallback({ progress = 0 }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-charcoal-ink z-50">
            <div className="text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h2 className="text-4xl font-serif font-bold text-dust-sand mb-4">
                        Preparing Gallery
                    </h2>
                    <p className="text-soft-clay text-lg">
                        Loading artworks into the virtual space...
                    </p>
                </motion.div>

                {/* Animated progress bar */}
                <div className="w-64 h-2 bg-graphite rounded-full overflow-hidden mx-auto">
                    <motion.div
                        className="h-full bg-gradient-to-r from-turquoise-core to-deep-teal"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Floating animation */}
                <motion.div
                    className="mt-12 flex justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-3 h-3 bg-turquoise-core rounded-full"
                            animate={{
                                y: [0, -10, 0],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
