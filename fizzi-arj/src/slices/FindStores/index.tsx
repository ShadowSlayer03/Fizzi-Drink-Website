"use client";

import { FC, useEffect, useRef } from "react";
import { Content, asLink, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavMenu from "@/components/NavMenu";

gsap.registerPlugin(ScrollTrigger);

const World = dynamic(() => import("../../components/ui/globe").then((m) => m.World), {
  ssr: false,
});

export type FindStoresProps = SliceComponentProps<Content.FindStoresSlice>;

const FindStores: FC<FindStoresProps> = ({ slice }) => {
  const {
    primary: {
      title,
      subtitle,
      show_globe,
      globe_theme,
      background_style,
      background_image,
      cta_text,
      cta_link,
      storeslist,
    },
  } = slice;

  const fizziThemeColors = {
    Fizzi: {
      globeColor: "#16a34a",
      atmosphereColor: "#86efac",
      ambientLight: "#22c55e",
      pointLight: "#14532d",
      polygonColor: "rgba(255, 255, 255, 0.9)",
    },
    Classic: {
      globeColor: "#065f46",
      atmosphereColor: "#ffffff",
      ambientLight: "#4ade80",
      pointLight: "#ffffff",
      polygonColor: "rgba(255,255,255,0.85)",
    },
    Dark: {
      globeColor: "#052e16",
      atmosphereColor: "#22c55e",
      ambientLight: "#16a34a",
      pointLight: "#bbf7d0",
      polygonColor: "rgba(255,255,255,0.8)",
    },
  };

  const selectedTheme =
    fizziThemeColors[(globe_theme as keyof typeof fizziThemeColors) || "Fizzi"];

  const globeConfig = {
    pointSize: 4,
    globeColor: selectedTheme.globeColor,
    showAtmosphere: true,
    atmosphereColor: selectedTheme.atmosphereColor,
    atmosphereAltitude: 0.12,
    emissive: selectedTheme.globeColor,
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: selectedTheme.polygonColor,
    ambientLight: selectedTheme.ambientLight,
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: selectedTheme.pointLight,
    arcTime: 1500,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 72.8777, lng: 19.076 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const arcs = storeslist
    .filter((item) => item.latitude && item.longitude)
    .map((item) => ({
      order: 1,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: item.latitude as number,
      endLng: item.longitude as number,
      arcAlt: 0.3,
      color: selectedTheme.ambientLight,
    }));

  // 🌟 GSAP Animations
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in title slowly with scale-up
      gsap.fromTo(
        ".fizzi-title",
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 0.08,
          scale: 1,
          y: 0,
          duration: 2,
          ease: "power3.out",
        }
      );

      // Subtitle fade-in
      gsap.from(".fizzi-subtitle", {
        scrollTrigger: {
          trigger: ".fizzi-subtitle",
          start: "top 90%",
        },
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "power2.out",
      });

      // Store cards appear with stagger
      gsap.from(".fizzi-store-card", {
        scrollTrigger: {
          trigger: ".fizzi-store-grid",
          start: "top 85%",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
      });

      // CTA bounce-in
      gsap.from(".fizzi-cta", {
        scrollTrigger: {
          trigger: ".fizzi-cta",
          start: "top 90%",
        },
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "elastic.out(1, 0.7)",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <NavMenu />

      <section
        ref={sectionRef}
        data-slice-type={slice.slice_type}
        className={`relative w-full min-h-screen flex flex-col items-center justify-center ${background_style === "Gradient"
            ? "bg-gradient-to-br from-green-50 via-emerald-100 to-green-50"
            : background_style === "Solid"
              ? "bg-green-50"
              : ""
          } overflow-hidden`}
        style={{
          backgroundImage:
            background_style === "Image" && background_image?.url
              ? `url(${background_image.url})`
              : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 🌟 Background Title */}
        {title && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none z-10">
            <h1 className="fizzi-title text-[30rem] font-extrabold text-green-500 leading-none tracking-tighter">
              {asText(title)}
            </h1>
          </div>
        )}

        {/* 🌍 Globe */}
        {show_globe && (
          <div className="relative mt-20 w-full h-[500px] md:h-[700px] overflow-hidden z-10">
            <World data={arcs} globeConfig={globeConfig} />
          </div>
        )}

        {/* 📝 Subtitle */}
        {subtitle && (
          <div className="fizzi-subtitle relative z-20 text-center max-w-2xl mx-auto px-6 mt-40">
            <div className="text-lg text-green-800 leading-relaxed">
              <PrismicRichText field={subtitle} />
            </div>
          </div>
        )}

        {/* 🏪 Store List */}
        {storeslist?.length > 0 && (
          <div className="fizzi-store-grid relative z-30 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8 py-20 w-full max-w-7xl">
            {storeslist.map((store, i) => (
              <div
                key={i}
                className={`fizzi-store-card rounded-3xl p-6 shadow-lg border-2 ${store.featured ? "border-green-500" : "border-transparent"
                  } bg-white/80 backdrop-blur-md`}
              >
                {store.store_image?.url && (
                  <img
                    src={store.store_image.url}
                    alt={store.city || "Fizzi Store"}
                    className="w-full h-40 object-cover rounded-2xl mb-4"
                  />
                )}
                <h3 className="text-2xl font-bold text-green-500 mb-1">
                  {store.city}
                </h3>
                <p className="text-green-700 text-sm font-medium mb-2">
                  {store.country}
                </p>
                <p className="text-green-700/80 text-sm">{store.address}</p>
              </div>
            ))}
          </div>
        )}

        {/* 💚 CTA */}
        {cta_text && cta_link && (
          <a
            href={asLink(cta_link) || "#"}
            rel="noopener noreferrer"
            className="fizzi-cta relative z-40 mt-4 mb-16 inline-block bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
          >
            {cta_text}
          </a>
        )}
      </section>
    </>

  );
};

export default FindStores;
