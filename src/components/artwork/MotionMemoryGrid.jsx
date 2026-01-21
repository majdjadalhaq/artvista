import { useRef, useEffect, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

// --- SHADERS ---
const VertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform vec2 uBias; // The accumulated memory bias
uniform float uScrollY;

// Pseudo-random for variety
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vUv = uv;
    vec3 pos = position;

    // World position of the instance/mesh
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    
    // 3. Local Folding (Cell-Level Effect)
    // "Aligned -> slight scale down + closer spacing"
    // "Opposed -> subtle stretch + increased gap"
    
    // Simplified: dot product of Bias and local position (relative to center)
    // We want the grid to feel like it's reacting to the "wind" of the scroll history
    
    float alignment = dot(normalize(worldPos.xy), normalize(uBias + vec2(0.001))); 
    float strength = length(uBias);
    
    // Subtle z-displacement ("dents") based on bias strength
    pos.z -= strength * 0.5 * sin(worldPos.y * 0.1 + uTime);
    
    // Local compression/stretch along Y axis based on usage
    // If we are scrolling down fast (neg Y bias), align -> compress
    if (strength > 0.1) {
        pos.y += alignment * strength * 0.2; 
    }

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}
`;

const FragmentShader = `
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
    vec4 tex = texture2D(uTexture, vUv);
    gl_FragColor = vec4(tex.rgb, tex.a * uOpacity);
}
`;

// --- PHYSICS SYSTEM ---
const Motionmanager = ({ setBias }) => {
    const { camera } = useThree();
    const memory = useRef([]); // Store impulses
    const lastScroll = useRef(window.scrollY);

    useFrame((state, delta) => {
        // 1. Capture Impulse
        const currentScroll = window.scrollY;
        const scrollDelta = currentScroll - lastScroll.current;
        lastScroll.current = currentScroll;

        // Invert Y because DOM scroll down = positive, but usually feels like moving "down" into scene
        // actually 3D camera moves down (-y) to see lower items? 
        // Let's stick to: scroll down -> camera y decreases.
        // DOM scrollY increases on scroll down. 
        // Velocity: positive = scrolling down.

        // Push impulse if moving
        if (Math.abs(scrollDelta) > 0.1) {
            memory.current.push({
                x: 0, // Vertical scroll mostly, maybe add mouse x later
                y: scrollDelta * 0.05, // Scale down
                strength: Math.abs(scrollDelta),
                decay: 1.0
            });
        }

        // Cap memory size
        if (memory.current.length > 12) memory.current.shift();

        // Decay
        memory.current.forEach(m => m.decay *= 0.985);
        memory.current = memory.current.filter(m => m.decay > 0.05);

        // 2. Calculate Bias
        const bias = memory.current.reduce((acc, m) => {
            acc.x += m.x * m.decay * 0.06;
            acc.y += m.y * m.decay * 0.06;
            return acc;
        }, { x: 0, y: 0 });

        // Update Camera (Space Warping)
        // We add the bias to the camera position, so the user "drifts"
        // But we must respect the actual scroll position as the baseline.
        // Baseline Y = -window.scrollY * SCALE
        const baselineY = -window.scrollY * 0.02; // Scale DOM pixels to 3D units

        // Apply bias to the *offset* from baseline, or lag? 
        // "Motion feels assisted in familiar directions"
        // Let's add bias to the lookAt target or slight camera offset

        camera.position.y = THREE.MathUtils.lerp(camera.position.y, baselineY - bias.y * 2, 0.1);

        // Pass bias to parent for shaders
        setBias(new THREE.Vector2(bias.x, bias.y));
    });

    return null;
}

const ArtworkCell = ({ artwork, index, bias, onClick }) => {
    // Grid Layout Logic
    const columns = 3;
    const x = (index % columns) * 3 - 3; // -3, 0, 3
    const y = -Math.floor(index / columns) * 4; // 0, -4, -8...

    // Load texture (basic)
    // Note: In prod, use a placeholder or texture loader manager. 
    // For now, simpler material or texture loader.
    const texture = useTexture(artwork.image_url || '/placeholder-art.jpg');

    const materialRef = useRef();

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
            materialRef.current.uniforms.uBias.value = bias;
            materialRef.current.uniforms.uScrollY.value = window.scrollY;
        }
    });

    return (
        <mesh position={[x, y, 0]} onClick={() => onClick(artwork.id)}>
            <planeGeometry args={[2.5, 3.5, 16, 16]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={VertexShader}
                fragmentShader={FragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                    uBias: { value: new THREE.Vector2(0, 0) },
                    uScrollY: { value: 0 },
                    uTexture: { value: texture },
                    uOpacity: { value: 1.0 }
                }}
                transparent
            />
        </mesh>
    );
}

const Scene = ({ artworks, onArtworkClick }) => {
    const [bias, setBias] = useState(new THREE.Vector2(0, 0));
    const { viewport } = useThree();

    return (
        <>
            <Motionmanager setBias={setBias} />
            <group position={[0, viewport.height / 2 - 2, 0]}>
                {artworks.map((art, i) => (
                    <ArtworkCell
                        key={art.id}
                        artwork={art}
                        index={i}
                        bias={bias}
                        onClick={onArtworkClick}
                    />
                ))}
            </group>
        </>
    );
}

export default function MotionMemoryGrid({ artworks }) {
    const navigate = useNavigate();

    // DOM Overlay for height to enable native scroll interaction
    // We need a div that is as tall as the grid would be, to force the browser scrollbar
    const totalRows = Math.ceil(artworks.length / 3);
    const estimatedHeight = totalRows * 400; // rough pixel height

    return (
        <div className="relative w-full">
            {/* The Canvas stays fixed as background or covers the area */}
            <div className="fixed inset-0 z-0 top-0 left-0 pointer-events-none">
                {/* pointer-events-none on wrapper, but we need events on canvas? 
                    Actually, if we want native scroll, we scroll the BODY. 
                    The Canvas should be fixed position, full screen.
                    But we need to click items. pointer-events-auto on canvas.
                 */}
                <Canvas camera={{ position: [0, 0, 10], fov: 50 }} style={{ pointerEvents: 'auto' }}>
                    <ambientLight intensity={0.5} />
                    <Suspense fallback={null}>
                        <Scene artworks={artworks} onArtworkClick={(id) => navigate(`/artwork/${id}`)} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Invisible Scroll Spacer */}
            <div style={{ height: `${estimatedHeight}px`, width: '100%' }}></div>
        </div>
    );
}
