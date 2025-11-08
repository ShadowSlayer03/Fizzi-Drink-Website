"use client";

import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";

const o = new THREE.Object3D();

type BubblesProps = {
  count?: number;
  speed?: number;
  bubbleSize?: number;
  opacity?: number;
  repeat?: boolean;
  color?: number;
  blendMode?: "normal" | "additive" | "subtractive" | "multiply" | "screen" | "difference"; // prop
};

export function Bubbles({
  count = 300,
  speed = 5,
  bubbleSize = 0.05,
  opacity = 0.5,
  repeat = true,
  color = 0xffffff,
  blendMode = "normal",
}: BubblesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const bubbleSpeed = useRef(new Float32Array(count));
  const minSpeed = speed * 0.001;
  const maxSpeed = speed * 0.005;

  const geometry = new THREE.SphereGeometry(bubbleSize, 16, 16);

  // Map string prop to Three.js blending mode
  const blendingMap: Record<string, THREE.Blending> = {
    normal: THREE.NormalBlending,
    additive: THREE.AdditiveBlending,
    subtractive: THREE.SubtractiveBlending,
    multiply: THREE.MultiplyBlending,
    screen: THREE.CustomBlending, // approximate
    difference: THREE.CustomBlending, // will need custom shader or CSS overlay
  };

  const material = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity,
    color,
    blending: blendingMap[blendMode] ?? THREE.NormalBlending,
  });

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < count; i++) {
      const o = new THREE.Object3D();
      o.position.set(
        gsap.utils.random(-4, 4),
        gsap.utils.random(-4, 4),
        gsap.utils.random(-4, 4)
      );
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      bubbleSpeed.current[i] = gsap.utils.random(minSpeed, maxSpeed);
    }

    mesh.instanceMatrix.needsUpdate = true;
    return () => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    };
  }, [count, minSpeed, maxSpeed]);

  useFrame(() => {
    if (!meshRef.current) return;

    const o = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, o.matrix);
      o.position.setFromMatrixPosition(o.matrix);
      o.position.y += bubbleSpeed.current[i];

      if (o.position.y > 4 && repeat) {
        o.position.y = -2;
        o.position.x = gsap.utils.random(-4, 4);
        o.position.z = gsap.utils.random(0, 8);
      }

      o.updateMatrix();
      meshRef.current.setMatrixAt(i, o.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[undefined, undefined, count]} geometry={geometry} material={material} />;
}

