"use client";

import { Menu, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopNavProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  onQuickCapture?: () => void;
}

export function TopNav({
  title,
  subtitle,
  onMenuClick,
  onQuickCapture,
}: TopNavProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-zinc-800/80 bg-zinc-950/50 px-4 py-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">{title}</h1>
          {subtitle && (
            <p className="text-xs text-zinc-500">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search... (coming soon)"
            className="w-48 pl-9 md:w-64"
            disabled
          />
        </div>
        <Button size="sm" onClick={onQuickCapture} className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Capture</span>
          <kbd className="hidden rounded bg-emerald-700/50 px-1.5 text-[10px] md:inline">
            ⌘K
          </kbd>
        </Button>
      </div>
    </header>
  );
}
