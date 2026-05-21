"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AiAssistant } from "@/components/ai-assistant";

export default function AssistantPage() {
  return (
    <AppShell
      title="AI Assistant"
      subtitle="Paste anything — I'll structure it into your OS"
    >
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <AiAssistant variant="page" />
      </div>
    </AppShell>
  );
}
