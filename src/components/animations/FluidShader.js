export const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Liquid Wave Distortion based on mouse distance (simulated by hover intensity)
    float dist = distance(uv, uMouse);
    float wave = sin(dist * 10.0 - uTime * 2.0) * 0.5;
    
    // Bulge effect on hover
    pos.z += wave * uHover * 0.5;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uHover;
  uniform float uOpacity;
  uniform vec2 uMouse;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // 1. Chromatic Aberration (RGB Shift)
    // The shift intensity increases with hover/movement
    float shift = uHover * 0.02;
    
    vec4 r = texture2D(uTexture, uv + vec2(shift, 0.0));
    vec4 g = texture2D(uTexture, uv);
    vec4 b = texture2D(uTexture, uv - vec2(shift, 0.0));
    
    vec3 color = vec3(r.r, g.g, b.b);
    
    // 2. Liquid Grain/Noise Overlay
    float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    color += noise * 0.05;

    // 3. Vignette
    float dist = distance(uv, vec2(0.5));
    color *= smoothstep(0.8, 0.2, dist * (1.0 - uHover * 0.2));

    gl_FragColor = vec4(color, uOpacity);
  }
`;
