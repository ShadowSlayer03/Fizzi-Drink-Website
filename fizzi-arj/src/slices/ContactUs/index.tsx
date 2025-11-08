"use client";

import { FC, useRef, useState } from "react";
import { asText, Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls, Text3D } from "@react-three/drei";
import { SodaCan } from "@/components/SodaCan";
import * as THREE from "three";
import BubbleCursor from "@/components/BubbleCursor";
import SocialButtons from "@/components/SocialButtons";
import NavMenu from "@/components/NavMenu";

export type ContactUsProps = SliceComponentProps<Content.ContactUsSlice>;

// 🥤 3D Soda Can — follows mouse smoothly and faces front
function InteractiveCan({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const canRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!canRef.current) return;

    canRef.current.rotation.y += 0.25;

    const baseTilt = 0;
    const targetY = mousePosition.x * 0.6;
    const targetX = -mousePosition.y * 0.4 + baseTilt;

    canRef.current.rotation.y += (targetY - canRef.current.rotation.y) * 0.08;
    canRef.current.rotation.x += (targetX - canRef.current.rotation.x) * 0.08;

    canRef.current.position.x = THREE.MathUtils.lerp(canRef.current.position.x, mousePosition.x * 1.2, 0.05);
    canRef.current.position.y = THREE.MathUtils.lerp(canRef.current.position.y, -mousePosition.y * 0.6, 0.05);
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.7}>
      <SodaCan ref={canRef} scale={3} flavor="lemonLime" />
    </Float>
  );
}

// ✨ 3D Text — moves gently with cursor
function InteractiveText({
  text,
  mousePosition,
  position = [0, 0, 0],
}: {
  text: string;
  mousePosition: { x: number; y: number };
  position?: [number, number, number];
}) {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!textRef.current) return;

    textRef.current.geometry.center();

    const targetRotationY = mousePosition.x * 0.25;
    const targetRotationX = -mousePosition.y * 0.15;
    // const targetRotationZ = mousePosition.x * 0.15;

    textRef.current.rotation.y += (targetRotationY - textRef.current.rotation.y) * 0.08;
    textRef.current.rotation.x += (targetRotationX - textRef.current.rotation.x) * 0.08;
    // textRef.current.rotation.z += (targetRotationZ - textRef.current.rotation.z) * 0.05;
  });


  return (
    <Text3D
      ref={textRef}
      font="/fonts/Alpino_Variable_Regular.json"
      size={2}
      height={0.6}
      bevelEnabled
      bevelThickness={0.08}
      bevelSize={0.05}
      position={position}
    >
      {text}
      {/* Golden yellow with soft gloss look */}
      <meshStandardMaterial color="#FFD84D" metalness={0.6} roughness={0.3} />
    </Text3D>
  );
}

const ContactUs: FC<ContactUsProps> = ({ slice }) => {
  const { heading, address, email, phone, social_links } = slice.primary;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <>

     <NavMenu />

      <section
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#3A6E0A] text-white"
        onMouseMove={handleMouseMove}
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
      >
       <BubbleCursor />

        {/* 3D Scene */}
        <div className="absolute w-full h-full pointer-events-none z-20">
          <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <InteractiveCan mousePosition={mousePosition} />
            <InteractiveText text={asText(heading) || "Get In Touch"} mousePosition={mousePosition} position={[0, 1.5, 0.5]} />
            <Environment files="/hdr/field.hdr" environmentIntensity={1.5} />
            {/* <OrbitControls /> */}
          </Canvas>
        </div>

        {/* Contact Info — clean, modern look */}
        <div className="absolute bottom-24 z-30 flex flex-col items-center gap-5 text-center px-4">
          <div className="flex flex-col gap-3 text-white/90 font-semibold text-lg md:text-2xl backdrop-blur-sm bg-white/5 px-6 py-4 rounded-2xl shadow-lg border border-white/10">
            {address && <div>📍 {asText(address)}</div>}
            {email && (
              <div>
                ✉️{" "}
                <a
                  href={`mailto:${email}`}
                  className="underline underline-offset-4 decoration-[#FFD84D] hover:text-[#FFD84D] transition-colors"
                >
                  {email}
                </a>
              </div>
            )}
            {phone && <div>📞 {phone}</div>}
          </div>

          <SocialButtons />
        </div>
      </section>
    </>
  );
};

export default ContactUs;
