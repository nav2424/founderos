"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { QuickCapture } from "@/components/quick-capture";
import { useSupabaseSync } from "@/hooks/use-supabase-sync";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const router = useRouter();

  useSupabaseSync();

  useKeyboardShortcuts({
    onQuickCapture: () => setCaptureOpen(true),
    onGoDashboard: () => router.push("/dashboard"),
    onGoTasks: () => router.push("/tasks"),
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
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          onQuickCapture={() => setCaptureOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
      <QuickCapture open={captureOpen} onOpenChange={setCaptureOpen} />
    </div>
  );
}
