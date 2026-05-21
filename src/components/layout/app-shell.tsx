"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { AiAssistant } from "@/components/ai-assistant";
import { useSupabaseSync } from "@/hooks/use-supabase-sync";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const hideAssistantFab = pathname === "/assistant";

  useSupabaseSync();

  useKeyboardShortcuts({
    onOpenAssistant: () => setAssistantOpen(true),
    onGoDashboard: () => router.push("/today"),
    onGoTasks: () => router.push("/tasks"),
  });

  return (
    <div className="app-canvas flex h-screen overflow-hidden">
      <div className="hidden md:flex md:shrink-0">
        <Sidebar />
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 h-full w-48">
            <Sidebar
              expanded
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopNav
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          onOpenAssistant={() => setAssistantOpen(true)}
        />
        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-6">
          {children}
        </main>
      </div>

      {assistantOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setAssistantOpen(false)}
          />
          <div
            className={cn(
              "glass glass-border fixed z-50 flex flex-col shadow-2xl shadow-black/50",
              "inset-x-0 bottom-0 top-14 border-t md:inset-auto md:top-0 md:right-0 md:bottom-0 md:w-[400px] md:border-l md:border-t-0"
            )}
          >
            <AiAssistant
              variant="panel"
              onClose={() => setAssistantOpen(false)}
            />
          </div>
        </>
      )}

      <Link
        href="/assistant"
        className={cn(
          "fixed bottom-6 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full",
          "glass glass-border border text-zinc-300",
          "hover:text-emerald-400 hover:border-emerald-500/20 hover:shadow-[0_0_24px_-4px_rgba(16,185,129,0.35)]",
          "transition-all duration-300",
          (assistantOpen || hideAssistantFab) && "pointer-events-none opacity-0"
        )}
        aria-label="Open AI"
        title="AI (⌘⇧A)"
      >
        <Sparkles className="h-4 w-4" />
      </Link>
    </div>
  );
}
