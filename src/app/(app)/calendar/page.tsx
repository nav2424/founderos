"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { CalendarGrid, DayAgenda } from "@/components/calendar/calendar-grid";
import { EventDialog } from "@/components/calendar/event-dialog";
import { EventDetail } from "@/components/calendar/event-detail";
import { useFounderStore } from "@/store/use-founder-store";
import {
  buildCalendarItems,
  itemsInMonth,
  type CalendarItem,
} from "@/lib/calendar";
import type { Reminder } from "@/lib/types";
import { cn } from "@/lib/utils";
import { isSameDay, startOfMonth } from "date-fns";

export default function CalendarPage() {
  const brands = useFounderStore((s) => s.brands);
  const reminders = useFounderStore((s) => s.reminders);
  const tasks = useFounderStore((s) => s.tasks);

  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
  const [showTasks, setShowTasks] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Reminder | null>(null);
  const [dialogDate, setDialogDate] = useState<Date | null>(null);

  const allItems = useMemo(
    () =>
      buildCalendarItems(reminders, tasks, {
        includeTasks: showTasks,
      }),
    [reminders, tasks, showTasks]
  );

  const monthItems = useMemo(
    () => itemsInMonth(allItems, month),
    [allItems, month]
  );

  function openCreate(day?: Date) {
    setEditing(null);
    setDialogDate(day ?? selectedDay);
    setDialogOpen(true);
  }

  function openEdit(reminder: Reminder) {
    setEditing(reminder);
    setDialogDate(null);
    setDialogOpen(true);
  }

  function handleSelectItem(item: CalendarItem) {
    setSelectedItem(item);
    if (!isSameDay(item.start, selectedDay)) {
      setSelectedDay(item.start);
    }
    if (item.source === "event" && item.reminderId) {
      const r = reminders.find((x) => x.id === item.reminderId);
      if (r) setSelectedItem(item);
    }
  }

  return (
    <AppShell title="Calendar" subtitle="Meetings, calls, deadlines & tasks">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <label className="flex items-center gap-2 text-sm text-zinc-500 cursor-pointer">
          <input
            type="checkbox"
            checked={showTasks}
            onChange={(e) => setShowTasks(e.target.checked)}
            className="rounded border-white/20"
          />
          Show task due dates
        </label>
        <Button onClick={() => openCreate()} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Add event
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4 min-w-0">
          <CalendarGrid
            month={month}
            selectedDay={selectedDay}
            items={monthItems}
            onMonthChange={setMonth}
            onSelectDay={(day) => {
              setSelectedDay(day);
              setSelectedItem(null);
            }}
            onSelectItem={handleSelectItem}
            onAddEvent={openCreate}
          />
          <p className="text-[11px] text-zinc-600 text-center">
            Click a day to view · double-click to add · meetings support Zoom/Meet links
          </p>
        </div>

        <div className="space-y-4">
          <DayAgenda
            day={selectedDay}
            items={allItems}
            brands={brands}
            onSelectItem={handleSelectItem}
            onAddEvent={() => openCreate(selectedDay)}
          />
          <EventDetail
            item={selectedItem}
            brands={brands}
            reminders={reminders}
            onEdit={openEdit}
            onClose={() => setSelectedItem(null)}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            ["meeting", "Meetings"],
            ["call", "Calls"],
            ["reminder", "Reminders"],
            ["deadline", "Deadlines"],
            ["task", "Tasks"],
          ] as const
        ).map(([key, label]) => (
          <span
            key={key}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px]",
              key === "meeting" && "border-violet-500/20 text-violet-400",
              key === "call" && "border-sky-500/20 text-sky-400",
              key === "reminder" && "border-white/10 text-zinc-500",
              key === "deadline" && "border-amber-500/20 text-amber-400",
              key === "task" && "border-emerald-500/20 text-emerald-400"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                key === "meeting" && "bg-violet-400",
                key === "call" && "bg-sky-400",
                key === "reminder" && "bg-zinc-400",
                key === "deadline" && "bg-amber-400",
                key === "task" && "bg-emerald-400"
              )}
            />
            {label}
          </span>
        ))}
      </div>

      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        brands={brands}
        initialDate={dialogDate}
        editing={editing}
      />
    </AppShell>
  );
}
