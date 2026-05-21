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

export const EMPTY_FOUNDER_DATA = {
  brands: [] as Brand[],
  tasks: [] as Task[],
  goals: [] as Goal[],
  ideas: [] as Idea[],
  kpis: [] as Kpi[],
  reminders: [] as Reminder[],
  playbooks: [] as Playbook[],
  weeklyReviews: [] as WeeklyReview[],
};
