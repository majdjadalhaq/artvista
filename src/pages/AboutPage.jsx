import { motion } from 'framer-motion';

const AboutPage = () => {
    return (
        <div className="min-h-screen pt-32 px-6 md:px-12 pb-20 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
                <div className="space-y-8">
                    <h1 className="text-6xl font-serif font-bold text-white mb-2">About <br /><span className="text-art-accent">ArtVista</span></h1>
                    <div className="h-1 w-20 bg-white" />

                    <div className="prose prose-invert text-art-muted prose-lg">
                        <p>
                            ArtVista is a modern digital museum experience designed to make exploring art immersive and accessible.
                            Built as a final project for Hack Your Future.
                        </p>
                        <p>
                            We aggregate data from world-class institutions like the Art Institute of Chicago to bring history to your screen.
                        </p>
                    </div>
                </div>

                <div className="bg-art-surface p-8 border border-white/5 rounded-sm">
                    <h3 className="text-xl text-white font-serif mb-6">Technical Stack</h3>
                    <ul className="space-y-4 text-sm text-art-muted font-mono">
                        <li className="flex justify-between border-b border-white/5 pb-2">
                            <span>Frontend</span>
                            <span className="text-white">React v18 + Vite</span>
                        </li>
                        <li className="flex justify-between border-b border-white/5 pb-2">
                            <span>Styling</span>
                            <span className="text-white">TailwindCSS</span>
                        </li>
                        <li className="flex justify-between border-b border-white/5 pb-2">
                            <span>Animation</span>
                            <span className="text-white">Framer Motion</span>
                        </li>
                        <li className="flex justify-between border-b border-white/5 pb-2">
                            <span>Data</span>
                            <span className="text-white">AIC API</span>
                        </li>
                        <li className="flex justify-between border-b border-white/5 pb-2">
                            <span>State</span>
                            <span className="text-white">Context API + LocalStorage</span>
                        </li>
                    </ul>
                </div>
            </motion.div>
        </div>
    );
};

export default AboutPage;
