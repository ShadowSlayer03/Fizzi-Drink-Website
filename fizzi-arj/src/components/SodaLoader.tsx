"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { SodaCan } from "@/components/SodaCan";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

function ShakingCan({ progress }: { progress: number }) {
  const canRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (!canRef.current) return;

    timeRef.current += delta;

    const easedProgress = Math.pow(progress / 100, 1.8);
    const intensity = 0.01 + easedProgress * 0.08;
    const frequency = 0.3 + easedProgress * 1.7;

    const shake1 = Math.sin(timeRef.current * frequency * Math.PI * 2) * intensity;
    const shake2 = Math.sin(timeRef.current * frequency * Math.PI * 2 * 1.3 + 0.5) * intensity * 0.5;
    const shake3 = Math.sin(timeRef.current * frequency * Math.PI * 2 * 0.7 + 1) * intensity * 0.3;

    const jitterAmount = easedProgress * 0.003;
    const jitterX = (Math.random() - 0.5) * jitterAmount;
    const jitterY = (Math.random() - 0.5) * jitterAmount;

    canRef.current.position.y = shake1 + shake2 + jitterY;
    canRef.current.position.x = shake3 + jitterX;
    canRef.current.rotation.z = shake1 * 0.5;
  });

  return <SodaCan ref={canRef} scale={2} />;
}

function LoaderBubbles({ progress }: { progress: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bubblesCreatedRef = useRef(0);
  const maxBubbles = 400;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Calculate how many bubbles we should have based on progress
    const easedProgress = Math.pow(progress / 100, 2.5);
    const targetBubbles = Math.floor(easedProgress * maxBubbles);

    // Only create new bubbles if we haven't reached the target
    const bubblesNeeded = targetBubbles - bubblesCreatedRef.current;
    
    if (bubblesNeeded <= 0) return;

    // Create bubbles in batches to avoid lag
    const batchSize = Math.min(bubblesNeeded, 20);

    for (let i = 0; i < batchSize; i++) {
      const bubble = document.createElement("div");
      bubble.classList.add("loader-bubble");

      const size = gsap.utils.random(30, 60);
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${gsap.utils.random(0, 100)}%`;
      bubble.style.bottom = "-100px";

      bubble.style.background = `
        radial-gradient(circle at 30% 30%, rgba(254, 232, 50, 0.9), rgba(254, 232, 50, 0.3) 60%, rgba(254, 232, 50, 0.1))
      `;
      bubble.style.boxShadow = `
        0 0 15px rgba(254, 232, 50, 0.7),
        inset 0 0 20px rgba(255, 255, 255, 0.4)
      `;
      bubble.style.borderRadius = "50%";
      bubble.style.position = "absolute";
      bubble.style.opacity = "1";
      bubble.style.mixBlendMode = "screen";
      bubble.style.pointerEvents = "none";

      container.appendChild(bubble);

      const riseDuration = gsap.utils.random(4, 9);
      const shimmerDuration = gsap.utils.random(1, 2);

      gsap.fromTo(
        bubble,
        {
          y: 0,
          opacity: 1,
          scale: gsap.utils.random(0.7, 1),
        },
        {
          y: `-${gsap.utils.random(window.innerHeight + 200, window.innerHeight + 500)}`,
          opacity: 1,
          duration: riseDuration,
          delay: gsap.utils.random(0, 0.5),
          ease: "sine.inOut",
          onComplete: () => {
            bubble.remove();
          },
        }
      );

      gsap.to(bubble, {
        scale: "+=0.15",
        opacity: 1,
        duration: shimmerDuration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      bubblesCreatedRef.current++;
    }
  }, [progress]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed left-0 top-0 z-[5] h-full w-full overflow-hidden"
    />
  );
}

export default function SodaLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 0.5;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FE6334] overflow-hidden">
      <div className="absolute top-32 text-[#FEE832] font-extrabold text-6xl text-center z-50">
        Fizzing up your Experience...
      </div>

      <LoaderBubbles progress={progress} />

      <div className="absolute bottom-32 text-[#FEE832] font-extrabold text-4xl z-50 drop-shadow-[0_0_10px_rgba(254,232,50,0.7)]">
        {Math.floor(progress)}%
      </div>

      <Canvas className="w-full h-screen" camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[3, 3, 5]} intensity={1.2} />

        <ShakingCan progress={progress} />

        <Environment files="/hdr/field.hdr" environmentIntensity={1.2} />
      </Canvas>
    </div>
  );
}