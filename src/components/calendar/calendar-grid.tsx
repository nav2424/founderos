"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  brandNameForItem,
  EVENT_TYPE_STYLES,
  formatEventTime,
  getMonthGridDays,
  itemsForDay,
  shiftMonth,
  type CalendarItem,
} from "@/lib/calendar";
import type { Brand } from "@/lib/types";
import { format, isSameDay, isSameMonth, isToday } from "date-fns";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
  month: Date;
  selectedDay: Date;
  items: CalendarItem[];
  onMonthChange: (month: Date) => void;
  onSelectDay: (day: Date) => void;
  onSelectItem: (item: CalendarItem) => void;
  onAddEvent: (day: Date) => void;
}

export function CalendarGrid({
  month,
  selectedDay,
  items,
  onMonthChange,
  onSelectDay,
  onSelectItem,
  onAddEvent,
}: CalendarGridProps) {
  const days = getMonthGridDays(month);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onMonthChange(shiftMonth(month, -1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-100">
            {format(month, "MMMM yyyy")}
          </p>
          <button
            type="button"
            onClick={() => {
              const today = new Date();
              onMonthChange(today);
              onSelectDay(today);
            }}
            className="text-[11px] text-emerald-500/80 hover:text-emerald-400"
          >
            Today
          </button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onMonthChange(shiftMonth(month, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 border-b border-white/[0.06]">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[10px] font-medium uppercase tracking-wider text-zinc-600"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayItems = itemsForDay(items, day);
          const inMonth = isSameMonth(day, month);
          const selected = isSameDay(day, selectedDay);
          const today = isToday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDay(day)}
              onDoubleClick={() => onAddEvent(day)}
              className={cn(
                "min-h-[88px] border-b border-r border-white/[0.04] p-1.5 text-left transition-colors",
                "hover:bg-white/[0.03]",
                !inMonth && "bg-black/20",
                selected && "bg-emerald-500/[0.06] ring-1 ring-inset ring-emerald-500/20"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-mono",
                  today && "bg-emerald-500/20 text-emerald-300",
                  !today && inMonth && "text-zinc-400",
                  !inMonth && "text-zinc-700"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayItems.slice(0, 3).map((item) => {
                  const style =
                    EVENT_TYPE_STYLES[item.eventType] ??
                    EVENT_TYPE_STYLES.reminder;
                  return (
                    <div
                      key={item.id}
                      role="presentation"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                      className={cn(
                        "truncate rounded px-1 py-0.5 text-[9px] border",
                        style.chip,
                        item.completed && "opacity-50 line-through"
                      )}
                    >
                      {formatEventTime(item.start.toISOString()) !== "All day" && (
                        <span className="opacity-70 mr-0.5">
                          {formatEventTime(item.start.toISOString())}
                        </span>
                      )}
                      {item.title}
                    </div>
                  );
                })}
                {dayItems.length > 3 && (
                  <p className="text-[9px] text-zinc-600 pl-1">
                    +{dayItems.length - 3} more
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface DayAgendaProps {
  day: Date;
  items: CalendarItem[];
  brands: Brand[];
  onSelectItem: (item: CalendarItem) => void;
  onAddEvent: () => void;
}

export function DayAgenda({
  day,
  items,
  brands,
  onSelectItem,
  onAddEvent,
}: DayAgendaProps) {
  const dayItems = itemsForDay(items, day);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-zinc-100">
            {format(day, "EEEE, MMM d")}
          </p>
          <p className="text-[11px] text-zinc-600">
            {dayItems.length} event{dayItems.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={onAddEvent}>
          Add
        </Button>
      </div>
      {dayItems.length === 0 ? (
        <p className="text-sm text-zinc-600 py-6 text-center">
          Nothing scheduled — double-click a day or tap Add
        </p>
      ) : (
        <ul className="space-y-2">
          {dayItems.map((item) => {
            const style =
              EVENT_TYPE_STYLES[item.eventType] ?? EVENT_TYPE_STYLES.reminder;
            const brand = brandNameForItem(item.brandId, brands);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelectItem(item)}
                  className={cn(
                    "w-full rounded-xl border px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04]",
                    style.chip
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{item.title}</p>
                    <span className="shrink-0 text-[10px] opacity-80">
                      {formatEventTime(item.start.toISOString())}
                    </span>
                  </div>
                  <p className="text-[10px] opacity-70 mt-0.5">
                    {style.label}
                    {brand && ` · ${brand}`}
                    {item.meetingUrl && " · Link"}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
