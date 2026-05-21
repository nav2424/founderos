"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  CheckSquare,
  Bot,
  ClipboardList,
  LayoutDashboard,
  Lightbulb,
  Settings,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot,
  LayoutDashboard,
  Building2,
  CheckSquare,
  Target,
  Calendar,
  Lightbulb,
  BarChart3,
  BookOpen,
  ClipboardList,
  Settings,
};

interface SidebarProps {
  onNavigate?: () => void;
  /** Full labels (mobile drawer). Default: icon rail on desktop. */
  expanded?: boolean;
}

export function Sidebar({ onNavigate, expanded = false }: SidebarProps) {
  const pathname = usePathname();
  const showLabels = expanded;

  return (
    <aside
      className={cn(
        "glass glass-border flex h-full flex-col border-r",
        showLabels ? "w-48" : "w-[52px]"
      )}
    >
      <div className="flex h-14 items-center justify-center border-b border-white/[0.04] px-2">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center min-w-0",
            showLabels ? "gap-2.5 px-1" : "justify-center"
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.06] ring-1 ring-white/[0.08]">
            <span className="text-[10px] font-semibold tracking-tighter text-zinc-300">
              OS
            </span>
          </div>
          {showLabels && (
            <span className="truncate text-sm font-medium tracking-tight text-zinc-200">
              Founder
            </span>
          )}
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const isAi = item.href === "/assistant";
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={item.label}
              className={cn(
                "group relative flex items-center rounded-lg py-2 text-sm transition-all",
                showLabels
                  ? "gap-2.5 px-2.5"
                  : "justify-center px-0",
                active
                  ? "text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300",
                isAi && !active && "text-emerald-500/70 hover:text-emerald-400"
              )}
            >
              {active && showLabels && (
                <span
                  className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-emerald-400"
                  aria-hidden
                />
              )}
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  active && "text-emerald-400/90"
                )}
              />
              {showLabels && (
                <span className="truncate text-[13px]">
                  {item.label === "AI Assistant" ? "AI" : item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      {showLabels && (
        <div className="border-t border-white/[0.04] p-3">
          <p className="font-mono text-[10px] text-zinc-600">
            <kbd className="text-zinc-500">⌘K</kbd> · <kbd className="text-zinc-500">⌘⇧A</kbd>
          </p>
        </div>
      )}
    </aside>
  );
}
