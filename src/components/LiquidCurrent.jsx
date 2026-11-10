import React, { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    vUv = uv;
    vec3 p = position;
    float wave = sin(p.x * 2.8 + uTime * 0.22) * 0.025
      + cos(p.y * 3.4 - uTime * 0.18) * 0.018;
    p.z += wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.,0.)), f.x),
      mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
  }
  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.12;
    vec2 flow = uv + vec2(sin(uv.y * 5.0 + t) * 0.055, cos(uv.x * 4.0 - t) * 0.035);
    float n = noise(flow * vec2(5.0, 7.0) + t);
    float bands = sin((flow.x * 2.1 + flow.y * 1.45 + n * 0.28) * 18.0 - t * 2.2);
    float caustic = smoothstep(0.78, 0.99, bands * 0.5 + 0.5) * 0.34;
    float glow = exp(-length((uv - vec2(0.53, 0.48)) * vec2(1.0, 1.25)) * 2.8);
    vec3 deep = vec3(0.012, 0.085, 0.14);
    vec3 ocean = vec3(0.025, 0.31, 0.43);
    vec3 ice = vec3(0.45, 0.83, 0.91);
    vec3 color = mix(deep, ocean, smoothstep(0.12, 0.9, n + glow * 0.5));
    color += ice * caustic * (0.35 + glow);
    color += vec3(0.035, 0.16, 0.22) * glow;
    float edge = smoothstep(0.0, 0.18, uv.y) * smoothstep(0.0, 0.18, 1.0 - uv.y);
    float alpha = (0.22 + caustic * 0.5 + glow * 0.2) * edge;
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function CurrentSurface({ reducedMotion }) {
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) }
  }), []);

  useFrame((state, delta) => {
    if (!reducedMotion) uniforms.uTime.value += Math.min(delta, 0.04);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2, 96, 96]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function LiquidCurrent() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  if (!webglAvailable) return null;

  return (
    <div className="liquid-current-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1], fov: 50 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        frameloop={reducedMotion ? 'never' : 'always'}
        onCreated={({ gl }) => {
          if (!gl.getContext()) setWebglAvailable(false);
        }}
      >
        <CurrentSurface reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
