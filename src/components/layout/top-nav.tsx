"use client";

import { Bot, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopNavProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  onOpenAssistant?: () => void;
}

export function TopNav({
  title,
  subtitle,
  onMenuClick,
  onOpenAssistant,
}: TopNavProps) {
  return (
    <header className="glass glass-border flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0 h-8 w-8 text-zinc-500 hover:text-zinc-200"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-medium tracking-tight text-zinc-100">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-[11px] text-zinc-500 font-mono tabular-nums">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={onOpenAssistant}
        className={cn(
          "h-8 gap-2 rounded-full px-3 text-zinc-400",
          "hover:text-zinc-100 hover:bg-white/[0.04]",
          "border border-transparent hover:border-white/[0.06]"
        )}
      >
        <Bot className="h-3.5 w-3.5" />
        <span className="hidden text-xs font-medium sm:inline">Ask AI</span>
        <kbd className="hidden lg:inline text-[10px] text-zinc-600">⌘⇧A</kbd>
      </Button>
    </header>
  );
}
