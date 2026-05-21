"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useFounderStore } from "@/store/use-founder-store";
import { computeNotifications } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tasks = useFounderStore((s) => s.tasks);
  const goals = useFounderStore((s) => s.goals);
  const reminders = useFounderStore((s) => s.reminders);

  const items = computeNotifications(tasks, goals, reminders);
  const urgent = items.filter((i) => i.urgent).length;

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-8 w-8 text-zinc-500 hover:text-zinc-200"
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
      >
        <Bell className="h-4 w-4" />
        {items.length > 0 && (
          <span
            className={cn(
              "absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-medium",
              urgent > 0
                ? "bg-amber-500/90 text-black"
                : "bg-white/10 text-zinc-300"
            )}
          >
            {items.length > 9 ? "9+" : items.length}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-white/[0.08] bg-[#0a0a0b] shadow-xl">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="text-sm font-medium text-zinc-200">Notifications</p>
            <p className="text-[11px] text-zinc-600">
              Overdue tasks, goal deadlines, reminders
            </p>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-zinc-600">
                All clear
              </p>
            ) : (
              items.slice(0, 12).map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block border-b border-white/[0.04] px-4 py-3 last:border-0 hover:bg-white/[0.03]",
                    n.urgent && "bg-amber-500/[0.04]"
                  )}
                >
                  <p className="text-sm text-zinc-200 line-clamp-1">{n.title}</p>
                  <p className="text-[11px] text-zinc-500">{n.detail}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
