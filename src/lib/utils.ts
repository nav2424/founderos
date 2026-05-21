import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isPast, isToday, parseISO, startOfWeek } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function priorityScore(impact: number, effort: number): number {
  if (effort === 0) return impact;
  return Math.round((impact / effort) * 100) / 100;
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  try {
    return format(parseISO(date), "MMM d, yyyy");
  } catch {
    return date;
  }
}

export function formatRelativeDate(date: string | null | undefined): string {
  if (!date) return "—";
  try {
    const d = parseISO(date);
    if (isToday(d)) return "Today";
    return format(d, "MMM d");
  } catch {
    return date;
  }
}

export function isOverdue(date: string | null | undefined): boolean {
  if (!date) return false;
  try {
    const d = parseISO(date);
    return isPast(d) && !isToday(d);
  } catch {
    return false;
  }
}

export function goalProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

export function getWeekStart(date = new Date()): string {
  return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
}

export function generateId(): string {
  return crypto.randomUUID();
}
