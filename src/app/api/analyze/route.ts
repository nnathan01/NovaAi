import { NextResponse } from "next/server";
import axios from "axios";

const MODELS = [
  "openrouter/free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "mistralai/mixtral-8x7b-instruct:free",
];

// ✅ CLEAN TEXT (hilangkan **bold**, dll)
function cleanText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .trim();
}

// ✅ SAFE JSON
function safeJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function tryModel(model: string, messages: any[]) {
  return axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model,
      messages,
      temperature: 0.5,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Nova AI",
      },
      timeout: 7000,
    },
  );
}

export async function POST(req: Request) {
  const { messages, memory, mode } = await req.json();

  const systemPrompt = {
    role: "system",
    content: `
You are Nova — a Decision Intelligence System.

Return ONLY JSON.

FORMAT:

{
  "decision": "",
  "why": [],
  "options": [],
  "next_step": ""
}

RULES:
- No markdown (**, *, _, #)
- No text outside JSON
- Be concise and decisive
`,
  };

  for (const model of MODELS) {
    try {
      console.log("🔄 Trying:", model);

      const response = await tryModel(model, [systemPrompt, ...messages]);

      const raw = response.data?.choices?.[0]?.message?.content || "";

      // 1️⃣ coba parse JSON
      const parsed = safeJSON(raw);

      if (parsed) {
        console.log("✅ JSON OK:", model);
        return NextResponse.json(parsed);
      }

      // 2️⃣ fallback → clean text
      const cleaned = cleanText(raw);

      console.log("⚠️ Fallback text used");

      return NextResponse.json({
        decision: cleaned,
        why: [],
        options: [],
        next_step: "Refine your input",
      });
    } catch (error: any) {
      console.error("❌ Failed:", model);
      continue;
    }
  }

  return NextResponse.json({
    decision: "Nova is overloaded",
    why: [],
    options: [],
    next_step: "Try again later",
  });
}
