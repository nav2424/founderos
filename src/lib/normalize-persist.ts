import type { Brand, Goal, Reminder, Task } from "./types";
import {
  DEFAULT_BRAND_CONTEXT,
  DEFAULT_REMINDER_EXTRAS,
  DEFAULT_TASK_EXTRAS,
} from "./types";

export function normalizeBrand(b: Brand): Brand {
  return { ...DEFAULT_BRAND_CONTEXT, ...b };
}

export function normalizeTask(t: Task): Task {
  return {
    ...DEFAULT_TASK_EXTRAS,
    ...t,
    recurrence: t.recurrence ?? "none",
    focus_today: t.focus_today ?? false,
    goal_id: t.goal_id ?? null,
  };
}

export function normalizeGoal(g: Goal): Goal {
  return { ...g, parent_goal_id: g.parent_goal_id ?? null };
}

export function normalizeReminder(r: Reminder): Reminder {
  return {
    ...DEFAULT_REMINDER_EXTRAS,
    ...r,
    event_type: r.event_type ?? "reminder",
    end_date: r.end_date ?? null,
    meeting_url: r.meeting_url ?? null,
    location: r.location ?? null,
  };
}
