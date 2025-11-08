"use client";

import { useRef, useEffect, useState } from "react";

interface ScratchCardProps {
    promoCode: string;
    onReveal?: () => void;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ promoCode, onReveal }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isScratching, setIsScratching] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [scratchPercentage, setScratchPercentage] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Create scratch-off surface
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#FE6334");
        gradient.addColorStop(0.5, "#FEE832");
        gradient.addColorStop(1, "#690B3D");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add texture pattern
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        for (let i = 0; i < 100; i++) {
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                2,
                2
            );
        }

        // Add text
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.font = "bold 24px Alpino";
        ctx.textAlign = "center";
        ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = "16px Alpino";
        ctx.fillText("to reveal your promo code", canvas.width / 2, canvas.height / 2 + 20);
    }, []);

    const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || isRevealed) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let x, y;

        if ("touches" in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        // Scratch effect
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Calculate scratch percentage
        checkScratchPercentage();
    };

    const checkScratchPercentage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparent = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] < 128) {
                transparent++;
            }
        }

        const percentage = (transparent / (pixels.length / 4)) * 100;
        setScratchPercentage(percentage);

        if (onReveal) onReveal();
    };

    const handleMouseDown = () => setIsScratching(true);
    const handleMouseUp = () => setIsScratching(false);

    return (
        <div className="relative w-full h-32 bg-white rounded-2xl border-4 border-[#FE6334] overflow-hidden shadow-xl">
            {/* Hidden content beneath scratch layer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#FEE832] to-[#FE6334] p-6">
                <p className="text-[#930350] text-3xl font-black tracking-wider">{promoCode}</p>
                <p className="text-black text-sm mt-4 font-medium">Redeem this at any Fizzi store near you!</p>
            </div>

            {/* Scratch-off canvas */}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full ${isScratching ? "cursor-grabbing" : "cursor-grab"}`}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={(e) => isScratching && scratch(e)}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                onTouchMove={scratch}
                style={{ touchAction: "none" }}
            />

            {/* Progress indicator */}
            {!isRevealed && scratchPercentage > 10 && (
                <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-[#FE6334] z-10">
                    {Math.floor(scratchPercentage)}%
                </div>
            )}
        </div>
    );
};

export default ScratchCard;