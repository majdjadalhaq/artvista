import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

const VertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uHover;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Subtle wave effect on hover/entry
  float noise = sin(pos.x * 10.0 + uTime) * cos(pos.y * 10.0 + uTime);
  pos.z += noise * 0.1 * uHover;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FragmentShader = `
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uHover;

void main() {
  vec2 uv = vUv;
  
  // Distortion
  uv.x += sin(uv.y * 10.0 + uTime) * 0.01 * uHover;
  uv.y += cos(uv.x * 10.0 + uTime) * 0.01 * uHover;
  
  vec4 color = texture2D(uTexture, uv);
  gl_FragColor = color;
}
`;

function ImagePlane({ imageUrl }) {
    const meshRef = useRef();
    const texture = useLoader(TextureLoader, imageUrl);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uHover: { value: 1.0 }, // Start with effect active for entry
        uTexture: { value: texture }
    }), [texture]);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
            // Decay the hover/entry effect over time
            meshRef.current.material.uniforms.uHover.value = THREE.MathUtils.lerp(
                meshRef.current.material.uniforms.uHover.value,
                0,
                0.02
            );
        }
    });

    // Calculate aspect ratio to fit contain
    const aspect = texture.image.width / texture.image.height;

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[5 * aspect, 5, 32, 32]} />
            <shaderMaterial
                vertexShader={VertexShader}
                fragmentShader={FragmentShader}
                uniforms={uniforms}
                transparent
            />
        </mesh>
    );
}

export default function DisplacementImage({ imageUrl }) {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 4] }}>
                <ambientLight intensity={0.5} />
                <Suspense fallback={null}>
                    <ImagePlane imageUrl={imageUrl} />
                </Suspense>
            </Canvas>
        </div>
    );
}
