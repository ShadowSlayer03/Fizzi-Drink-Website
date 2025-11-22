/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

"use client";

import React, { FC, useEffect, useRef, useState, forwardRef } from "react";
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
  flavor:
  | "lemonLime"
  | "grape"
  | "blackCherry"
  | "strawberryLemonade"
  | "watermelon"
  | undefined;
  onExplode?: boolean;
  // forwarded ref will be a Group
};

//
// ---------- FloatingCan (forwardRef so parent can animate group) ----------
//
const FloatingCan = forwardRef<THREE.Group, FloatingCanProps>(
  ({ position, rotation, flavor, onExplode }, ref) => {
    const groupRef = useRef<THREE.Group | null>(null);
    const localRef = (ref as React.MutableRefObject<THREE.Group | null>) || groupRef;
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
      // set initial rotation quickly
      const g = localRef.current;
      if (g) g.rotation.set(...rotation);
    }, [rotation, localRef]);

    useEffect(() => {
      if (onExplode && localRef.current) {
        gsap.to(localRef.current.position, {
          y: position[1] + 0.5,
          duration: 0.08,
          repeat: 4,
          yoyo: true,
          ease: "power2.inOut",
        });
      }
    }, [onExplode, position, localRef]);

    useFrame(() => {
      const g = localRef.current;
      if (!g) return;
      const can = g.children[0];
      if (hovered && can) (can.rotation as any).y += 0.01;
    });

    return (
      <group ref={localRef} position={position as any}>
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
);

FloatingCan.displayName = "FloatingCan";

