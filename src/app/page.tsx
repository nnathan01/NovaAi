"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NovaCore from "@/components/nova/NovaCore";

export default function LandingPage() {
  const [start, setStart] = useState(false);
  const router = useRouter();

  // ✅ FIX HYDRATION
  useEffect(() => {
    if (start) {
      router.push("/chat");
    }
  }, [start, router]);

  return (
    <main className="relative min-h-screen bg-[#0b0b0c] text-white flex flex-col overflow-hidden">

      {/* BACKGROUND GLOW (NEW - bikin hidup, tidak hapus UI lama) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* NAVBAR */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <NovaCore size={36} state="idle" />
          <span className="font-semibold tracking-tight">Nova</span>
        </div>
      </div>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 z-10">

        <div className="relative">
          <NovaCore size={80} state="thinking" />
          {/* glow ring tambahan */}
          <div className="absolute inset-0 rounded-full border border-white/10 animate-ping" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-6">
          Nova
        </h1>

        <p className="text-gray-400 mt-4 text-lg md:text-xl max-w-2xl">
          An AI Thinking System that transforms messy thoughts into structured clarity.
        </p>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setStart(true)}
            className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:opacity-90 transition"
          >
            Start Thinking
          </button>

          <a
            href="#how"
            className="px-6 py-3 border border-gray-700 rounded-xl text-gray-300 hover:border-white transition"
          >
            How it works
          </a>
        </div>

      </section>

      {/* PROBLEM */}
      <section className="px-6 py-20 border-t border-gray-800 z-10">

        <h2 className="text-2xl md:text-3xl font-semibold text-center">
          Thinking is broken.
        </h2>

        <p className="text-gray-400 text-center mt-4 max-w-2xl mx-auto">
          People don’t struggle because they lack information —
          they struggle because their thoughts are unstructured.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">

          {[
            "Overwhelmed thoughts",
            "No clear direction",
            "Decision fatigue",
          ].map((text, i) => (
            <div
              key={i}
              className="p-6 bg-gray-900 rounded-2xl border border-gray-800 hover:border-white/20 transition"
            >
              <p className="text-sm text-gray-400">Problem</p>
              <h3 className="font-semibold mt-2">{text}</h3>
            </div>
          ))}

        </div>

      </section>

      {/* SOLUTION */}
      <section id="how" className="px-6 py-20 border-t border-gray-800 z-10">

        <h2 className="text-2xl md:text-3xl font-semibold text-center">
          Meet Nova — Your AI Thinking System
        </h2>

        <p className="text-gray-400 text-center mt-4 max-w-2xl mx-auto">
          Nova doesn’t just answer questions. It helps you think.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-5xl mx-auto">

          {["CLARITY", "STRATEGY", "REFLECTION", "ACTION"].map((mode) => (
            <div
              key={mode}
              className="p-6 bg-gray-900 rounded-2xl border border-gray-800 flex items-start gap-4 hover:border-white/20 transition"
            >
              <NovaCore size={32} mode={mode} />

              <div>
                <h3 className="font-semibold">{mode} MODE</h3>
                <p className="text-gray-400 mt-2 text-sm">
                  {mode === "CLARITY" && "Turns chaotic thoughts into structured understanding."}
                  {mode === "STRATEGY" && "Converts ideas into clear actionable plans."}
                  {mode === "REFLECTION" && "Helps you understand your emotions."}
                  {mode === "ACTION" && "Turns thoughts into execution steps."}
                </p>
              </div>
            </div>
          ))}

        </div>

      </section>

      {/* CTA */}
      <section className="px-6 py-20 border-t border-gray-800 text-center z-10">

        <h2 className="text-2xl md:text-3xl font-semibold">
          Think better. Decide faster.
        </h2>

        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          Nova acts as a cognitive layer between your thoughts and your decisions.
        </p>

        <button
          onClick={() => setStart(true)}
          className="mt-8 px-6 py-3 bg-white text-black rounded-xl font-medium hover:opacity-90 transition"
        >
          Try Nova
        </button>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 py-10 text-center text-gray-500 text-sm z-10">
        Nova © {new Date().getFullYear()}
      </footer>

    </main>
  );
}