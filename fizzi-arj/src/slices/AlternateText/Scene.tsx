"use client";

import FloatingCan from '@/components/FloatingCan';
import { Environment } from '@react-three/drei';
import React, { useRef } from 'react'
import { Group } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type Props = {}

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Scene = (props: Props) => {
    const canRef = useRef<Group>(null);

    const bgColors = ["FFA6B5", "#E9CFF6", "#CBEF9A"];

    const isDesktop = useMediaQuery("(min-width: 768px)", true);

    useGSAP(() => {
        if (!canRef.current) return;

        const sections = gsap.utils.toArray(".alternating-section");

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".alternating-text-view",
                endTrigger: ".alternating-text-container",
                pin: true,
                start: "top top",
                end: "bottom bottom",
                scrub: true
            }
        });

        sections.forEach((_, index) => {
            if (!canRef.current) return;
            if (index === 0) return;

            const isOdd = index % 2 !== 0;

            const xPos = isDesktop ? (isOdd ? "-1" : "1") : 0
            const yRot = isDesktop ? (isOdd ? "0.4" : "-0.4"): 0;

            scrollTl.to(canRef.current.position, {
                x: xPos,
                ease: "circ.inOut",
                delay: 0.5
            })

            .to(canRef.current.position, {
                y: yRot,
                ease: "back.inOut",
            }, "<")
                .to(".alternating-text-container", {
                    backgroundColor: gsap.utils.wrap(bgColors, index)
                })
        });
    }, { dependencies: [isDesktop] })

    return (
        <group ref={canRef} position-x={isDesktop ? 1 : 0} position-y={isDesktop ? -0.3: 0}>
            <FloatingCan flavor='strawberryLemonade' />
            <Environment files={'/hdr/lobby.hdr'} environmentIntensity={1.5} />
        </group>
    )
}

export default Scene