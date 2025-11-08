"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const FizziSectionBubbles = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    // Create 35–50 random bubbles
    const bubbleCount = 45;
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement("div");
      bubble.classList.add("bubble");

      // random size (big soda-like bubbles)
      const size = gsap.utils.random(25, 80);
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;

      // random horizontal position
      bubble.style.left = `${gsap.utils.random(0, 100)}%`;
      bubble.style.bottom = "0px";

      // realistic soda bubble gradient (slightly transparent + shimmer)
      bubble.style.background = `
        radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.2) 60%, rgba(255,255,255,0.05))
      `;
      bubble.style.boxShadow = `
        0 0 10px rgba(255,255,255,0.6),
        inset 0 0 15px rgba(255,255,255,0.3)
      `;
      bubble.style.borderRadius = "50%";
      bubble.style.position = "absolute";
      bubble.style.opacity = "0";
      bubble.style.mixBlendMode = "screen";

      container.appendChild(bubble);

      // rising + shimmering animation
      const riseDuration = gsap.utils.random(6, 12);
      const shimmerDuration = gsap.utils.random(1, 2);

      gsap.fromTo(
        bubble,
        {
          y: gsap.utils.random(0, 100),
          opacity: 0,
          scale: gsap.utils.random(0.8, 1.1),
        },
        {
          y: `-${gsap.utils.random(400, 800)}`,
          opacity: 1,
          duration: riseDuration,
          repeat: -1,
          delay: gsap.utils.random(0, 5),
          ease: "sine.inOut",
        }
      );

      // Shimmer effect (light reflection flicker)
      gsap.to(bubble, {
        scale: "+=0.1",
        opacity: "+=0.2",
        duration: shimmerDuration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed left-0 top-0 z-[10] h-full w-full overflow-hidden"
    ></div>
  );
};

export default FizziSectionBubbles;
