import { useFounderStore } from "@/store/use-founder-store";
import type { Brand } from "@/lib/types";
import { getWeekStart } from "@/lib/utils";
import type { ActionResult, FounderAction } from "./types";
import {
  GOAL_TYPES,
  IDEA_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/lib/constants";

function resolveBrandId(brands: Brand[], name?: string | null): string | null {
  if (!name?.trim()) return null;
  const n = name.trim().toLowerCase();
  const exact = brands.find((b) => b.name.toLowerCase() === n);
  if (exact) return exact.id;
  const partial = brands.find(
    (b) =>
      b.name.toLowerCase().includes(n) || n.includes(b.name.toLowerCase())
  );
  return partial?.id ?? null;
}

function findByTitle<T extends { title: string }>(
  items: T[],
  matchTitle: string
): T | undefined {
  const m = matchTitle.trim().toLowerCase();
  return (
    items.find((i) => i.title.toLowerCase() === m) ||
    items.find((i) => i.title.toLowerCase().includes(m))
  );
}

function pickEnum<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T
): T {
  if (value && allowed.includes(value as T)) return value as T;
  return fallback;
}

function parseDueDate(iso?: string | null): string {
  if (iso) return iso;
  return new Date(Date.now() + 86400000).toISOString();
}

export function executeFounderActions(actions: FounderAction[]): ActionResult[] {
  const store = useFounderStore.getState();
  const results: ActionResult[] = [];

  for (const action of actions) {
    try {
      results.push(runAction(store, action));
    } catch (e) {
      results.push({
        action,
        success: false,
        message: e instanceof Error ? e.message : "Failed",
      });
    }
  }

  return results;
}

