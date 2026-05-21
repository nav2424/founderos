"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bot } from "lucide-react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { QuickCapture } from "@/components/quick-capture";
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
  const [captureOpen, setCaptureOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const hideAssistantFab = pathname === "/assistant";

  useSupabaseSync();

  useKeyboardShortcuts({
    onQuickCapture: () => setCaptureOpen(true),
    onGoDashboard: () => router.push("/dashboard"),
    onGoTasks: () => router.push("/tasks"),
    onOpenAssistant: () => setAssistantOpen(true),
  });

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <div className="hidden md:flex md:shrink-0">
        <Sidebar />
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 h-full w-56">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopNav
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          onQuickCapture={() => setCaptureOpen(true)}
          onOpenAssistant={() => setAssistantOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      {assistantOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:bg-black/30"
            onClick={() => setAssistantOpen(false)}
          />
          <div
            className={cn(
              "fixed z-50 flex flex-col bg-zinc-950 border-zinc-800 shadow-2xl",
              "inset-x-0 bottom-0 top-16 border-t md:inset-auto md:top-0 md:right-0 md:bottom-0 md:w-[420px] md:border-l md:border-t-0"
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
          "fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full",
          "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40",
          "hover:bg-emerald-500 transition-colors md:bottom-6 md:right-6",
          (assistantOpen || hideAssistantFab) && "hidden"
        )}
        aria-label="Open AI Assistant"
        title="AI Assistant (⌘⇧A)"
      >
        <Bot className="h-5 w-5" />
      </Link>

      <QuickCapture open={captureOpen} onOpenChange={setCaptureOpen} />
    </div>
  );
}
