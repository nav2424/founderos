import type { Goal, GoalType } from "./types";

export const LONG_TERM_TYPES: GoalType[] = ["Yearly", "Quarterly"];
export const SHORT_TERM_TYPES: GoalType[] = ["Monthly", "Weekly"];

export function isLongTermGoal(type: GoalType): boolean {
  return LONG_TERM_TYPES.includes(type);
}

export function goalHorizon(type: GoalType): "long_term" | "short_term" {
  return isLongTermGoal(type) ? "long_term" : "short_term";
}

export function goalHorizonLabel(type: GoalType): string {
  return isLongTermGoal(type) ? "Long-term" : "Short-term";
}

export function isMrrGoal(goal: Goal): boolean {
  const m = goal.target_metric?.toLowerCase() ?? "";
  return m === "mrr" || m === "monthly revenue" || m === "revenue";
}

export function formatGoalValue(value: number, metric: string | null): string {
  if (!metric) return value.toLocaleString();
  const m = metric.toLowerCase();
  if (m === "mrr" || m === "revenue" || m === "profit") {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
    return `$${value.toLocaleString()}`;
  }
  return `${value.toLocaleString()} ${metric}`;
}

export function daysUntilDeadline(deadline: string | null): number | null {
  if (!deadline) return null;
  try {
    const end = new Date(deadline);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return Math.ceil((end.getTime() - now.getTime()) / 86400000);
  } catch {
    return null;
  }
}
