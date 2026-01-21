import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { TextureLoader } from 'three';
import { useUI } from '../../context/UIContext';
import { useCollection } from '../../context/CollectionContext';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { X, Heart, Maximize2, Minimize2, Share2, Info } from 'lucide-react';
import { vertexShader, fragmentShader } from '../animations/FluidShader';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

/**
 * Interactive 3D Card
 * Reacts to mouse movement with shader distortion
 * UPDATED: Dynamic Aspect Ratio to fit image perfectly
 */
function InteractiveCard({ imageUrl }) {
    const mesh = useRef();
    const [texture, setTexture] = useState(null);
    const [aspect, setAspect] = useState(1);

    // Mouse interaction for shader
    const mouse = useRef({ x: 0.5, y: 0.5 });

    useEffect(() => {
        const loader = new TextureLoader();
        loader.load(imageUrl || '/placeholder-art.jpg', (tex) => {
            // Calculate aspect ratio to fit image perfectly
            const imageAspect = tex.image.width / tex.image.height;
            setAspect(imageAspect);
            setTexture(tex);
        });

        const handleMove = (e) => {
            mouse.current = {
                x: e.clientX / window.innerWidth,
                y: 1.0 - (e.clientY / window.innerHeight)
            };
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, [imageUrl]);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uTexture: { value: null },
        uHover: { value: 0 },
        uOpacity: { value: 0 },
        uMouse: { value: [0.5, 0.5] }
    }), []);

    useFrame((state) => {
        if (mesh.current && texture) {
            mesh.current.material.uniforms.uTexture.value = texture;
            mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
            // Enter animation
            mesh.current.material.uniforms.uOpacity.value += (1 - mesh.current.material.uniforms.uOpacity.value) * 0.08;
            // Mouse tracking
            const targetX = mouse.current.x;
            const targetY = mouse.current.y;
            mesh.current.material.uniforms.uMouse.value = [targetX, targetY];
            // Hover effect (simulated constant "alive" feel)
            mesh.current.material.uniforms.uHover.value = Math.sin(state.clock.getElapsedTime()) * 0.5 + 0.5;

            // Subtle rotation
            mesh.current.rotation.y = (mouse.current.x - 0.5) * 0.2;
            mesh.current.rotation.x = (mouse.current.y - 0.5) * 0.2;
        }
    });

    // Dynamic Sizing Logic to "Fit" whole picture
    const MAX_DIM = 7;
    let width = 4.5;
    let height = 6;

    if (texture) {
        if (aspect > 1) { // Landscape
            width = Math.min(MAX_DIM, 6 * aspect); // Scale width
            height = width / aspect;
        } else { // Portrait
            height = Math.min(MAX_DIM, 6 / aspect); // Scale height
            width = height * aspect;
        }
    }

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[width, height, 64, 64]} />
            <shaderMaterial
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
                transparent={true}
            />
        </mesh>
    );
}

/**
 * Avant-Garde Detail View
 * "Glass Monolith" Design
 */
export default function DetailView() {
    const { selectedArtwork, closeArtwork } = useUI();
    const { addToCollection, removeFromCollection, collection } = useCollection();
    const [showInfo, setShowInfo] = useState(true);

    useKeyboardNavigation({ onEscape: closeArtwork });

    if (!selectedArtwork) return null;

    const isSaved = collection.some(item => item.id === selectedArtwork.id);

    // Smooth layout transitions
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    };

    const panelVariants = {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: '0%', opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } }
    };

    return (
        <AnimatePresence>
            <motion.div
                key="backdrop"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 z-[150] flex items-center justify-center overflow-hidden bg-black"
            >
                {/* 1. Cinematic Background Blur */}
                <div
                    className="absolute inset-0 opacity-40 blur-3xl scale-125 transition-all duration-1000"
                    style={{
                        backgroundImage: `url(${selectedArtwork.image_large || selectedArtwork.image})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink via-charcoal-ink/80 to-transparent" />

                {/* 2. Main 3D Stage (The "Pic") */}
                <div className={`relative z-10 w-full h-full transition-all duration-500 ease-in-out ${showInfo ? 'md:w-3/5 translate-x-0' : 'w-full scale-110'}`}>
                    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} className="w-full h-full pointer-events-auto">
                        <Suspense fallback={null}>
                            <InteractiveCard imageUrl={selectedArtwork.image_large || selectedArtwork.image} />
                        </Suspense>
                    </Canvas>

                    {/* Stage Controls */}
                    <div className="absolute bottom-8 left-8 flex gap-4">
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all group"
                        >
                            {showInfo ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
                            <span className="sr-only">Toggle View</span>
                        </button>
                    </div>
                </div>

                {/* 3. Floating Glass Info Panel (The "Info") */}
                <AnimatePresence>
                    {showInfo && (
                        <motion.div
                            variants={panelVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="absolute right-0 top-0 bottom-0 w-full md:w-[450px] bg-charcoal-ink/80 backdrop-blur-2xl border-l border-white/5 shadow-2xl p-8 md:p-12 flex flex-col z-20 overflow-y-auto custom-scrollbar"
                        >
                            {/* Header Actions */}
                            <div className="flex justify-between items-center mb-12">
                                <span className="text-xs uppercase tracking-[0.3em] text-turquoise-core/80">
                                    {selectedArtwork.id.split('_')[0]}
                                </span>
                                <button onClick={closeArtwork} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={24} className="text-white/70" />
                                </button>
                            </div>

                            {/* Typography Art */}
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl md:text-5xl font-serif text-dust-sand mb-4 leading-none"
                            >
                                {selectedArtwork.title}
                            </motion.h1>

                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '60px' }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="h-1 bg-turquoise-core mb-6"
                            />

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl text-soft-clay font-medium italic mb-8"
                            >
                                {selectedArtwork.artist}
                            </motion.p>

                            {/* Interactive Data Grid */}
                            <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-12">
                                <InfoItem label="Date" value={selectedArtwork.year} delay={0.4} />
                                <InfoItem label="Origin" value={selectedArtwork.origin} delay={0.5} />
                                <InfoItem label="Medium" value={selectedArtwork.medium} delay={0.6} />
                                <InfoItem label="Source" value={selectedArtwork.source} delay={0.7} />
                            </div>

                            <div className="prose prose-sm prose-invert text-soft-clay/80 mb-12 leading-relaxed">
                                <p>{selectedArtwork.description || "A masterwork from the collection, preserved digitally for your exploration."}</p>
                            </div>

                            {/* Floating Action Bar */}
                            <div className="mt-auto pt-8 flex gap-4 border-t border-white/5">
                                <button
                                    onClick={() => isSaved ? removeFromCollection(selectedArtwork.id) : addToCollection(selectedArtwork)}
                                    className={`flex-1 py-4 px-6 rounded-lg uppercase tracking-widest text-xs font-bold border transition-all flex items-center justify-center gap-3 ${isSaved
                                            ? 'bg-muted-copper text-charcoal-ink border-muted-copper hover:bg-white'
                                            : 'bg-transparent border-turquoise-core text-turquoise-core hover:bg-turquoise-core hover:text-charcoal-ink'
                                        }`}
                                >
                                    <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
                                    {isSaved ? 'Saved' : 'Collect'}
                                </button>

                                <button className="p-4 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </AnimatePresence>
    );
}

// Helper for animated grid items
function InfoItem({ label, value, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <h4 className="text-[10px] uppercase tracking-widest text-white/30 mb-1">{label}</h4>
            <p className="text-dust-sand font-medium">{value || '—'}</p>
        </motion.div>
    );
}
