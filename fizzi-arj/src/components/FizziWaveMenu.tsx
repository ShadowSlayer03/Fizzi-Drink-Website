"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { MENU_ITEMS, WAVE_COLORS } from "@/constants/menuConstants";
import { useRouter } from "next/navigation";

export default function FizziWaveMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const wavesRef = useRef<(SVGPathElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const animationFrameRef = useRef<number>();
  const router = useRouter();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => setHeight(window.innerHeight);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    if (!isOpen || height === 0) return;

    gsap.set(wavesRef.current, { opacity: 0, xPercent: 0 });
    gsap.set(textRefs.current, { opacity: 0 });

    tl.current?.kill();
    tl.current = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    WAVE_COLORS.forEach((_, i) => {
      const fromLeft = i % 2 === 0;
      tl.current!.fromTo(
        wavesRef.current[i],
        { xPercent: fromLeft ? -120 : 120, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 1.2 },
        i * 0.25
      );
    });

    tl.current!.to(
      textRefs.current,
      {
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      },
      `+=${WAVE_COLORS.length * 0.15}` // wait until waves finish
    );

    const start = performance.now();
    const segmentHeight = height / WAVE_COLORS.length;

    function animateWaves(time: number) {
      const elapsed = (time - start) / 1000;

      wavesRef.current.forEach((wave, i) => {
        if (!wave) return;
        const amplitude = 40;
        const wavelength = 400;
        const speed = 0.35 + i * 0.07;
        const offset = i * Math.PI * 0.6;
        const baseY = i * segmentHeight + segmentHeight / 5;

        let d = `M 0 ${baseY}`;
        for (let x = 0; x <= 1000; x += 30) {
          const y =
            baseY +
            Math.sin((x / wavelength + elapsed * speed) * 2 * Math.PI + offset) *
              amplitude;
          d += ` L ${x} ${y}`;
        }
        d += ` L 1000 ${height} L 0 ${height} Z`;
        wave.setAttribute("d", d);
      });

      textRefs.current.forEach((text, i) => {
        if (!text) return;
        const amplitude = 40;
        const wavelength = 400;
        const speed = 0.25 + i * 0.07;
        const offset = i * Math.PI * 0.6;
        const yShift =
          Math.sin((500 / wavelength + elapsed * speed) * 2 * Math.PI + offset) *
          amplitude *
          0.5;
        text.style.transform = `translate(-50%, ${yShift}px)`;
      });

      animationFrameRef.current = requestAnimationFrame(animateWaves);
    }

    animationFrameRef.current = requestAnimationFrame(animateWaves);

    return () => {
      tl.current?.kill();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isOpen, height]);

  if (height === 0) return null;
  const segmentHeight = height / WAVE_COLORS.length;

  return (
    <div
      className={`fixed inset-0 z-[200] transition-opacity duration-700 overflow-hidden ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 1000 ${height}`}
        preserveAspectRatio="none"
      >
        {WAVE_COLORS.map((color, i) => (
          <path
            key={i}
            ref={(el) => (wavesRef.current[i] = el)}
            d={`M0,${i * segmentHeight} L1000,${i * segmentHeight} L1000,${height} L0,${height} Z`}
            fill={color}
            opacity={0.95}
          />
        ))}
      </svg>

      <div className="absolute inset-0 z-[210]">
        {MENU_ITEMS.map((item, i) => (
          <div
            key={item.text}
            ref={(el) => (textRefs.current[i] = el)}
            onClick={() => {
              router.push(item.path);
              onClose();
            }}
            className="absolute left-1/2 text-center cursor-pointer opacity-0 group"
            style={{
              top: `${i * segmentHeight + segmentHeight / 2}px`,
              transform: "translate(-50%, -50%)",
              willChange: "transform",
            }}
          >
            <div className="text-[#FEE832] text-lg font-bold mb-1 opacity-90 group-hover:opacity-100 transition-opacity">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div
              className="text-white text-6xl md:text-7xl font-extrabold tracking-tight group-hover:scale-110 transition-transform duration-300"
              style={{
                textShadow:
                  "0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(254,99,52,0.3)",
                WebkitTextStroke: "1px rgba(254,232,50,0.4)",
              }}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="absolute top-5 right-6 z-[230] flex items-center justify-center w-14 h-14 rounded-full bg-[#FE6334] hover:bg-[#FEE832] hover:scale-110 transition-all duration-300 shadow-lg"
        aria-label="Close menu"
      >
        <div className="relative flex justify-center">
          <div className="absolute w-7 h-[4px] bg-white rotate-45 rounded-full" />
          <div className="absolute w-7 h-[4px] bg-white -rotate-45 rounded-full" />
        </div>
      </button>
    </div>
  );
}