//
// ---------- LandingText (forwardRef to expose mesh) ----------
//
const LandingText = forwardRef<THREE.Mesh, { heading: string }>(({ heading }, ref) => {
  const textRef = useRef<THREE.Mesh | null>(null);
  const localRef = (ref as React.MutableRefObject<THREE.Mesh | null>) || textRef;
  useEffect(() => {
    if (localRef.current && (localRef.current.geometry as any).center) {
      try {
        (localRef.current.geometry as any).center();
      } catch (e) {
        // ignore if not centerable
      }
    }
  }, [localRef]);

  // small rotation follow logic
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useFrame(() => {
    if (!localRef.current) return;
    const targetRotationY = mouse.x * 0.3;
    const targetRotationX = -mouse.y * 0.18;
    localRef.current.rotation.y += (targetRotationY - localRef.current.rotation.y) * 0.08;
    localRef.current.rotation.x += (targetRotationX - localRef.current.rotation.x) * 0.08;
  });

  return (
    <>
      <Text3D
        ref={localRef}
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
});

LandingText.displayName = "LandingText";

//
// ---------- LiquidParticles (same as before) ----------
//
function LiquidParticles({
  position,
  color,
  active,
}: {
  position: [number, number, number];
  color: string;
  active: boolean;
}) {
  const particlesRef = useRef<THREE.Points | null>(null);
  const particleCount = 200;
  const velocities = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (!particlesRef.current) return;
    const geometry = particlesRef.current.geometry;
    const positions = new Float32Array(particleCount * 3);
    velocities.current = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = position[0];
      positions[i * 3 + 1] = position[1] + 3;
      positions[i * 3 + 2] = position[2];
      velocities.current[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities.current[i * 3 + 1] = Math.random() * 0.3 + 0.2;
      velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  }, [position]);

  useFrame(() => {
    if (!particlesRef.current || !velocities.current || !active) return;
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities.current[i * 3];
      positions[i * 3 + 1] += velocities.current[i * 3 + 1];
      positions[i * 3 + 2] += velocities.current[i * 3 + 2];
      velocities.current[i * 3 + 1] -= 0.005;
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
      <pointsMaterial size={0.2} color={color} transparent opacity={0.9} sizeAttenuation />
    </points>
  );
}

//
// ---------- MAIN LANDING SLICE ----------
//
const LandingSlice: FC<LandingSliceProps> = ({ slice }) => {
  const { heading, subheading, cta_text, cta_link } = slice.primary;
  const [exploding, setExploding] = useState(false);
  const bubblesRef = useRef<HTMLDivElement | null>(null);
  const triggerScrollToRules = useGameFlowStore((s) => s.triggerScrollToRules);

  // Refs for animating objects inside Canvas
  const leftCanRef = useRef<THREE.Group | null>(null);
  const rightCanRef = useRef<THREE.Group | null>(null);
  const titleMeshRef = useRef<THREE.Mesh | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Explosion helper (unchanged)
  const handleButtonClick = () => {
    setExploding(true);

    if (bubblesRef.current) {
      const leftCanX = window.innerWidth * 0.2;
      const rightCanX = window.innerWidth * 0.75;
      const canY = window.innerHeight * 0.4;

      const createBubbleExplosion = (x: number, color: string) => {
        for (let i = 0; i < 30; i++) {
          const bubble = document.createElement("div");
          const size = gsap.utils.random(30, 100);
          Object.assign(bubble.style, {
            width: `${size}px`,
            height: `${size}px`,
            position: "fixed",
            left: `${x}px`,
            top: `${canY}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle at 30% 30%, ${color}, transparent)`,
            pointerEvents: "none",
            zIndex: "1000",
            boxShadow: "0 0 20px rgba(0,0,0,0.12)",
          });
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
      };

      createBubbleExplosion(leftCanX, "rgba(255, 105, 180, 0.6)");
      createBubbleExplosion(rightCanX, "rgba(138, 43, 226, 0.6)");
    }

    setTimeout(() => setExploding(false), 4000);
    setTimeout(() => {
      document.body.style.overflow = "auto";
      triggerScrollToRules();
    }, 2000);
  };

  // ---------- Entrance animation timeline ----------
  useEffect(() => {
    // Wait a tick so WebGL mounts and refs become available
    const start = () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          // Allow normal scrolling after intro is done
          document.body.style.overflow = "auto";
        },
      });

      // 1) Fade-in canvas wrapper
      tl.set(canvasWrapperRef.current, { autoAlpha: 0 });
      tl.to(canvasWrapperRef.current, { autoAlpha: 1, duration: 0.7 });

      // 2) Slide in left can (if ref exists)
      if (leftCanRef.current) {
        // move it slightly offscreen left then animate to its default x
        const g = leftCanRef.current;
        const originalX = g.position.x;
        gsap.set(g.position, { x: originalX - 6, y: g.position.y, z: g.position.z });
        tl.to(g.position, { x: originalX, duration: 1.1 }, "-=0.3");
        tl.to(
          g.rotation,
          { y: g.rotation.y + 0.5, duration: 1.1, ease: "power2.out" },
          "<"
        );
      }

      // 3) Slide in right can
      if (rightCanRef.current) {
        const g = rightCanRef.current;
        const originalX = g.position.x;
        gsap.set(g.position, { x: originalX + 6, y: g.position.y, z: g.position.z });
        tl.to(g.position, { x: originalX, duration: 1.1 }, "-=0.9");
        tl.to(
          g.rotation,
          { y: g.rotation.y - 0.5, duration: 1.1, ease: "power2.out" },
          "<"
        );
      }

      // 4) Reveal and scale the 3D title
      if (titleMeshRef.current) {
        const mesh = titleMeshRef.current;
        // ensure material is transparent to animate opacity
        const mat = Array.isArray(mesh.material) ? mesh.material[0] : (mesh.material as THREE.Material & { opacity?: number; transparent?: boolean });
        try {
          (mat as any).transparent = true;
          (mat as any).opacity = 0;
        } catch (e) {
          // ignore
        }
        // starting scale
        gsap.set(mesh.scale, { x: 0.6, y: 0.6, z: 0.6 });
        tl.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: "back.out(1.7)" }, "-=0.6");
        tl.to((mat as any), { opacity: 1, duration: 0.9 }, "-=1.0");
      }

      // 5) Subtitle (DOM) fade up
      tl.from(".landing-subtitle", { opacity: 0, y: 20, duration: 0.8 }, "-=0.4");

      // 6) CTA pop
      tl.from(".landing-cta", { opacity: 0, scale: 0.75, duration: 0.6, ease: "back.out(1.7)" }, "-=0.35");
    };

    // small delay to ensure Three canvas and objects are initialized
    const id = window.setTimeout(start, 80);
    return () => window.clearTimeout(id);
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavMenu />

      <section className="relative w-full h-screen flex items-center justify-center bg-[#690B3D] overflow-hidden">
        {/* bubbles overlay */}
        <div ref={bubblesRef} className="fixed inset-0 pointer-events-none z-50" />

        {/* Canvas wrapper (we animate this wrapper DOM) */}
        <div ref={canvasWrapperRef} className="landing-canvas-wrapper absolute inset-0">
          <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <Environment files="/hdr/field.hdr" environmentIntensity={1.2} />

            {/* floating cans — pass refs so parent can animate their group properties */}
            <FloatingCan
              // left can ref
              // @ts-ignore assigning ref to forwardRef component
              ref={leftCanRef}
              position={[-8, -2, -2]}
              rotation={[0.1, 0.3, -0.4]}
              flavor="strawberryLemonade"
              onExplode={exploding}
            />

            <FloatingCan
              // @ts-ignore
              ref={rightCanRef}
              position={[8, -2, -2]}
              rotation={[0.1, -0.3, 0.4]}
              flavor="grape"
              onExplode={exploding}
            />

            <LiquidParticles position={[-7.5, -2.5, -2]} color="#FF69B4" active={exploding} />
            <LiquidParticles position={[7.5, -2.5, -2]} color="#8A2BE2" active={exploding} />

            {/* LandingText with ref so we can reveal it */}
            {/* @ts-ignore */}
            <LandingText ref={titleMeshRef} heading={asText(heading) || "FIZZI FUN!"} />
          </Canvas>
        </div>

        {/* Subtitle DOM — animated after title */}
        {subheading && (
          <p className="landing-subtitle absolute mt-[280px] text-2xl md:text-3xl font-bold text-white drop-shadow-lg max-w-3xl text-center mx-auto px-4 pointer-events-none z-20">
            {asText(subheading)}
          </p>
        )}

        {/* CTA — animated last */}
        <div className="landing-cta absolute bottom-20 z-30 text-center w-full">
          <div onClick={handleButtonClick} className="inline-block cursor-pointer">
            <PrismicNextLink field={cta_link} className="flex justify-center items-center pointer-events-auto">
              <FancyButton buttonText={cta_text || "Start Game 🎮"} />
            </PrismicNextLink>
          </div>
        </div>
      </section>
    </>
  );
}

export default LandingSlice;