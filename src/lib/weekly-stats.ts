import { subDays } from "date-fns";
import type { Brand, Goal, MrrEntry, Task } from "./types";
import { isMrrGoal } from "./goals";
import { isOverdue } from "./utils";

export interface WeeklyStats {
  tasksCompleted: number;
  overdueCount: number;
  goalsAtRisk: number;
  mrrDelta: number | null;
  mrrDeltaLabel: string;
}

export function buildWeeklyStats(
  tasks: Task[],
  goals: Goal[],
  mrrEntries: MrrEntry[],
  brands: Brand[]
): WeeklyStats {
  const weekAgo = subDays(new Date(), 7).toISOString();
  const tasksCompleted = tasks.filter(
    (t) => t.status === "Done" && t.completed_at && t.completed_at >= weekAgo
  ).length;
  const overdueCount = tasks.filter(
    (t) => t.status !== "Done" && isOverdue(t.due_date)
  ).length;
  const goalsAtRisk = goals.filter((g) => {
    if (g.status !== "active" || !g.deadline) return false;
    try {
      const d = new Date(g.deadline);
      const days = Math.ceil(
        (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return days <= 14;
    } catch {
      return false;
    }
  }).length;

  let mrrDelta: number | null = null;
  let mrrDeltaLabel = "Log MRR on brand timelines to track weekly change";
  const totalNow = brands.reduce((s, b) => s + b.monthly_revenue, 0);
  if (mrrEntries.length >= 2) {
    const sorted = [...mrrEntries].sort((a, b) =>
      b.recorded_at.localeCompare(a.recorded_at)
    );
    const latest = sorted[0]?.amount ?? totalNow;
    const prior = sorted[1]?.amount ?? latest;
    mrrDelta = latest - prior;
    mrrDeltaLabel = `$${mrrDelta >= 0 ? "+" : ""}${mrrDelta.toLocaleString()} vs prior log`;
  } else if (goals.some(isMrrGoal)) {
    mrrDeltaLabel = `Portfolio MRR $${totalNow.toLocaleString()} — add a second MRR log to see delta`;
  }

  return {
    tasksCompleted,
    overdueCount,
    goalsAtRisk,
    mrrDelta,
    mrrDeltaLabel,
  };
}
