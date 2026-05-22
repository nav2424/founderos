"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AiAssistant } from "@/components/ai-assistant";

export default function AssistantPage() {
  return (
    <AppShell
      title="AI Assistant"
      subtitle="Operating system intelligence — memory, execution, outcomes"
    >
      <p className="text-xs text-zinc-600 mb-4 -mt-2">
        Recalls your knowledge library automatically. Paste meeting notes to save
        memory + create tasks.{" "}
        <a href="/memory" className="text-emerald-500/80 hover:text-emerald-400">
          Manage memory →
        </a>
      </p>
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <AiAssistant variant="page" />
      </div>
    </AppShell>
  );
}
