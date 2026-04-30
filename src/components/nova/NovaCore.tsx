"use client";

import { motion } from "framer-motion";

export default function NovaCore({
    size = 40,
    mode = "CLARITY",
    state = "idle",
}: {
    size?: number;
    mode?: string;
    state?: "idle" | "thinking" | "speaking";
}) {
    // 🎨 Mode Colors (identity tiap mode)
    const modeColorMap = {
        CLARITY: "#60a5fa",
        STRATEGY: "#a78bfa",
        REFLECTION: "#34d399",
        ACTION: "#f59e0b",
    } as const;

    const modeColor =
        modeColorMap[mode as keyof typeof modeColorMap] || "#ffffff";

    // ⚡ State Behavior
    const stateAnim = {
        idle: {
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
        },
        thinking: {
            scale: [1, 1.15, 1],
            opacity: [0.7, 1, 0.7],
        },
        speaking: {
            scale: [1, 1.08, 1],
            opacity: [0.9, 1, 0.9],
        },
    };

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {/* 🔵 OUTER ENERGY RING */}
            <motion.div
                animate={{
                    rotate: state === "thinking" ? 360 : 0,
                }}
                transition={{
                    repeat: Infinity,
                    duration: state === "thinking" ? 6 : 12,
                    ease: "linear",
                }}
                className="absolute inset-0 rounded-full border"
                style={{
                    borderColor: `${modeColor}30`,
                }}
            />

            {/* 🌊 PULSE WAVE */}
            <motion.div
                animate={{
                    scale: state === "thinking" ? [1, 1.6, 1] : [1, 1.2, 1],
                    opacity: state === "thinking" ? [0.2, 0, 0.2] : [0.15, 0, 0.15],
                }}
                transition={{
                    repeat: Infinity,
                    duration: state === "thinking" ? 2 : 3,
                }}
                className="absolute inset-0 rounded-full"
                style={{
                    background: `radial-gradient(circle, ${modeColor}33 0%, transparent 70%)`,
                }}
            />

            {/* 🔥 CORE */}
            <motion.div
                animate={stateAnim[state]}
                transition={{
                    repeat: Infinity,
                    duration: state === "thinking" ? 1.2 : 2,
                }}
                className="absolute rounded-full"
                style={{
                    width: size * 0.7,
                    height: size * 0.7,
                    background: `radial-gradient(circle at 30% 30%, white, ${modeColor})`,
                    boxShadow: `
            0 0 20px ${modeColor},
            0 0 40px ${modeColor}55
          `,
                }}
            />

            {/* ✨ INNER GLOW */}
            <div
                className="absolute rounded-full blur-xl"
                style={{
                    width: size * 0.9,
                    height: size * 0.9,
                    background: modeColor,
                    opacity: 0.15,
                }}
            />

            {/* 🧠 THE "N" (IDENTITY) */}
            <motion.div
                animate={{
                    y: state === "thinking" ? [0, -2, 0] : [0, -1, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                }}
                className="relative z-10 font-bold select-none"
                style={{
                    fontSize: size * 0.38,
                    color: "white",
                    textShadow: `0 0 10px ${modeColor}`,
                }}
            >
                N
            </motion.div>
        </div>
    );
}