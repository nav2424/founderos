import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ASSISTANT_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { parseAssistantResponse } from "@/lib/ai/parse-response";
import type { ChatMessage, WorkspaceContext } from "@/lib/ai/types";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY is not set. Add it to .env.local and Netlify environment variables.",
      },
      { status: 503 }
    );
  }

  let body: {
    messages?: ChatMessage[];
    context?: WorkspaceContext;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const messages = body.messages ?? [];
  const context = body.context;

  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];
  const contextBlock = context
    ? `\n\nCurrent workspace (JSON):\n${JSON.stringify(context)}`
    : "";

  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: ASSISTANT_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Today is ${today}.${contextBlock}`,
        },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = parseAssistantResponse(content);

    return NextResponse.json(parsed);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "OpenAI request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
