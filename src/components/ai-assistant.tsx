"use client";

import { useCallback, useRef, useState } from "react";
import { Bot, Loader2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFounderStore } from "@/store/use-founder-store";
import { buildWorkspaceContext } from "@/lib/ai/build-context";
import { executeFounderActions } from "@/lib/ai/execute-actions";
import { hasDestructiveActions } from "@/lib/ai/destructive-actions";
import { AiConfirmDialog } from "@/components/ai-confirm-dialog";
import type { ActionResult, ChatMessage, FounderAction } from "@/lib/ai/types";

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
  const [pendingActions, setPendingActions] = useState<FounderAction[] | null>(
    null
  );
  const [pendingReply, setPendingReply] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const applyActions = useCallback(
    (actions: FounderAction[], replyText: string) => {
      const results =
        actions.length > 0 ? executeFounderActions(actions) : [];
      setLastResults(results);
      const executed = results.filter((r) => r.success).length;
      const noActionsButClaimsWork =
        actions.length === 0 &&
        /\b(deleted|transferred|merged|created|updated|completed|moved)\b/i.test(
          replyText
        );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: noActionsButClaimsWork
            ? `${replyText}\n\n⚠️ No actions were executed. Try again with explicit commands.`
            : executed > 0
              ? `${replyText}\n\n✓ ${executed} action${executed === 1 ? "" : "s"} applied.`
              : replyText,
        },
      ]);
    },
    []
  );

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

      const actions = Array.isArray(data.actions) ? data.actions : [];
      const replyText = data.reply ?? "Done.";

      if (hasDestructiveActions(actions)) {
        setPendingActions(actions);
        setPendingReply(replyText);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `${replyText}\n\n⚠️ Confirm destructive actions before applying.`,
          },
        ]);
        return;
      }

      applyActions(actions, replyText);
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
  }, [input, loading, messages, applyActions]);

  function confirmPending() {
    if (!pendingActions) return;
    applyActions(pendingActions, pendingReply);
    setPendingActions(null);
    setPendingReply("");
  }

  function cancelPending() {
    setPendingActions(null);
    setPendingReply("");
  }

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
        "flex flex-col bg-transparent",
        isPage ? "h-[calc(100vh-8rem)] min-h-[480px]" : "h-full"
      )}
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.06] px-4">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-emerald-400/80" />
          <p className="text-sm font-medium tracking-tight text-zinc-200">AI</p>
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
          <div className="rounded-2xl border border-dashed border-white/[0.08] p-8 text-center">
            <p className="text-sm font-medium tracking-tight text-zinc-300">
              Command your workspace
            </p>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-zinc-500">
              Paste tasks, merge brands, set goals — changes apply instantly.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {[
                "Add 3 tasks for this week",
                "Merge duplicate brands",
                "Set a monthly revenue goal",
              ].map((hint) => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => setInput(hint)}
                  className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[11px] text-zinc-500 transition-colors hover:border-emerald-500/25 hover:text-zinc-300"
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
                  ? "bg-emerald-600/90 text-white"
                  : "border border-white/[0.06] bg-white/[0.03] text-zinc-300"
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
          <div className="space-y-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
              Applied
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

      <div className="shrink-0 space-y-2 border-t border-white/[0.06] p-4">
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

      <AiConfirmDialog
        open={pendingActions !== null}
        actions={pendingActions ?? []}
        onConfirm={confirmPending}
        onCancel={cancelPending}
      />
    </div>
  );
}
