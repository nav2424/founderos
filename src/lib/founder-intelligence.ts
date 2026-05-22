import type { Brand, Goal, Reminder, Task } from "./types";
import { buildWeeklyInsights } from "./insights";
import { daysUntilDeadline, isMrrGoal } from "./goals";
import { goalProgress, isOverdue, priorityScore } from "./utils";
import { parseISO, isFuture } from "date-fns";

export interface OperatingSnapshot {
  bottlenecks: { title: string; body: string; tone: string }[];
  focus_tasks: { title: string; brand: string | null; score: number }[];
  overdue_count: number;
  active_goal_count: number;
  brands_summary: { name: string; mrr: number; stage: string; primary_goal_pct: number | null }[];
  upcoming_meetings: { title: string; when: string; brand: string | null }[];
}

export function buildOperatingSnapshot(
  brands: Brand[],
  tasks: Task[],
  goals: Goal[],
  reminders: Reminder[]
): OperatingSnapshot {
  const insights = buildWeeklyInsights(brands, goals, tasks);
  const bottlenecks = insights
    .filter((i) => i.id !== "all-clear")
    .map((i) => ({ title: i.title, body: i.body, tone: i.tone }));

  const focus_tasks = tasks
    .filter((t) => t.focus_today && t.status !== "Done")
    .map((t) => ({
      title: t.title,
      brand: brands.find((b) => b.id === t.brand_id)?.name ?? null,
      score: priorityScore(t.estimated_impact, t.effort_level),
    }))
    .sort((a, b) => b.score - a.score);

  const overdue_count = tasks.filter(
    (t) => t.status !== "Done" && isOverdue(t.due_date)
  ).length;

  const brands_summary = brands.map((b) => {
    const active = goals.filter(
      (g) => g.brand_id === b.id && g.status === "active"
    );
    const mrrGoal = active.find(isMrrGoal) ?? active[0];
    return {
      name: b.name,
      mrr: b.monthly_revenue,
      stage: b.stage,
      primary_goal_pct: mrrGoal
        ? goalProgress(mrrGoal.current_value, mrrGoal.target_value)
        : null,
    };
  });

  const upcoming_meetings = reminders
    .filter((r) => !r.completed)
    .filter((r) => {
      try {
        return isFuture(parseISO(r.due_date));
      } catch {
        return true;
      }
    })
    .slice(0, 5)
    .map((r) => ({
      title: r.title,
      when: r.due_date,
      brand: brands.find((b) => b.id === r.brand_id)?.name ?? null,
    }));

  const goals_at_risk = goals.filter((g) => {
    if (g.status !== "active" || !g.deadline) return false;
    const d = daysUntilDeadline(g.deadline);
    return d !== null && d <= 14;
  });

  if (goals_at_risk.length > 0 && bottlenecks.length < 4) {
    bottlenecks.push({
      title: `${goals_at_risk.length} goal(s) due within 14 days`,
      body: goals_at_risk.map((g) => g.title).join("; "),
      tone: "warning",
    });
  }

  return {
    bottlenecks,
    focus_tasks,
    overdue_count,
    active_goal_count: goals.filter((g) => g.status === "active").length,
    brands_summary,
    upcoming_meetings,
  };
}
