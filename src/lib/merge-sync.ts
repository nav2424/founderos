import type {
  Brand,
  Goal,
  Idea,
  Kpi,
  Playbook,
  Reminder,
  Task,
  WeeklyReview,
} from "./types";
import {
  normalizeBrand,
  normalizeGoal,
  normalizeReminder,
  normalizeTask,
} from "./normalize-persist";
import { mergeById } from "./reminder-sync";

export function mergeRemoteWorkspace(
  local: {
    brands: Brand[];
    tasks: Task[];
    goals: Goal[];
    ideas: Idea[];
    kpis: Kpi[];
    reminders: Reminder[];
    playbooks: Playbook[];
    weeklyReviews: WeeklyReview[];
  },
  remote: Partial<typeof local>
) {
  return {
    brands: mergeById(local.brands, remote.brands ?? [], normalizeBrand),
    tasks: mergeById(local.tasks, remote.tasks ?? [], normalizeTask),
    goals: mergeById(local.goals, remote.goals ?? [], normalizeGoal),
    ideas: mergeById(
      local.ideas,
      remote.ideas ?? [],
      (i) => i
    ),
    kpis: mergeById(local.kpis, remote.kpis ?? [], (k) => k),
    reminders: mergeById(
      local.reminders,
      remote.reminders ?? [],
      normalizeReminder
    ),
    playbooks: mergeById(local.playbooks, remote.playbooks ?? [], (p) => p),
    weeklyReviews: mergeById(
      local.weeklyReviews,
      remote.weeklyReviews ?? [],
      (w) => w
    ),
  };
}
