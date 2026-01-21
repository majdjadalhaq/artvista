import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { TextureLoader } from 'three';
import { useUI } from '../../context/UIContext';
import { useCollection } from '../../context/CollectionContext';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { X, Heart, MapPin, Palette } from 'lucide-react';
import { vertexShader, fragmentShader } from '../animations/FluidShader';
import { motion, AnimatePresence } from 'framer-motion';

function InteractiveCard({ imageUrl, isMobile }) {
    const mesh = useRef();
    const [texture, setTexture] = useState(null);
    const [aspect, setAspect] = useState(1);
    const mouse = useRef({ x: 0.5, y: 0.5 });

    useEffect(() => {
        const loader = new TextureLoader();
        loader.load(imageUrl || '/placeholder-art.jpg', (tex) => {
            setAspect(tex.image.width / tex.image.height);
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
            mesh.current.material.uniforms.uOpacity.value += (1 - mesh.current.material.uniforms.uOpacity.value) * 0.08;
            mesh.current.material.uniforms.uMouse.value = [mouse.current.x, mouse.current.y];

            if (!isMobile) {
                mesh.current.rotation.y = (mouse.current.x - 0.5) * 0.15;
                mesh.current.rotation.x = (mouse.current.y - 0.5) * 0.15;
            }
        }
    });

    const scaleFactor = isMobile ? 3.5 : 6;
    let width = scaleFactor;
    let height = scaleFactor;

    if (texture) {
        if (aspect > 1) {
            width = Math.min(isMobile ? 3.5 : 7, scaleFactor * aspect);
            height = width / aspect;
        } else {
            height = Math.min(isMobile ? 5 : 7, scaleFactor / aspect);
            width = height * aspect;
        }
    }

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[width, height, 48, 48]} />
            <shaderMaterial fragmentShader={fragmentShader} vertexShader={vertexShader} uniforms={uniforms} transparent={true} />
        </mesh>
    );
}

export default function DetailView() {
    const { selectedArtwork, closeArtwork } = useUI();
    const { addToCollection, removeFromCollection, collection } = useCollection();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useKeyboardNavigation({ onEscape: closeArtwork });

    if (!selectedArtwork) return null;

    const isSaved = collection.some(item => item.id === selectedArtwork.id);
    const imageSrc = selectedArtwork.image_large || selectedArtwork.image || selectedArtwork.imageUrl;
    const isKnownArtist = selectedArtwork.artist && selectedArtwork.artist.toLowerCase() !== 'unknown';

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.25, 0.4, 0.25, 1] }}
                className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-charcoal-ink overflow-hidden"
            >
                {/* Left Side - Artwork Image */}
                <div className="relative w-full h-[45vh] md:h-full md:w-3/5 lg:w-2/3 bg-black overflow-hidden">
                    <div className="absolute inset-0 opacity-30 blur-3xl scale-110" style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover' }} />
                    <div className="absolute inset-0 z-10">
                        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                            <Suspense fallback={null}>
                                <InteractiveCard imageUrl={imageSrc} isMobile={isMobile} />
                            </Suspense>
                        </Canvas>
                    </div>
                    <button onClick={closeArtwork} className="md:hidden absolute top-4 right-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-black/70 transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Right Side - Info Panel */}
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ duration: 0.18, ease: [0.25, 0.4, 0.25, 1] }}
                    className="w-full h-[55vh] md:h-full md:w-2/5 lg:w-1/3 bg-gradient-to-b from-charcoal-ink via-charcoal-ink to-black/80 border-l border-white/5 flex flex-col relative shadow-2xl overflow-hidden"
                >
                    {/* Close Button - Desktop */}
                    <div className="hidden md:flex justify-end p-6 pb-2">
                        <button onClick={closeArtwork} className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-8 py-2 md:py-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.08, duration: 0.16 }}
                            className="space-y-6"
                        >
                            {/* Badge */}
                            <div>
                                <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-turquoise-core bg-turquoise-core/10 rounded-full border border-turquoise-core/30">
                                    {selectedArtwork.source}
                                </span>
                            </div>

                            {/* Artwork Title */}
                            <div>
                                <h1 className="text-2xl md:text-4xl font-serif text-dust-sand leading-tight mb-2">
                                    {selectedArtwork.title}
                                </h1>
                            </div>

                            {/* Artist Section - Only if Known */}
                            {isKnownArtist ? (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    transition={{ delay: 0.1, duration: 0.14 }}
                                    className="pt-4 border-t border-white/10"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Artist Avatar/Placeholder */}
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-turquoise-core/40 to-muted-copper/40 border border-turquoise-core/30 flex items-center justify-center flex-shrink-0">
                                                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                                                    <span className="text-sm font-serif text-turquoise-core">
                                                        {selectedArtwork.artist.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Artist Info */}
                                        <div className="flex-1 pt-1">
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Artist</p>
                                            <p className="text-soft-clay font-serif text-lg">
                                                {selectedArtwork.artist}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : null}

                            {/* Metadata Grid */}
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                transition={{ delay: 0.12, duration: 0.13 }}
                                className="grid grid-cols-2 gap-4 py-4 border-y border-white/10"
                            >
                                {selectedArtwork.year && (
                                    <div>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Year</p>
                                        <p className="text-dust-sand font-medium">{selectedArtwork.year}</p>
                                    </div>
                                )}
                                {selectedArtwork.medium && (
                                    <div>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <Palette size={12} /> Medium
                                        </p>
                                        <p className="text-dust-sand font-medium text-sm">{selectedArtwork.medium}</p>
                                    </div>
                                )}
                                {selectedArtwork.origin && (
                                    <div className="col-span-2">
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <MapPin size={12} /> Origin
                                        </p>
                                        <p className="text-dust-sand font-medium text-sm">{selectedArtwork.origin}</p>
                                    </div>
                                )}
                            </motion.div>

                            {/* Description (plain text only) */}
                            {selectedArtwork.description && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    transition={{ delay: 0.14, duration: 0.13 }}
                                >
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Description</p>
                                    <p className="text-soft-clay/90 leading-relaxed font-light text-sm line-clamp-6 whitespace-pre-line">
                                        {String(selectedArtwork.description).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>

                    {/* Action Button */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 0.16, duration: 0.13 }}
                        className="p-6 md:p-8 border-t border-white/5 bg-black/40 backdrop-blur-md flex-shrink-0"
                    >
                        <button
                            onClick={() => isSaved ? removeFromCollection(selectedArtwork.id) : addToCollection(selectedArtwork)}
                            className={`w-full py-3 md:py-4 rounded-lg uppercase tracking-widest text-xs font-bold transition-all flex items-center justify-center gap-3 shadow-lg transform hover:scale-105 active:scale-95 ${isSaved
                                ? 'bg-muted-copper text-white border border-muted-copper/50 hover:bg-muted-copper/90'
                                : 'bg-turquoise-core text-charcoal-ink border border-turquoise-core/50 hover:bg-white'
                                }`}
                        >
                            <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                            {isSaved ? 'In Collection' : 'Add to Collection'}
                        </button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
