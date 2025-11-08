// components/SodaCan.tsx
"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { forwardRef } from "react";

useGLTF.preload("/models/Soda-can.gltf");

const flavorTextures = {
  lemonLime: "/labels/lemon-lime.png",
  grape: "/labels/grape.png",
  blackCherry: "/labels/cherry.png",
  strawberryLemonade: "/labels/strawberry.png",
  watermelon: "/labels/watermelon.png",
};

const metalMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.3,
  metalness: 1,
  color: "#bbbbbb",
});

export type SodaCanProps = {
  flavor?: keyof typeof flavorTextures;
  scale?: number;
};

export const SodaCan = forwardRef<THREE.Group, SodaCanProps>(
  ({ flavor = "blackCherry", scale = 2, ...props }, ref) => {
    const { nodes } = useGLTF("/models/Soda-can.gltf");
    const labels = useTexture(flavorTextures);

    // Fix upside down
    Object.values(labels).forEach((label) => (label.flipY = false));

    const label = labels[flavor];

    return (
      <group
        {...props}
        ref={ref}
        dispose={null}
        scale={scale}
        rotation={[0, -Math.PI, 0]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.cylinder as THREE.Mesh).geometry}
          material={metalMaterial}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.cylinder_1 as THREE.Mesh).geometry}
        >
          <meshStandardMaterial roughness={0.15} metalness={0.7} map={label} />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Tab as THREE.Mesh).geometry}
          material={metalMaterial}
        />
      </group>
    );
  }
);
SodaCan.displayName = "SodaCan";
