"use client";
import { useState, useEffect, useRef, JSX } from "react";
import Fizzi1 from "@/components/sprites/Fizzi1";
import Fizzi2 from "@/components/sprites/Fizzi2";
import Fizzi3 from "@/components/sprites/Fizzi3";
import Fizzi4 from "@/components/sprites/Fizzi4";
import Fizzi5 from "@/components/sprites/Fizzi5";
import Diamond from "@/components/sprites/Diamond";
import Bomb from "@/components/sprites/Bomb";
import gsap from "gsap";
import { useLivesStore } from "@/store/livesStore";
import { useScoreStore } from "@/store/scoreStore";

interface Sprite {
    id: number;
    x: number;
    y: number;
    speed: number;
    type: string;
    rotation: number;
}

type FallingSpritesProps = {
    setGameOver: (value: boolean) => void;
}

const FallingSprites = ({ setGameOver }: FallingSpritesProps) => {
    const [sprites, setSprites] = useState<Sprite[]>([]);
    const spriteRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const { lives, loseLife } = useLivesStore();
    const { score, setScore } = useScoreStore();

    const canPopSoundRef = useRef<HTMLAudioElement | null>(null);
    const bombSoundRef = useRef<HTMLAudioElement | null>(null);
    const diamondSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            canPopSoundRef.current = new Audio("/audio/can-pop.mp3");
            bombSoundRef.current = new Audio("/audio/bomb-explosion.mp3");
            diamondSoundRef.current = new Audio("/audio/diamond-collect.mp3");

            if (canPopSoundRef.current) canPopSoundRef.current.volume = 0.5;
            if (bombSoundRef.current) bombSoundRef.current.volume = 0.6;
            if (diamondSoundRef.current) diamondSoundRef.current.volume = 0.7;
        }

        return () => {
            canPopSoundRef.current = null;
            bombSoundRef.current = null;
            diamondSoundRef.current = null;
        };
    }, []);

    const componentsToPointsMapper = [
        { type: "Fizzi1", points: 10 },
        { type: "Fizzi2", points: 10 },
        { type: "Fizzi3", points: 10 },
        { type: "Fizzi4", points: 10 },
        { type: "Fizzi5", points: 10 },
        { type: "Bomb", points: -50 },
        { type: "Diamond", points: 100 },
    ];

    const componentsMap: Record<string, JSX.Element> = {
        Fizzi1: <Fizzi1 width={80} height={80} />,
        Fizzi2: <Fizzi2 width={80} height={80} />,
        Fizzi3: <Fizzi3 width={80} height={80} />,
        Fizzi4: <Fizzi4 width={80} height={80} />,
        Fizzi5: <Fizzi5 width={80} height={80} />,
        Diamond: <Diamond width={80} height={80} />,
        Bomb: <Bomb width={80} height={80} />,
    };

    const getRandomSpriteType = () => {
        const random = Math.random();
        if (random < 0.7) {
            const fizziKeys = ["Fizzi1", "Fizzi2", "Fizzi3", "Fizzi4", "Fizzi5"];
            return fizziKeys[Math.floor(Math.random() * fizziKeys.length)];
        } else if (random < 0.95) {
            return "Bomb";
        } else {
            return "Diamond";
        }
    };

    const playSound = (type: string) => {
        if (type.startsWith("Fizzi") && canPopSoundRef.current) {
            canPopSoundRef.current.currentTime = 0;
            canPopSoundRef.current.play().catch(err => console.log("Can Sound play failed:", err));
        } else if (type === "Bomb" && bombSoundRef.current) {
            bombSoundRef.current.currentTime = 0;
            bombSoundRef.current.play().catch(err => console.log("Bomb Sound play failed:", err));
        } else if (type === "Diamond" && diamondSoundRef.current) {
            diamondSoundRef.current.currentTime = 0;
            diamondSoundRef.current.play().catch(err => console.log("Diamond Sound play failed:", err));
        }
    };

    useEffect(() => {
        const spawnSprite = () => {
            const id = Date.now() + Math.random();
            const x = Math.random() * (window.innerWidth - 80);
            const speed = 3 + Math.random() * 4;
            const type = getRandomSpriteType();
            const rotation = Math.random() * 360;

            setSprites((prev) => [
                ...prev,
                { id, x, y: -100, speed, type, rotation },
            ]);
        };

        const interval = setInterval(spawnSprite, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        sprites.forEach((sprite) => {
            const element = spriteRefs.current.get(sprite.id);
            if (element && !element.dataset.animated) {
                element.dataset.animated = "true";

                gsap.to(element, {
                    y: window.innerHeight + 100,
                    rotation: sprite.rotation + 360,
                    duration: sprite.speed,
                    ease: "linear",
                    onComplete: () => {
                        setSprites((prev) => prev.filter((s) => s.id !== sprite.id));
                        spriteRefs.current.delete(sprite.id);
                    },
                });
            }
        });
    }, [sprites]);

    const handleSpriteClick = (id: number, type: string) => {
        const element = spriteRefs.current.get(id);
        if (!element) return;

        playSound(type);

        gsap.killTweensOf(element);

        gsap.to(element, {
            scale: 1.5,
            opacity: 0,
            rotation: "+=180",
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
                setSprites((prev) => prev.filter((s) => s.id !== id));
                spriteRefs.current.delete(id);
            },
        });

        const requiredMatch = componentsToPointsMapper.find((item) => type === item.type);
        const point = requiredMatch?.points || 0;

        setScore(score + point);

        if (type === "Bomb") {
            loseLife();
            if (lives === 0) setGameOver(true);
        }
    };

    return (
        <>
            {sprites.map((sprite) => (
                <div
                    key={sprite.id}
                    ref={(el) => {
                        if (el) spriteRefs.current.set(sprite.id, el);
                    }}
                    className="absolute cursor-pointer"
                    style={{
                        left: `${sprite.x}px`,
                        top: `${sprite.y}px`,
                        transform: "translate(-50%, 0)",
                        zIndex: 20,
                    }}
                    onClick={() => handleSpriteClick(sprite.id, sprite.type)}
                    id="falling-sprite"
                >
                    {componentsMap[sprite.type]}
                </div>
            ))}
        </>
    );
};

export default FallingSprites;