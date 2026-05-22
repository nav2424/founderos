"use client";

import { AppShell } from "@/components/layout/app-shell";
import { FounderMemoryPanel } from "@/components/founder-memory-panel";

export default function MemoryPage() {
  return (
    <AppShell
      title="Memory"
      subtitle="Second brain — decisions, SOPs, vendors, notes"
    >
      <FounderMemoryPanel />
    </AppShell>
  );
}
