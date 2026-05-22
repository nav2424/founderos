import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import type { Brand, Reminder, Task } from "./types";

export type CalendarItemSource = "event" | "task";

export interface CalendarItem {
  id: string;
  source: CalendarItemSource;
  title: string;
  start: Date;
  end: Date | null;
  eventType: string;
  meetingUrl: string | null;
  location: string | null;
  brandId: string | null;
  completed: boolean;
  description: string | null;
  reminderId?: string;
  taskId?: string;
}

export function getMonthGridDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function shiftMonth(month: Date, delta: number): Date {
  return delta >= 0 ? addMonths(month, delta) : subMonths(month, Math.abs(delta));
}

export function parseEventDate(iso: string): Date {
  try {
    const d = parseISO(iso);
    if (!Number.isNaN(d.getTime())) return d;
  } catch {
    /* fall through */
  }
  const fallback = new Date(iso);
  if (!Number.isNaN(fallback.getTime())) return fallback;
  return startOfDay(new Date());
}

export function formatEventTime(iso: string): string {
  try {
    const d = parseISO(iso);
    if (d.getHours() === 0 && d.getMinutes() === 0) return "All day";
    return format(d, "h:mm a");
  } catch {
    return "";
  }
}

export function formatEventRange(start: string, end: string | null): string {
  const s = formatEventTime(start);
  if (!end) return s;
  const e = formatEventTime(end);
  if (s === "All day" && e === "All day") return "All day";
  return `${s} – ${e}`;
}

export function buildCalendarItems(
  reminders: Reminder[],
  tasks: Task[],
  options: { includeTasks: boolean }
): CalendarItem[] {
  const items: CalendarItem[] = [];

  for (const r of reminders) {
    const start = parseEventDate(r.due_date);
    if (Number.isNaN(start.getTime())) continue;
    items.push({
      id: `event-${r.id}`,
      source: "event",
      title: r.title,
      start,
      end: r.end_date ? parseEventDate(r.end_date) : null,
      eventType: r.event_type,
      meetingUrl: r.meeting_url,
      location: r.location,
      brandId: r.brand_id,
      completed: r.completed,
      description: r.description,
      reminderId: r.id,
    });
  }

  if (options.includeTasks) {
    for (const t of tasks) {
      if (!t.due_date || t.status === "Done") continue;
      items.push({
        id: `task-${t.id}`,
        source: "task",
        title: t.title,
        start: parseEventDate(t.due_date),
        end: null,
        eventType: "task",
        meetingUrl: null,
        location: null,
        brandId: t.brand_id,
        completed: false,
        description: t.description,
        taskId: t.id,
      });
    }
  }

  return items.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function itemsForDay(items: CalendarItem[], day: Date): CalendarItem[] {
  return items.filter((item) => isSameDay(item.start, day));
}

export function itemsInMonth(items: CalendarItem[], month: Date): CalendarItem[] {
  return items.filter((item) => isSameMonth(item.start, month));
}

export const EVENT_TYPE_STYLES: Record<
  string,
  { dot: string; chip: string; label: string }
> = {
  meeting: {
    dot: "bg-violet-400",
    chip: "bg-violet-500/15 text-violet-300 border-violet-500/20",
    label: "Meeting",
  },
  call: {
    dot: "bg-sky-400",
    chip: "bg-sky-500/15 text-sky-300 border-sky-500/20",
    label: "Call",
  },
  reminder: {
    dot: "bg-zinc-400",
    chip: "bg-white/[0.06] text-zinc-300 border-white/[0.08]",
    label: "Reminder",
  },
  deadline: {
    dot: "bg-amber-400",
    chip: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    label: "Deadline",
  },
  task: {
    dot: "bg-emerald-400",
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    label: "Task",
  },
};

export function brandNameForItem(
  brandId: string | null,
  brands: Brand[]
): string | null {
  if (!brandId) return null;
  return brands.find((b) => b.id === brandId)?.name ?? null;
}

export function isValidMeetingUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
