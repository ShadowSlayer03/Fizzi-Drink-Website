"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";

const socials = [
  { icon: <FacebookOutlined />, url: "https://facebook.com", color: "#1877F2" },
  { icon: <InstagramOutlined />, url: "https://instagram.com", color: "#E1306C" },
  { icon: <TwitterOutlined />, url: "https://twitter.com", color: "#1DA1F2" },
  { icon: <YoutubeOutlined />, url: "https://youtube.com", color: "#FF0000" },
];

const SocialButtons = () => {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useGSAP(() => {
    buttonsRef.current.forEach((btn, i) => {
      if (!btn) return;

      const icon = btn.querySelector(".icon") as HTMLElement | null;

      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, { scale: 1.15, rotate: gsap.utils.random(-8, 8), duration: 0.3 });
        if (icon) gsap.to(icon, { color: socials[i].color, duration: 0.3 });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { scale: 1, rotate: 0, duration: 0.3 });
        if (icon) gsap.to(icon, { color: "#502314", duration: 0.3 });
      });
    });
  }, []);

  return (
    <div className="flex gap-5 justify-center my-6">
      {socials.map((social, i) => (
        <button
          key={i}
          ref={(el) => (buttonsRef.current[i] = el)}
          onClick={() => window.open(social.url, "_blank")}
          className="relative w-20 h-20 flex items-center justify-center rounded-full overflow-hidden bg-[#fff0d9] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-shadow duration-300"
        >
          <div className="circle absolute w-16 h-16 bg-[#6f3c2f] rounded-full opacity-0 scale-0 -z-10"></div>
          <span className="icon text-[2rem] text-[#502314] transition-colors duration-300">
            {social.icon}
          </span>
        </button>
      ))}
    </div>
  );
};

export default SocialButtons;
