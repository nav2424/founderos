"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  CheckSquare,
  ClipboardList,
  LayoutDashboard,
  Lightbulb,
  Settings,
  Target,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r border-zinc-800/80 bg-zinc-950/80">
      <div className="flex items-center gap-2 border-b border-zinc-800/80 px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-100">FounderOS</p>
          <p className="text-[10px] text-zinc-500">Command Center</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-800/80 p-3">
        <p className="px-3 text-[10px] text-zinc-600">
          ⌘K quick capture · ⌘⇧D dashboard
        </p>
      </div>
    </aside>
  );
}