function runAction(
  store: ReturnType<typeof useFounderStore.getState>,
  action: FounderAction
): ActionResult {
  const brands = () => useFounderStore.getState().brands;

  switch (action.type) {
    case "create_brand": {
      const b = store.addBrand({
        name: action.name.trim(),
        description: action.description ?? null,
        stage: action.stage ?? "Idea",
        monthly_revenue: action.monthly_revenue ?? 0,
        priority_level: brands().length + 1,
        categories: action.categories ?? [],
      });
      return {
        action,
        success: true,
        message: `Created brand "${b.name}"`,
      };
    }

    case "create_task": {
      const t = store.addTask({
        title: action.title.trim(),
        description: action.description ?? null,
        brand_id: resolveBrandId(brands(), action.brand_name),
        category: action.category ?? null,
        status: pickEnum(action.status, TASK_STATUSES, "Inbox"),
        priority: pickEnum(action.priority, TASK_PRIORITIES, "Medium"),
        due_date: action.due_date ?? null,
        reminder_date: null,
        estimated_impact: action.estimated_impact ?? 3,
        effort_level: action.effort_level ?? 3,
      });
      return { action, success: true, message: `Created task "${t.title}"` };
    }

    case "create_goal": {
      const g = store.addGoal({
        title: action.title.trim(),
        description: action.description ?? null,
        brand_id: resolveBrandId(brands(), action.brand_name),
        type: pickEnum(action.goal_type, GOAL_TYPES, "Weekly"),
        target_metric: action.target_metric ?? null,
        current_value: action.current_value ?? 0,
        target_value: action.target_value ?? 100,
        deadline: action.deadline ?? null,
        status: action.status ?? "active",
      });
      return { action, success: true, message: `Created goal "${g.title}"` };
    }

    case "create_idea": {
      const i = store.addIdea({
        title: action.title.trim(),
        description: action.description ?? null,
        brand_id: resolveBrandId(brands(), action.brand_name),
        category: pickEnum(action.category, IDEA_CATEGORIES, "Other"),
        priority: action.priority ?? "Medium",
        status: action.status ?? "Raw Idea",
        estimated_impact: action.estimated_impact ?? 3,
        effort_level: action.effort_level ?? 3,
      });
      return { action, success: true, message: `Created idea "${i.title}"` };
    }

    case "create_kpi": {
      const k = store.addKpi({
        name: action.name.trim(),
        brand_id: resolveBrandId(brands(), action.brand_name),
        value: action.value ?? 0,
        target_value: action.target_value ?? 0,
        period: action.period ?? "Monthly",
        date: action.date ?? new Date().toISOString().split("T")[0],
        notes: action.notes ?? null,
      });
      return { action, success: true, message: `Created KPI "${k.name}"` };
    }

    case "create_reminder": {
      const r = store.addReminder({
        title: action.title.trim(),
        description: action.description ?? null,
        brand_id: resolveBrandId(brands(), action.brand_name),
        due_date: parseDueDate(action.due_date),
        repeat_frequency: action.repeat_frequency ?? null,
        completed: false,
      });
      return {
        action,
        success: true,
        message: `Created reminder "${r.title}"`,
      };
    }

    case "create_playbook": {
      const p = store.addPlaybook({
        title: action.title.trim(),
        brand_id: resolveBrandId(brands(), action.brand_name),
        category: action.category ?? null,
        content: action.content ?? null,
      });
      return {
        action,
        success: true,
        message: `Created playbook "${p.title}"`,
      };
    }

    case "create_weekly_review": {
      const w = store.addWeeklyReview({
        week_start: action.week_start ?? getWeekStart(),
        wins: action.wins ?? null,
        losses: action.losses ?? null,
        lessons: action.lessons ?? null,
        priorities_next_week: action.priorities_next_week ?? null,
        bottlenecks: action.bottlenecks ?? null,
        avoided: action.avoided ?? null,
        moved_forward: action.moved_forward ?? null,
        stop_doing: action.stop_doing ?? null,
        delegate_later: action.delegate_later ?? null,
      });
      return {
        action,
        success: true,
        message: `Saved weekly review for ${w.week_start}`,
      };
    }

    case "complete_task": {
      const task = findByTitle(store.tasks, action.match_title);
      if (!task) throw new Error(`Task not found: "${action.match_title}"`);
      store.completeTask(task.id);
      return {
        action,
        success: true,
        message: `Completed task "${task.title}"`,
      };
    }

    case "update_task": {
      const task = findByTitle(store.tasks, action.match_title);
      if (!task) throw new Error(`Task not found: "${action.match_title}"`);
      store.updateTask(task.id, {
        ...(action.title && { title: action.title }),
        ...(action.status && { status: action.status }),
        ...(action.priority && { priority: action.priority }),
        ...(action.due_date !== undefined && { due_date: action.due_date }),
        ...(action.brand_name !== undefined && {
          brand_id: resolveBrandId(brands(), action.brand_name),
        }),
      });
      return {
        action,
        success: true,
        message: `Updated task "${task.title}"`,
      };
    }

    case "delete_task": {
      const task = findByTitle(store.tasks, action.match_title);
      if (!task) throw new Error(`Task not found: "${action.match_title}"`);
      store.deleteTask(task.id);
      return {
        action,
        success: true,
        message: `Deleted task "${task.title}"`,
      };
    }

    case "complete_reminder": {
      const r = findByTitle(store.reminders, action.match_title);
      if (!r) throw new Error(`Reminder not found: "${action.match_title}"`);
      store.completeReminder(r.id);
      return {
        action,
        success: true,
        message: `Completed reminder "${r.title}"`,
      };
    }

    case "delete_reminder": {
      const r = findByTitle(store.reminders, action.match_title);
      if (!r) throw new Error(`Reminder not found: "${action.match_title}"`);
      store.deleteReminder(r.id);
      return {
        action,
        success: true,
        message: `Deleted reminder "${r.title}"`,
      };
    }

    case "update_goal": {
      const goal = findByTitle(store.goals, action.match_title);
      if (!goal) throw new Error(`Goal not found: "${action.match_title}"`);
      store.updateGoal(goal.id, {
        ...(action.current_value !== undefined && {
          current_value: action.current_value,
        }),
        ...(action.target_value !== undefined && {
          target_value: action.target_value,
        }),
        ...(action.status && { status: action.status }),
      });
      return {
        action,
        success: true,
        message: `Updated goal "${goal.title}"`,
      };
    }

    case "delete_goal": {
      const goal = findByTitle(store.goals, action.match_title);
      if (!goal) throw new Error(`Goal not found: "${action.match_title}"`);
      store.deleteGoal(goal.id);
      return {
        action,
        success: true,
        message: `Deleted goal "${goal.title}"`,
      };
    }

    case "delete_idea": {
      const idea = findByTitle(store.ideas, action.match_title);
      if (!idea) throw new Error(`Idea not found: "${action.match_title}"`);
      store.deleteIdea(idea.id);
      return {
        action,
        success: true,
        message: `Deleted idea "${idea.title}"`,
      };
    }

    default:
      return { action, success: false, message: "Unknown action type" };
  }
}
