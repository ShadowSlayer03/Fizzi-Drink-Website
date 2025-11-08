"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGameFlowStore } from "@/store/gameFlowStore";
import Crosshair from "@/components/Crosshair";
import FallingSprites from "@/components/FallingSprites";
import { useLivesStore } from "@/store/livesStore";
import { useScoreStore } from "@/store/scoreStore";
import { useRouter } from "next/navigation";
import ScratchCard from "@/components/ScratchCard";

gsap.registerPlugin(ScrollToPlugin);

export type RulesProps = SliceComponentProps<Content.RulesSlice>;

const Rules: FC<RulesProps> = ({ slice }) => {
  const { shouldScrollToRules, lockScroll } = useGameFlowStore();
  const [showDialog, setShowDialog] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [hasPlayedBefore, setHasPlayedBefore] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [showScratchCard, setShowScratchCard] = useState(false);
  
  const sectionRef = useRef<HTMLElement | null>(null);
  const bubblesContainerRef = useRef<HTMLDivElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { lives } = useLivesStore();
  const { score } = useScoreStore();
  const router = useRouter();

  const POINTS_PER_DOLLAR = 100;
  const dollarValue = Math.floor(score / POINTS_PER_DOLLAR);

  // Check if user has played before and generate promo code
  useEffect(() => {
    const played = localStorage.getItem("fizzi_game_played");
    setHasPlayedBefore(!!played);
  }, []);

  const generatePromoCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "FIZZ";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  useEffect(() => {
    if (gameOver && !hasPlayedBefore) {
      localStorage.setItem("fizzi_game_played", "true");
      const code = generatePromoCode();
      setPromoCode(code);
      setShowScratchCard(true);
    }
  }, [gameOver, hasPlayedBefore]);

  // Initialize background music
  useEffect(() => {
    if (typeof window !== "undefined") {
      bgMusicRef.current = new Audio("/audio/game-music.mp3");
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.5;
    }

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (gameActive && !gameOver) {
      gameTimerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            if (gameTimerRef.current) clearInterval(gameTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [gameActive, gameOver]);

  useEffect(() => {
    if (gameActive && lives <= 0) {
      setGameOver(true);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    }
  }, [lives, gameActive]);

  useEffect(() => {
    if (gameActive && !gameOver && musicEnabled && bgMusicRef.current) {
      bgMusicRef.current.play().catch(err => console.log("Audio play failed:", err));
    } else if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }
  }, [gameActive, gameOver, musicEnabled]);

  const toggleMusic = () => {
    setMusicEnabled((prev) => !prev);
  };

  const restartGame = () => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);

    setGameOver(false);
    setGameStarted(true);
    setTimeRemaining(60);

    const gamePlayed = localStorage.getItem("fizzi_game_played");
    if(gamePlayed)
      setShowScratchCard(false);

    useLivesStore.setState({ lives: 3 });
    useScoreStore.setState({ score: 0 });

    if (bgMusicRef.current && musicEnabled) {
      bgMusicRef.current.currentTime = 0;
      bgMusicRef.current.play().catch((err) => console.log("Audio play failed:", err));
    }

    gsap.delayedCall(0.5, () => {
      setGameActive(true);
    });
  };

  const triggerBubbleTransition = () => {
    const container = bubblesContainerRef.current;
    if (!container) return;

    const bubbleCount = 400;
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement("div");
      const size = gsap.utils.random(10, 60);
      Object.assign(bubble.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${gsap.utils.random(0, 100)}%`,
        top: `${gsap.utils.random(100, 120)}%`,
        position: "absolute",
        borderRadius: "50%",
        background: "rgba(254, 232, 50, 0.6)",
        boxShadow: "0 0 15px rgba(254, 232, 50, 0.8)",
        pointerEvents: "none",
      });
      container.appendChild(bubble);

      gsap.to(bubble, {
        y: `-${window.innerHeight + 200}`,
        x: `+=${gsap.utils.random(-100, 100)}`,
        scale: gsap.utils.random(0.5, 1.3),
        opacity: 1,
        duration: gsap.utils.random(2, 5),
        delay: gsap.utils.random(0, 1.5),
        ease: "power1.inOut",
        onComplete: () => bubble.remove(),
      });
    }

    gsap.delayedCall(2.5, () => {
      if (sectionRef.current) {
        gsap.to(window, {
          duration: 2,
          scrollTo: { y: sectionRef.current, offsetY: 0 },
          ease: "power2.inOut",
          onComplete: () => {
            document.body.style.overflow = "hidden";
            lockScroll();
            gsap.delayedCall(1, () => setShowDialog(true));
          },
        });
      }
    });
  };

  useEffect(() => {
    if (shouldScrollToRules) triggerBubbleTransition();
  }, [shouldScrollToRules]);

  const handleStartGame = () => {
    gsap.to(".rules-dialog", {
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: "power2.in",
      onComplete: () => {
        setShowDialog(false);
        setGameStarted(true);
        gsap.delayedCall(1.5, () => setGameActive(true));
      },
    });
  };

  useEffect(() => {
    if (showDialog) {
      gsap.fromTo(
        ".rules-dialog",
        { opacity: 0, scale: 0.8, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }
      );
    }
  }, [showDialog]);

  return (
    <section
      id="rules-section"
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#fff8f9] via-[#ffe3ec] to-[#fff2d9] overflow-hidden"
    >
      <div
        ref={bubblesContainerRef}
        className="pointer-events-none fixed left-0 top-0 w-full h-full overflow-hidden z-40"
      />

      {showDialog && !gameStarted && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="rules-dialog bg-white/90 backdrop-blur-xl border border-[#fe6334]/30 p-10 rounded-3xl shadow-[0_0_40px_rgba(254,99,52,0.3)] max-w-lg w-full text-center">
            <h2 className="text-4xl font-bold text-[#FE6334] mb-5 drop-shadow-sm">
              {asText(slice?.primary?.title) || "Game Rules"}
            </h2>

            <div className="text-[#690B3D] text-lg leading-relaxed mb-8 space-y-4">
              {slice?.primary.rules_list?.length ? (
                <ul className="list-disc text-left ml-6 space-y-2">
                  {slice.primary.rules_list.map((r, i) => (
                    <li key={i}>{r.rule_text}</li>
                  ))}
                </ul>
              ) : (
                <p>{asText(slice.primary.rules_list_placeholder)}</p>
              )}
            </div>

            <button
              className="bg-[#FE6334] hover:bg-[#e85728] text-white px-10 py-4 rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
              onClick={handleStartGame}
            >
              {slice.primary.play_button_text || "Let's Goo 🚀"}
            </button>
          </div>
        </div>
      )}

      {gameStarted && !gameActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#fff8f9] via-[#ffe3ec] to-[#fff2d9] z-50">
          <h2 className="text-6xl font-extrabold text-[#FE6334] drop-shadow-[0_0_10px_rgba(254,99,52,0.5)] mb-4 animate-bounce">
            {slice.primary.gamescreenheading || "Fizz Frenzy!"}
          </h2>
          <p className="text-[#690B3D] text-xl font-medium mb-8">
            {slice.primary.gamescreeninfo}
          </p>
        </div>
      )}

      {gameActive && (
        <div className="absolute inset-0 flex flex-col bg-gradient-to-br from-[#fff8f9] via-[#ffe3ec] to-[#fff2d9] z-50 overflow-hidden">
          <Crosshair containerRef={sectionRef} color="#FF0000" />

          <div className="flex justify-between items-center px-10 py-6">
            <div className="text-[#FE6334] text-2xl font-bold drop-shadow-sm">
              {asText(slice.primary.hudscoretext)} <span className="text-[#690B3D]">{score}</span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={toggleMusic}
                className="w-12 h-12 rounded-full bg-[#FE6334] hover:bg-[#e85728] flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-40"
                aria-label="Toggle music"
              >
                <span className="text-2xl">{musicEnabled ? "🔊" : "🔇"}</span>
              </button>

              <div className="bg-white/80 p-2 rounded-lg">
                <p className="text-sm font-semibold">{asText(slice.primary.hudtimeremainingtext)}</p>
                <p className="text-xl text-center font-black text-[#FE6334]">{timeRemaining} sec</p>
              </div>

              <div className="flex items-center gap-3">
                {Array.from({ length: lives }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-white/100 border-2 border-white shadow-md flex items-center justify-center text-white font-bold"
                  >
                    ❤️
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-0 overflow-hidden h-screen">
            <FallingSprites />
          </div>

          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 rounded-full bg-[#FE6334]/40 animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              ></div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 w-full px-10 py-4 text-center text-[#690B3D] font-semibold text-sm tracking-wide bg-white/50 backdrop-blur-sm z-50">
            {slice.primary.hudcredittext} <span className="text-[#FE6334] font-bold">{slice.primary.hudcreditvalue}</span>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white/95 backdrop-blur-xl border-4 border-[#FE6334] p-8 md:p-12 rounded-3xl shadow-[0_0_60px_rgba(254,99,52,0.5)] max-w-2xl w-full text-center max-h-[90vh] overflow-y-auto">
            <h2 className="text-5xl md:text-7xl font-black text-[#FE6334] mb-6 drop-shadow-lg animate-pulse">
              {asText(slice.primary.gameoverheading)}
            </h2>

            <div className="space-y-6 mb-8">
              {/* Final Score */}
              <div className="bg-gradient-to-r from-[#FE6334] to-[#690B3D] p-6 rounded-2xl">
                <p className="text-white text-xl font-semibold mb-2">{slice.primary.gameovertotalpointstext}</p>
                <p className="text-[#FEE832] text-6xl font-black drop-shadow-lg">
                  {score <= 0 ? 0 : score}
                </p>
              </div>

              {/* First time player - Show dollar value and scratch card */}
              {!hasPlayedBefore && dollarValue > 0 && (
                <>
                  <div className="bg-[#FEE832] p-6 rounded-2xl border-4 border-[#FE6334]">
                    <p className="text-[#690B3D] text-2xl font-bold mb-2">{slice.primary.gameoverredeemablepointstext}</p>
                    <p className="text-[#FE6334] text-5xl font-black">${dollarValue}</p>
                    <p className="text-[#690B3D] text-sm mt-2 font-medium">{slice.primary.gameoverconversionrate}</p>
                  </div>

                  {/* Scratch Card */}
                  {showScratchCard && (
                    <div className="space-y-4">
                      <p className="text-[#690B3D] text-lg font-bold">
                        🎉 Scratch to reveal your exclusive promo code!
                      </p>
                      <ScratchCard promoCode={promoCode} />
                    </div>
                  )}
                </>
              )}

              {/* Returning player - Just show encouragement */}
              {hasPlayedBefore && (
                <div className="bg-[#FEE832] p-6 rounded-2xl border-4 border-[#FE6334]">
                  <p className="text-[#690B3D] text-xl font-bold">
                    {score > 400 ? "Great job! Keep playing to improve your score! 🎮" : "Better luck next time!" }
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-[#690B3D]">
                <div className="bg-white/80 p-4 rounded-xl border-2 border-[#FE6334]/30">
                  <p className="text-sm font-semibold">{slice.primary.gameovertimeplayedtext}</p>
                  <p className="text-2xl font-black text-[#FE6334]">
                    {60 - timeRemaining} {slice.primary.gameovertimeplayedunit}
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-xl border-2 border-[#FE6334]/30">
                  <p className="text-sm font-semibold">{slice.primary.gameoverliveslefttext}</p>
                  <p className="text-2xl font-black text-[#FE6334]">{lives <= 0 ? 0 : lives}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restartGame}
                className="bg-[#f63e06] hover:bg-[#ed7750] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                {slice.primary.gameoverplayagaintext}
              </button>
              {!hasPlayedBefore && (
                <button
                  onClick={() => router.push("/find-stores")}
                  className="bg-[#0B6931] hover:bg-[#2E8C4D] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {slice.primary.gameoverfindstorestext}
                </button>
              )}
            </div>

            <p className="text-[#690B3D] text-sm mt-6 font-medium">
              {asText(slice.primary.gameoverfizzipointstext)}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Rules;