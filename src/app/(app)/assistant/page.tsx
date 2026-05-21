"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AiAssistant } from "@/components/ai-assistant";

export default function AssistantPage() {
  return (
    <AppShell
      title="AI Assistant"
      subtitle="Paste anything — I'll structure it into your OS"
    >
      <div className="rounded-xl border border-zinc-800 overflow-hidden -mx-0">
        <AiAssistant variant="page" />
      </div>
    </AppShell>
  );
}
