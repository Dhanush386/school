import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ── Floating Book ──────────────────────────────────────────────────────────
function Book({ position, rotation, scale, color }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4 + position[0]) * 0.3;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.2}>
      <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
        {/* Book cover */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 1, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Book pages */}
        <mesh position={[0.02, 0, 0.07]}>
          <boxGeometry args={[0.62, 0.92, 0.06]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.8} />
        </mesh>
        {/* Book spine stripe */}
        <mesh position={[-0.32, 0, 0]}>
          <boxGeometry args={[0.06, 1, 0.12]} />
          <meshStandardMaterial color={new THREE.Color(color).offsetHSL(0, 0, -0.15)} roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

// ── Floating Star ──────────────────────────────────────────────────────────
function GradCap({ position, scale }) {
  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group position={position} scale={scale}>
        {/* Board */}
        <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[1, 0.08, 1]} />
          <meshStandardMaterial color="#1a237e" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Cap */}
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.4, 8]} />
          <meshStandardMaterial color="#283593" roughness={0.4} />
        </mesh>
        {/* Button top */}
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

// ── Floating Sphere (planet-like) ──────────────────────────────────────────
function FloatingSphere({ position, color, size }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.005;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });
  return (
    <Float speed={0.8} floatIntensity={0.6} rotationIntensity={0.1}>
      <mesh ref={meshRef} position={position} castShadow>
        <sphereGeometry args={[size, 32, 32]} />
        <MeshWobbleMaterial
          color={color}
          factor={0.15}
          speed={1}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

// ── Floating Pencil ────────────────────────────────────────────────────────
function Pencil({ position, rotation }) {
  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1.0}>
      <group position={position} rotation={rotation}>
        {/* Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.4, 6]} />
          <meshStandardMaterial color="#f4c430" roughness={0.4} />
        </mesh>
        {/* Tip */}
        <mesh position={[0, -0.82, 0]} castShadow>
          <coneGeometry args={[0.08, 0.24, 6]} />
          <meshStandardMaterial color="#e8b020" roughness={0.4} />
        </mesh>
        {/* Eraser */}
        <mesh position={[0, 0.76, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.12, 6]} />
          <meshStandardMaterial color="#ff8a80" roughness={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

// ── Particle Cloud ─────────────────────────────────────────────────────────
function ParticleCloud({ count = 200 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return arr;
  }, [count]);

  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// ── Sky gradient plane ─────────────────────────────────────────────────────
function SkyGradient() {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    // Subtle shimmer
    meshRef.current.material.opacity = 0.92 + Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
  });
  return (
    <mesh ref={meshRef} position={[0, 0, -15]}>
      <planeGeometry args={[80, 40]} />
      <meshBasicMaterial transparent>
        <primitive attach="color" object={new THREE.Color('#87ceeb')} />
      </meshBasicMaterial>
    </mesh>
  );
}

// ── Main Scene ─────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Sky */}
      <SkyGradient />

      {/* Lighting */}
      <ambientLight intensity={1.2} color="#e8f4fd" />
      <directionalLight position={[10, 15, 5]} intensity={1.5} color="#fff9e6" castShadow />
      <directionalLight position={[-10, 5, -5]} intensity={0.4} color="#b3d9f2" />
      <pointLight position={[0, 8, 2]} intensity={0.6} color="#fffde7" />

      {/* Particle dust */}
      <ParticleCloud count={180} />

      {/* Books */}
      <Book position={[-6, 1.5, -2]} rotation={[0.1, 0.3, 0.05]} scale={1.1} color="#e53935" />
      <Book position={[5.5, -0.5, -1]} rotation={[-0.1, -0.4, -0.08]} scale={0.9} color="#1e88e5" />
      <Book position={[-4, -2, -3]} rotation={[0.05, 0.6, 0.12]} scale={0.8} color="#43a047" />
      <Book position={[2, 2.5, -4]} rotation={[0.2, -0.2, 0.04]} scale={1.0} color="#fb8c00" />
      <Book position={[7.5, 1, -5]} rotation={[0.1, 0.5, -0.05]} scale={0.7} color="#8e24aa" />
      <Book position={[-7.5, -1, -6]} rotation={[-0.05, -0.3, 0.1]} scale={0.85} color="#00897b" />

      {/* Graduation caps */}
      <GradCap position={[3.5, 3, -3]} scale={0.7} />
      <GradCap position={[-5, 2.5, -5]} scale={0.5} />
      <GradCap position={[0, -3, -2]} scale={0.6} />

      {/* Pencils */}
      <Pencil position={[-2.5, 3, -2]} rotation={[0.2, 0, 0.8]} />
      <Pencil position={[6, -2, -4]} rotation={[-0.3, 0.5, -0.5]} />
      <Pencil position={[-8, 0.5, -3]} rotation={[0.1, 0, 1.2]} />

      {/* Floating spheres (like bubbles) */}
      <FloatingSphere position={[1, -2.5, -1]} color="#64b5f6" size={0.35} />
      <FloatingSphere position={[-3.5, 0.5, -1.5]} color="#a5d6a7" size={0.25} />
      <FloatingSphere position={[4.5, 2, -2]} color="#ffcc80" size={0.3} />
      <FloatingSphere position={[-6, -0.5, -2]} color="#f48fb1" size={0.2} />
      <FloatingSphere position={[8, -1, -3]} color="#ce93d8" size={0.28} />

      {/* Soft stars in the distance */}
      <Stars radius={60} depth={30} count={800} factor={2} saturation={0.2} fade speed={0.5} />
    </>
  );
}

// ── Exported Canvas ────────────────────────────────────────────────────────
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#87ceeb']} />
      <fog attach="fog" args={['#b0d8f5', 20, 50]} />
      <Scene />
    </Canvas>
  );
}
