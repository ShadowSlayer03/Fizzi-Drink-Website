"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Float, Environment } from "@react-three/drei";
import { SliceComponentProps } from "@prismicio/react";
import { Content, asText } from "@prismicio/client";
import { SodaCan } from "@/components/SodaCan";
import * as THREE from "three";
import { PrismicNextLink } from "@prismicio/next";
import FancyButton from "@/components/FancyButton";
import gsap from "gsap";
import { useGameFlowStore } from "@/store/gameFlowStore";
import NavMenu from "@/components/NavMenu";

export type LandingSliceProps = SliceComponentProps<Content.LandingSliceSlice>;

type FloatingCanProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  flavor: "lemonLime" | "grape" | "blackCherry" | "strawberryLemonade" | "watermelon" | undefined;
  onExplode?: boolean;
};

// Particle System for Liquid Spray
function LiquidParticles({
  position,
  color,
  active
}: {
  position: [number, number, number];
  color: string;
  active: boolean;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;
  const velocities = useRef<Float32Array>();

  useEffect(() => {
    if (!particlesRef.current) return;

    const geometry = particlesRef.current.geometry;
    const positions = new Float32Array(particleCount * 3);
    velocities.current = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = position[0];
      positions[i * 3 + 1] = position[1] + 3;
      positions[i * 3 + 2] = position[2];

      // Random spray velocities (slower, more graceful)
      velocities.current[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities.current[i * 3 + 1] = Math.random() * 0.3 + 0.2;
      velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, [position]);

  useFrame(() => {
    if (!particlesRef.current || !velocities.current || !active) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      // Apply velocity
      positions[i * 3] += velocities.current[i * 3];
      positions[i * 3 + 1] += velocities.current[i * 3 + 1];
      positions[i * 3 + 2] += velocities.current[i * 3 + 2];

      // Gravity (slower fall)
      velocities.current[i * 3 + 1] -= 0.005;

      // Reset if particle falls too low
      if (positions[i * 3 + 1] < position[1] - 5) {
        positions[i * 3] = position[0];
        positions[i * 3 + 1] = position[1] + 3;
        positions[i * 3 + 2] = position[2];
        velocities.current[i * 3] = (Math.random() - 0.5) * 0.2;
        velocities.current[i * 3 + 1] = Math.random() * 0.3 + 0.2;
        velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.2}
        color={color}
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingCan({ position, rotation, flavor, onExplode }: FloatingCanProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(...rotation);
    }
  }, [rotation]);

  // Shake animation on explode
  useEffect(() => {
    if (onExplode && groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: position[1] + 0.5,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "power2.inOut",
      });
    }
  }, [onExplode, position]);

  useFrame(() => {
    if (!groupRef.current) return;
    const can = groupRef.current.children[0];
    if (hovered) can.rotation.y += 0.01;
  });

  return (
    <group ref={groupRef} position={position}>
      <Float speed={1} rotationIntensity={0.4} floatIntensity={0.6}>
        <SodaCan
          scale={6}
          flavor={flavor}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        />
      </Float>
    </group>
  );
}

function LandingText({ heading }: { heading: string }) {
  const textRef = useRef<THREE.Mesh>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (textRef.current) textRef.current.geometry.center();
  }, []);

  useFrame(() => {
    if (!textRef.current) return;

    const targetRotationY = mouse.x * 0.3;
    const targetRotationX = -mouse.y * 0.18;

    textRef.current.rotation.y += (targetRotationY - textRef.current.rotation.y) * 0.08;
    textRef.current.rotation.x += (targetRotationX - textRef.current.rotation.x) * 0.08;
  });

  return (
    <>
      <Text3D
        ref={textRef}
        font="/fonts/Alpino_Variable_Regular.json"
        size={2}
        height={0.6}
        bevelEnabled
        bevelThickness={0.08}
        bevelSize={0.05}
        position={[0, 2, 0]}
      >
        {heading}
        <meshStandardMaterial color="#8C2E5D" metalness={0.6} roughness={0.3} />
      </Text3D>

      <mesh
        position={[0, 0, 0]}
        onPointerMove={(e) =>
          setMouse({
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2,
          })
        }
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

const LandingSlice: FC<LandingSliceProps> = ({ slice }) => {
  const { heading, subheading, cta_text, cta_link } = slice.primary;
  const [exploding, setExploding] = useState(false);
  const bubblesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, [])

  const triggerScrollToRules = useGameFlowStore((s) => s.triggerScrollToRules);

  const handleButtonClick = (e: React.MouseEvent) => {
    setExploding(true);

    if (bubblesRef.current) {
      const leftCanX = window.innerWidth * 0.20;
      const rightCanX = window.innerWidth * 0.75;
      const canY = window.innerHeight * 0.4;

      for (let i = 0; i < 30; i++) {
        const bubble = document.createElement("div");
        const size = gsap.utils.random(30, 100);

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.position = "fixed";
        bubble.style.borderRadius = "50%";
        bubble.style.left = `${leftCanX}px`;
        bubble.style.top = `${canY}px`;
        bubble.style.background = `radial-gradient(circle at 30% 30%, 
          rgba(255, 105, 180, 0.8), rgba(255, 105, 180, 0.3) 60%, transparent)`;
        bubble.style.boxShadow = "0 0 20px rgba(255, 105, 180, 0.6)";
        bubble.style.pointerEvents = "none";
        bubble.style.zIndex = "1000";

        bubblesRef.current?.appendChild(bubble);

        gsap.to(bubble, {
          x: gsap.utils.random(-400, 400),
          y: gsap.utils.random(-500, 100),
          scale: gsap.utils.random(0.3, 1.2),
          opacity: 0,
          duration: gsap.utils.random(2, 4),
          ease: "power1.out",
          onComplete: () => bubble.remove(),
        });
      }

      for (let i = 0; i < 30; i++) {
        const bubble = document.createElement("div");
        const size = gsap.utils.random(30, 100);

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.position = "fixed";
        bubble.style.borderRadius = "50%";
        bubble.style.left = `${rightCanX}px`;
        bubble.style.top = `${canY}px`;
        bubble.style.background = `radial-gradient(circle at 30% 30%, 
          rgba(138, 43, 226, 0.8), rgba(138, 43, 226, 0.3) 60%, transparent)`;
        bubble.style.boxShadow = "0 0 20px rgba(138, 43, 226, 0.6)";
        bubble.style.pointerEvents = "none";
        bubble.style.zIndex = "1000";

        bubblesRef.current?.appendChild(bubble);

        gsap.to(bubble, {
          x: gsap.utils.random(-400, 400),
          y: gsap.utils.random(-500, 100),
          scale: gsap.utils.random(0.3, 1.2),
          opacity: 0,
          duration: gsap.utils.random(2, 4),
          ease: "power1.out",
          onComplete: () => bubble.remove(),
        });
      }
    }

    setTimeout(() => setExploding(false), 4000);

    setTimeout(() => {
      document.body.style.overflow = "auto";
      triggerScrollToRules();
    }, 2000);
  };

  return (
    <>
      <NavMenu />

      <section
        className="relative w-full h-screen flex items-center justify-center bg-[#690B3D] overflow-hidden"
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
      >
        {/* 2D Bubble Container */}
        <div ref={bubblesRef} className="fixed inset-0 pointer-events-none z-50" />

        {/* 3D Scene */}
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <Environment files="/hdr/field.hdr" environmentIntensity={1.2} />

          {/* Floating Cans */}
          <FloatingCan
            position={[-8, -2, -2]}
            rotation={[0.1, 0.3, -0.4]}
            flavor="strawberryLemonade"
            onExplode={exploding}
          />

          <FloatingCan
            position={[8, -2, -2]}
            rotation={[0.1, -0.3, 0.4]}
            flavor="grape"
            onExplode={exploding}
          />

          {/* 3D Liquid Particles */}
          <LiquidParticles
            position={[-7.5, -2.5, -2]}
            color="#FF69B4"
            active={exploding}
          />
          <LiquidParticles
            position={[7.5, -2.5, -2]}
            color="#8A2BE2"
            active={exploding}
          />

          {/* 3D Heading */}
          <LandingText heading={asText(heading) || "FIZZI FUN!"} />
        </Canvas>

        {/* 2D Overlay UI */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          {subheading && (
            <p className="mt-[280px] text-2xl md:text-3xl font-bold text-white drop-shadow-lg max-w-3xl mx-auto px-4">
              {asText(subheading)}
            </p>
          )}
        </div>

        {/* CTA Button */}
        <div className="absolute bottom-20 z-10 text-center w-full">
          <div onClick={handleButtonClick} className="inline-block cursor-pointer">
            <PrismicNextLink field={cta_link} className="flex justify-center items-center">
              <FancyButton buttonText={cta_text || "Start Game 🎮"} />
            </PrismicNextLink>
          </div>
        </div>
      </section>

    </>
  );
};

export default LandingSlice;