"use client";

import { useCallback, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFounderStore } from "@/store/use-founder-store";
import { buildWorkspaceContext } from "@/lib/ai/build-context";
import { executeFounderActions } from "@/lib/ai/execute-actions";
import type { ActionResult, ChatMessage } from "@/lib/ai/types";

interface AiAssistantProps {
  variant?: "panel" | "page";
  onClose?: () => void;
}

export function AiAssistant({ variant = "page", onClose }: AiAssistantProps) {
  const brandCount = useFounderStore((s) => s.brands.length);
  const taskCount = useFounderStore((s) => s.tasks.length);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResults, setLastResults] = useState<ActionResult[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);
    setLastResults([]);

    const state = useFounderStore.getState();
    const context = buildWorkspaceContext({
      brands: state.brands,
      tasks: state.tasks,
      goals: state.goals,
      ideas: state.ideas,
      kpis: state.kpis,
      reminders: state.reminders,
      playbooks: state.playbooks,
      weeklyReviews: state.weeklyReviews,
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          context,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Request failed");
      }

      const results =
        data.actions?.length > 0
          ? executeFounderActions(data.actions)
          : [];

      setLastResults(results);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "Done.",
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [input, loading, messages]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    }
  }

  const isPage = variant === "page";

  return (
    <div
      className={cn(
        "flex flex-col bg-zinc-950",
        isPage ? "h-[calc(100vh-8rem)] min-h-[480px]" : "h-full"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between border-b border-zinc-800 px-4 py-3 shrink-0",
          !isPage && "bg-zinc-900/80"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20">
            <Bot className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-100">AI Assistant</p>
            <p className="text-[10px] text-zinc-500">
              Paste anything — tasks, goals, notes
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-6 text-center">
            <Sparkles className="h-8 w-8 text-emerald-500/60 mx-auto mb-3" />
            <p className="text-sm text-zinc-300 font-medium">
              Run FounderOS from chat
            </p>
            <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Paste a brain dump, meeting notes, or say things like &quot;add
              brand Acme, create 5 tasks for launch week, goal $50k MRR&quot;.
              I&apos;ll create brands, tasks, goals, ideas, KPIs, reminders, and
              more.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {[
                "Create brand Vision AV and 3 launch tasks",
                "Weekly goal: hit 10 sales calls",
                "Remind me Friday to review finances",
              ].map((hint) => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => setInput(hint)}
                  className="text-[11px] rounded-full border border-zinc-700 px-3 py-1.5 text-zinc-400 hover:border-emerald-500/40 hover:text-zinc-200 transition-colors"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap",
                msg.role === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800/80 text-zinc-200 border border-zinc-700/50"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Thinking…
          </div>
        )}

        {lastResults.length > 0 && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 space-y-1.5">
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">
              Actions applied
            </p>
            {lastResults.map((r, i) => (
              <p
                key={i}
                className={cn(
                  "text-xs",
                  r.success ? "text-emerald-400/90" : "text-red-400/90"
                )}
              >
                {r.success ? "✓" : "✗"} {r.message}
              </p>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="px-4 pb-2 text-xs text-red-400">{error}</p>
      )}

      <div className="shrink-0 border-t border-zinc-800 p-4 space-y-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste notes, tasks, goals, or tell me what to do…"
          rows={isPage ? 5 : 3}
          className="resize-none text-sm"
          disabled={loading}
        />
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] text-zinc-600">
            ⌘↵ to send · {brandCount} brands · {taskCount} tasks
          </p>
          <Button onClick={send} disabled={loading || !input.trim()} className="gap-2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
