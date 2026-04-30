"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import NovaCore from "@/components/nova/NovaCore";

export default function ChatPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isTypingAI, setIsTypingAI] = useState(false);
    const [activeMode, setActiveMode] = useState("STRATEGY");

    const bottomRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // 🔥 MODE COLOR IDENTITY
    const modeColor = {
        CLARITY: "text-cyan-400",
        STRATEGY: "text-yellow-400",
        REFLECTION: "text-purple-400",
        ACTION: "text-green-400",
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 🔥 BULLETPROOF NORMALIZER
    const normalizeAI = (data: any) => {
        let parsed = data;

        if (typeof data === "string") {
            try {
                parsed = JSON.parse(data);
            } catch {
                parsed = {};
            }
        }

        return {
            decision: parsed?.decision || "No clear direction yet.",

            why: Array.isArray(parsed?.why)
                ? parsed.why
                : parsed?.why
                    ? [parsed.why]
                    : [],

            options: Array.isArray(parsed?.options)
                ? parsed.options
                : [],

            next_step: parsed?.next_step || "",
        };
    };

    // 🔥 TYPING EFFECT
    const typeText = async (text: string, callback: (val: string) => void) => {
        let current = "";
        for (let i = 0; i < text.length; i++) {
            current += text[i];
            callback(current);
            await new Promise((r) => setTimeout(r, 10));
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);
        setIsTypingAI(true);

        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                body: JSON.stringify({
                    messages: newMessages,
                    mode: activeMode,
                }),
            });

            const data = await res.json();
            const ai = normalizeAI(data);

            const aiMessage = {
                role: "assistant",
                content: {
                    decision: "",
                    why: [],
                    next_step: "",
                },
            };

            setMessages([...newMessages, aiMessage]);

            // ✨ TYPE DECISION
            await typeText(ai.decision, (val) => {
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1].content.decision = val;
                    return updated;
                });
            });

            // ✨ SHOW WHY
            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].content.why = ai.why;
                return updated;
            });

            // ✨ TYPE NEXT STEP
            await typeText(ai.next_step, (val) => {
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1].content.next_step = val;
                    return updated;
                });
            });

        } catch (err) {
            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content: {
                        decision: "Nova encountered an issue.",
                        why: [],
                        next_step: "",
                    },
                },
            ]);
        }

        setLoading(false);
        setIsTypingAI(false);
    };

    return (
        <main className="h-screen bg-[#0b0b0c] text-white flex flex-col">

            {/* HEADER */}
            <div className="p-5 flex justify-between items-center border-b border-white/5 backdrop-blur">

                <div className="flex items-center gap-3">
                    <NovaCore
                        size={40}
                        state={isTypingAI ? "thinking" : "idle"}
                        mode={activeMode}
                    />
                    <div>
                        <h1 className="font-semibold tracking-tight">Nova</h1>
                        <p className="text-xs text-gray-400">
                            AI Thinking System
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => router.push("/")}
                    className="text-sm text-gray-400 hover:text-white transition"
                >
                    Exit
                </button>
            </div>

            {/* MODE SWITCHER */}
            <div className="flex gap-2 px-5 py-3">
                {["CLARITY", "STRATEGY", "REFLECTION", "ACTION"].map((m) => (
                    <button
                        key={m}
                        onClick={() => setActiveMode(m)}
                        className={`px-3 py-1 text-xs rounded-full border transition ${activeMode === m
                            ? "bg-white text-black"
                            : "border-gray-700 text-gray-400"
                            }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            {/* CHAT AREA */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-20">
                        <NovaCore size={60} state="idle" mode={activeMode} />
                        <p className="mt-4 text-sm">
                            Start thinking with Nova
                        </p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i}>

                        {/* USER */}
                        {msg.role === "user" && (
                            <div className="flex justify-end">
                                <div className="bg-white text-black px-4 py-3 rounded-xl max-w-[70%]">
                                    {msg.content}
                                </div>
                            </div>
                        )}

                        {/* AI */}
                        {msg.role === "assistant" && (
                            <div className="flex items-start gap-3">

                                <NovaCore
                                    size={26}
                                    thinking={isTypingAI}
                                    mode={activeMode}
                                />

                                <div className="bg-gray-800 border border-gray-700 p-5 rounded-2xl max-w-[75%] space-y-4">

                                    <div className={`text-lg font-semibold leading-relaxed ${modeColor[activeMode as keyof typeof modeColor]}`}>
                                        {msg.content.decision}
                                    </div>

                                    {/* WHY */}
                                    {Array.isArray(msg.content.why) && msg.content.why.length > 0 && (
                                        <div className="text-sm text-gray-300 space-y-1">
                                            {msg.content.why.map((w: string, idx: number) => (
                                                <div key={idx}>• {w}</div>
                                            ))}
                                        </div>
                                    )}

                                    {/* NEXT STEP */}
                                    {msg.content.next_step && (
                                        <div className="text-sm text-blue-400">
                                            → {msg.content.next_step}
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}

                    </div>
                ))}

                {loading && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <NovaCore size={18} thinking={true} mode={activeMode} />
                        Nova is thinking...
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div className="border-t border-gray-800 p-4 flex gap-2">
                <input
                    className="flex-1 p-3 rounded-xl bg-gray-900 focus:outline-none"
                    placeholder="Enter your thoughts..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />

                <button
                    onClick={sendMessage}
                    className="px-5 rounded-xl bg-white text-black font-medium hover:opacity-90"
                >
                    Send
                </button>
            </div>

        </main>
    );
}