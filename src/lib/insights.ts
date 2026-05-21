import type { Brand, Goal, Task } from "./types";
import { daysUntilDeadline, formatGoalValue, isMrrGoal } from "./goals";
import { goalProgress } from "./utils";

export interface Insight {
  id: string;
  tone: "info" | "warning" | "success";
  title: string;
  body: string;
  suggestedTasks?: string[];
}

export function buildWeeklyInsights(
  brands: Brand[],
  goals: Goal[],
  tasks: Task[]
): Insight[] {
  const insights: Insight[] = [];
  const activeGoals = goals.filter((g) => g.status === "active");

  for (const brand of brands) {
    const brandGoals = activeGoals.filter((g) => g.brand_id === brand.id);
    const mrrGoal = brandGoals.find(isMrrGoal);
    if (mrrGoal) {
      const pct = goalProgress(mrrGoal.current_value, mrrGoal.target_value);
      const days = daysUntilDeadline(mrrGoal.deadline);
      if (days !== null && days > 0) {
        insights.push({
          id: `mrr-${brand.id}`,
          tone: pct >= 80 ? "success" : days < 30 ? "warning" : "info",
          title: `${brand.name}: ${pct}% to MRR target`,
          body: `${formatGoalValue(mrrGoal.current_value, mrrGoal.target_metric)} → ${formatGoalValue(mrrGoal.target_value, mrrGoal.target_metric)} · ${days} days left`,
          suggestedTasks:
            pct < 50
              ? [
                  `Review ${brand.name} pipeline for revenue leaks`,
                  `Schedule 3 outreach calls for ${brand.name}`,
                  `Update ${brand.name} offer or pricing test`,
                ]
              : undefined,
        });
      }
    }
  }

  const overdue = tasks.filter((t) => t.status !== "Done" && t.due_date);
  const overdueCount = overdue.filter((t) => {
    const d = daysUntilDeadline(t.due_date);
    return d !== null && d < 0;
  }).length;
  if (overdueCount > 0) {
    insights.push({
      id: "overdue-tasks",
      tone: "warning",
      title: `${overdueCount} overdue task${overdueCount > 1 ? "s" : ""}`,
      body: "Clear or reschedule these before adding new work.",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "all-clear",
      tone: "success",
      title: "You're on track",
      body: "No urgent alerts. Use focus mode to pick today's top 3.",
    });
  }

  return insights;
}
