import type { Brand, Goal, Task } from "./types";
import { daysUntilDeadline, isMrrGoal } from "./goals";
import { goalProgress, isOverdue } from "./utils";

export type BrandHealth = "green" | "yellow" | "red";

export function brandHealth(
  brand: Brand,
  goals: Goal[],
  tasks: Task[]
): BrandHealth {
  const brandGoals = goals.filter(
    (g) => g.brand_id === brand.id && g.status === "active"
  );
  const brandTasks = tasks.filter(
    (t) => t.brand_id === brand.id && t.status !== "Done"
  );
  const overdueTasks = brandTasks.filter((t) => isOverdue(t.due_date)).length;
  const urgentGoals = brandGoals.filter((g) => {
    const d = daysUntilDeadline(g.deadline);
    return d !== null && d <= 7;
  }).length;

  if (overdueTasks >= 3 || urgentGoals >= 2) return "red";
  if (overdueTasks > 0 || urgentGoals > 0) return "yellow";
  return "green";
}

export function primaryGoalProgress(brandId: string, goals: Goal[]): number {
  const active = goals.filter((g) => g.brand_id === brandId && g.status === "active");
  const mrr = active.find(isMrrGoal) ?? active[0];
  if (!mrr || mrr.target_value <= 0) return 0;
  return goalProgress(mrr.current_value, mrr.target_value);
}
