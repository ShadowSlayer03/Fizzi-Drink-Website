"use client";

import { SliceComponentProps } from "@prismicio/react";
import { Content } from "@prismicio/client";
import { JSX, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { View } from "@react-three/drei";
import { Bubbles } from "../Hero/Bubbles";

export type BigTextProps = SliceComponentProps<Content.BigTextSlice>;

const BigText = ({ slice }: BigTextProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const letters = containerRef.current.querySelectorAll<HTMLSpanElement>(
      ".bigtext-letter"
    );

    // Random jitter animation for carbonation
    letters.forEach((letter) => {
      gsap.to(letter, {
        x: () => gsap.utils.random(-5, 5),
        y: () => gsap.utils.random(-5, 5),
        rotation: () => gsap.utils.random(-10, 10),
        duration: () => gsap.utils.random(0.1, 0.3),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Hover pop
      letter.addEventListener("mouseenter", () => {
        gsap.to(letter, {
          z: 30,
          scale: gsap.utils.random(1.1, 1.2),
          color: "#FEE832",
          duration: 0.5,
          ease: "elastic.out(0.5)",
        });
      });

      letter.addEventListener("mouseleave", () => {
        gsap.to(letter, {
          z: 0,
          scale: 1,
          rotation: 0,
          color: "#FEE832",
          duration: 0.5,
          ease: "elastic.out(0.5)",
        });
      });
    });
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative h-[110vh] w-screen overflow-hidden bg-[#FE6334] text-[#FEE832] flex justify-center items-center px-4"
    >
      {/* Three.js Bubbles in background */}
      <View className="absolute inset-0 -z-10 pointer-events-none">
        <Bubbles count={200} speed={0.8} bubbleSize={0.05} opacity={0.5} repeat blendMode="difference" />
        <ambientLight intensity={2} color="#9DDEFA" />
      </View>

      {/* Text */}
      <h2
        ref={containerRef}
        className="grid w-full gap-[3vw] text-center font-black uppercase leading-[.7]"
      >
        <div className="text-[32vw]">
          {Array.from("Fizz").map((letter, i) => (
            <span key={i} className="inline-block bigtext-letter">
              {letter}
            </span>
          ))}
        </div>
        <div className="grid gap-[2vw] text-[34vw] md:flex md:text-[11vw]">
          {["that ", "gives", "good"].map((word, i) => (
            <span key={i} className="inline max-md:text-[27vw]">
              {Array.from(word).map((letter, j) => (
                <span key={j} className="inline">
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </div>
        <div className="text-[32vw]">
          {Array.from("Vibzz").map((letter, i) => (
            <span key={i} className="inline-block bigtext-letter">
              {letter}
            </span>
          ))}
        </div>
      </h2>
    </section>
  );
};

export default BigText;
