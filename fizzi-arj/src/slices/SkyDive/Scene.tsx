"use client";

import { Content } from "@prismicio/client";
import { Cloud, Clouds, Environment, OrbitControls, Text3D } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FloatingCan from "@/components/FloatingCan";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger); // don't register hook as plugin

type SkyDiveProps = {
    sentence: string | null;
    flavor: Content.SkyDiveSliceDefaultPrimary["flavor"];
};

export default function Scene({ sentence, flavor }: SkyDiveProps) {
    const groupRef = useRef<THREE.Group | null>(null);
    const canRef = useRef<THREE.Group | null>(null);
    const cloud1Ref = useRef<THREE.Group | null>(null);
    const cloud2Ref = useRef<THREE.Group | null>(null);
    const cloudsRef = useRef<THREE.Group | null>(null);
    const wordsRef = useRef<THREE.Group | null>(null);

    const ANGLE = 75 * (Math.PI / 180);

    const getXPosition = (distance: number) => distance * Math.cos(ANGLE);
    const getYPosition = (distance: number) => distance * Math.sin(ANGLE);

    const getXYPositions = (distance: number) => ({
        x: getXPosition(distance),
        y: getYPosition(-1 * distance),
    });

    useGSAP(() => {
        if (
            !cloudsRef.current ||
            !canRef.current ||
            !wordsRef.current ||
            !cloud1Ref.current ||
            !cloud2Ref.current
        )
            return;

        // Set initial positions
        gsap.set(cloudsRef.current.position, { z: 10 });
        gsap.set(canRef.current.position, {
            ...getXYPositions(-4),
        });

        // IMPORTANT: wordsRef.current.children must be the Text3D meshes themselves.
        // We set their positions initially to match previous behavior.
        gsap.set(
            // children is an array of Object3D; each has a .position Vector3
            wordsRef.current.children.map((word) => word.position),
            { ...getXYPositions(7), z: 2 },
        );

        // Spinning can
        gsap.to(canRef.current.rotation, {
            y: Math.PI * 2,
            duration: 1.7,
            repeat: -1,
            ease: "none",
        });

        // Infinite cloud movement
        const DISTANCE = 15;
        const DURATION = 6;

        gsap.set([cloud2Ref.current.position, cloud1Ref.current.position], {
            ...getXYPositions(DISTANCE),
        });

        gsap.to(cloud1Ref.current.position, {
            y: `+=${getYPosition(DISTANCE * 2)}`,
            x: `+=${getXPosition(DISTANCE * -2)}`,
            ease: "none",
            repeat: -1,
            duration: DURATION,
        });

        gsap.to(cloud2Ref.current.position, {
            y: `+=${getYPosition(DISTANCE * 2)}`,
            x: `+=${getXPosition(DISTANCE * -2)}`,
            ease: "none",
            repeat: -1,
            delay: DURATION / 2,
            duration: DURATION,
        });

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".skydive",
                pin: true,
                start: "top top",
                end: "+=1800",
                scrub: 3,
            },
        });

        scrollTl
            .to("body", {
                backgroundColor: "#C0F0F5",
                overwrite: "auto",
                duration: 0.1,
            })
            .to(cloudsRef.current.position, { z: 0, duration: 0.3 }, 0)
            .to(
                canRef.current.position,
                {
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: "back.out(1.7)",
                },
                0
            )
            .to(
                // animate the positions of the text meshes directly (children are meshes)
                wordsRef.current.children.map((word) => word.position),
                {
                    x: getXPosition(-30),
                    y: -1 * getYPosition(-10),
                    z: -7,
                    // keyframes: [
                    //     { x: 0, y: 0, z: -1 },
                    //     { ...getXYPositions(-20), z: -7 },
                    // ],
                    stagger: 0.1,
                },
                0
            )
            .to(
                canRef.current.position,
                {
                    ...getXYPositions(4),
                    duration: 0.5,
                    ease: "back.in(1.7)",
                },
                "+=0"
            )
            .to(cloudsRef.current.position, { z: 7, duration: 0.5 });
    });

    return (
        <group ref={groupRef}>
            {/* Can */}
            <group rotation={[0, 0, 0.5]}>
                <FloatingCan
                    ref={canRef}
                    flavor={flavor}
                    rotationIntensity={0}
                    floatIntensity={3}
                    floatSpeed={3}
                >
                    <pointLight intensity={30} color="#8C0413" decay={0.6} />
                </FloatingCan>
            </group>

            {/* Clouds */}
            <Clouds ref={cloudsRef}>
                <Cloud ref={cloud1Ref} bounds={[10, 10, 2]} />
                <Cloud ref={cloud2Ref} bounds={[10, 10, 2]} />
            </Clouds>

            {/* Text group: children must be Text3D meshes (not nested group) */}
            <group ref={wordsRef}>
                {sentence && <ThreeText3D sentence={sentence} color="#D95494" />}
            </group>

            {/* Lights */}
            <ambientLight intensity={2} color="#9DDEFA" />
            <Environment files="/hdr/field.hdr" environmentIntensity={1.5} />
            {/* <OrbitControls /> */}
        </group>
    );
}

/**
 * ThreeText3D
 * - RETURNS an array of Text3D elements (NOT a wrapping <group>)
 * - computes centered X positions so words are not jammed
 * - uses font path string (Text3D will load it)
 */
function ThreeText3D({
    sentence,
    color = "white",
    size = 0.5,
    height = 0.2,
}: {
    sentence: string;
    color?: string;
    size?: number;
    height?: number;
}) {
    const words = sentence.toUpperCase().split(" ");
    const isDesktop = useMediaQuery("(min-width: 950px)", true);

    const wordSize = isDesktop ? size : size * 0.5;

    // heuristics to space words — tweak these numbers to taste for your font
    const charWidth = wordSize * 1; // approximate width per char
    const spaceWidth = wordSize * 1.8; // space between words

    // total width in world units for centering
    const totalWidth = words.reduce((sum, w, i) => {
        const wWidth = w.length * charWidth;
        return sum + wWidth + (i < words.length - 1 ? spaceWidth : 0);
    }, 0);

    // starting X so that text is centered
    let xOffset = totalWidth / 10;

    // Return an array of Text3D elements so the parent group's children are these meshes
    return words.map((word, i) => {
        const wordWidth = word.length * charWidth;
        const x = xOffset + wordWidth / 2; // center each word around its midpoint
        const initialY = 0; // parent GSAP will set to getXYPositions(7), so this can be 0
        const initialZ = 0;

        // advance offset for next word
        xOffset += wordWidth + spaceWidth;

        return (
            <Text3D
                key={`${word}-${i}`}
                font="/fonts/Alpino_Variable_Regular.json"
                size={wordSize}
                height={height}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.03}
                bevelSize={0.02}
                bevelSegments={5}
                position={[x, initialY, initialZ]}
            >
                {word}
                <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
            </Text3D>
        );
    });
}
