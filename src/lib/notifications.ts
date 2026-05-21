import type { Goal, Reminder, Task } from "./types";
import { daysUntilDeadline } from "./goals";
import { isOverdue } from "./utils";

export interface AppNotification {
  id: string;
  type: "task_overdue" | "goal_deadline" | "reminder" | "milestone";
  title: string;
  detail: string;
  href: string;
  urgent: boolean;
}

export function computeNotifications(
  tasks: Task[],
  goals: Goal[],
  reminders: Reminder[]
): AppNotification[] {
  const items: AppNotification[] = [];

  tasks
    .filter((t) => t.status !== "Done" && isOverdue(t.due_date))
    .forEach((t) => {
      items.push({
        id: `task-${t.id}`,
        type: "task_overdue",
        title: t.title,
        detail: "Overdue task",
        href: "/tasks",
        urgent: true,
      });
    });

  goals
    .filter((g) => g.status === "active" && g.deadline)
    .forEach((g) => {
      const days = daysUntilDeadline(g.deadline);
      if (days !== null && days <= 7) {
        items.push({
          id: `goal-${g.id}`,
          type: "goal_deadline",
          title: g.title,
          detail: days < 0 ? "Goal overdue" : days === 0 ? "Due today" : `${days}d left`,
          href: "/goals",
          urgent: days <= 3,
        });
      }
    });

  reminders
    .filter((r) => !r.completed && isOverdue(r.due_date))
    .forEach((r) => {
      items.push({
        id: `rem-${r.id}`,
        type: "reminder",
        title: r.title,
        detail: "Overdue reminder",
        href: "/calendar",
        urgent: true,
      });
    });

  return items.sort((a, b) => (a.urgent === b.urgent ? 0 : a.urgent ? -1 : 1));
}
