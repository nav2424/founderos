import {
  addDays,
  endOfDay,
  endOfWeek,
  isToday,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns";
import type { Goal, Milestone, Reminder, Task } from "./types";
import { isLongTermGoal } from "./goals";
import { isOverdue } from "./utils";

export function isDueToday(date: string | null): boolean {
  if (!date) return false;
  try {
    return isToday(parseISO(date));
  } catch {
    return false;
  }
}

export function isDueThisWeek(date: string | null): boolean {
  if (!date) return false;
  try {
    const d = parseISO(date);
    const now = new Date();
    return isWithinInterval(d, {
      start: startOfDay(now),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    });
  } catch {
    return false;
  }
}

export function filterTodayTasks(tasks: Task[]) {
  const active = tasks.filter((t) => t.status !== "Done");
  return {
    focus: active.filter((t) => t.focus_today),
    dueToday: active.filter((t) => isDueToday(t.due_date)),
    overdue: active.filter((t) => isOverdue(t.due_date)),
  };
}

export function filterTodayReminders(reminders: Reminder[]) {
  const open = reminders.filter((r) => !r.completed);
  return {
    today: open.filter((r) => isDueToday(r.due_date)),
    overdue: open.filter((r) => {
      try {
        return !isToday(parseISO(r.due_date)) && isOverdue(r.due_date);
      } catch {
        return false;
      }
    }),
  };
}

export function filterWeekGoals(goals: Goal[]) {
  return goals.filter(
    (g) =>
      g.status === "active" &&
      !isLongTermGoal(g.type) &&
      g.deadline &&
      isDueThisWeek(g.deadline)
  );
}

export function upcomingMilestones(milestones: Milestone[], limit = 3) {
  const now = startOfDay(new Date());
  const horizon = endOfDay(addDays(now, 60));
  return milestones
    .filter((m) => m.status === "pending")
    .filter((m) => {
      try {
        const d = parseISO(m.due_date);
        return d >= now && d <= horizon;
      } catch {
        return false;
      }
    })
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, limit);
}
