import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  Brand,
  Goal,
  Idea,
  Kpi,
  Playbook,
  Reminder,
  Task,
  WeeklyReview,
} from "@/lib/types";

function client() {
  if (!isSupabaseConfigured()) return null;
  return createClient();
}

function row<T extends Record<string, unknown>>(
  data: T,
  userId: string
): T & { user_id: string } {
  return { ...data, user_id: userId };
}

export async function upsertBrand(brand: Brand, userId: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("brands").upsert(
    row(
      {
        id: brand.id,
        name: brand.name,
        description: brand.description,
        stage: brand.stage,
        monthly_revenue: brand.monthly_revenue,
        priority_level: brand.priority_level,
        categories: brand.categories,
        created_at: brand.created_at,
      },
      userId
    )
  );
}

export async function deleteBrand(id: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("brands").delete().eq("id", id);
}

export async function upsertTask(task: Task, userId: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("tasks").upsert(
    row(
      {
        id: task.id,
        title: task.title,
        description: task.description,
        brand_id: task.brand_id,
        category: task.category,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date,
        reminder_date: task.reminder_date,
        estimated_impact: task.estimated_impact,
        effort_level: task.effort_level,
        created_at: task.created_at,
        completed_at: task.completed_at,
      },
      userId
    )
  );
}

export async function deleteTask(id: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("tasks").delete().eq("id", id);
}

export async function upsertGoal(goal: Goal, userId: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("goals").upsert(
    row(
      {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        brand_id: goal.brand_id,
        type: goal.type,
        target_metric: goal.target_metric,
        current_value: goal.current_value,
        target_value: goal.target_value,
        deadline: goal.deadline,
        status: goal.status,
        created_at: goal.created_at,
      },
      userId
    )
  );
}

export async function deleteGoal(id: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("goals").delete().eq("id", id);
}

export async function upsertIdea(idea: Idea, userId: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("ideas").upsert(
    row(
      {
        id: idea.id,
        title: idea.title,
        description: idea.description,
        brand_id: idea.brand_id,
        category: idea.category,
        priority: idea.priority,
        status: idea.status,
        estimated_impact: idea.estimated_impact,
        effort_level: idea.effort_level,
        created_at: idea.created_at,
      },
      userId
    )
  );
}

export async function deleteIdea(id: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("ideas").delete().eq("id", id);
}

export async function upsertKpi(kpi: Kpi, userId: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("kpis").upsert(
    row(
      {
        id: kpi.id,
        brand_id: kpi.brand_id,
        name: kpi.name,
        value: kpi.value,
        target_value: kpi.target_value,
        period: kpi.period,
        date: kpi.date,
        notes: kpi.notes,
        created_at: kpi.created_at ?? new Date().toISOString(),
      },
      userId
    )
  );
}

export async function deleteKpi(id: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("kpis").delete().eq("id", id);
}

export async function upsertReminder(reminder: Reminder, userId: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("reminders").upsert(
    row(
      {
        id: reminder.id,
        title: reminder.title,
        description: reminder.description,
        brand_id: reminder.brand_id,
        due_date: reminder.due_date,
        repeat_frequency: reminder.repeat_frequency,
        completed: reminder.completed,
        created_at: reminder.created_at ?? new Date().toISOString(),
      },
      userId
    )
  );
}

export async function deleteReminder(id: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("reminders").delete().eq("id", id);
}

export async function upsertPlaybook(playbook: Playbook, userId: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("playbooks").upsert(
    row(
      {
        id: playbook.id,
        title: playbook.title,
        brand_id: playbook.brand_id,
        category: playbook.category,
        content: playbook.content,
        created_at: playbook.created_at,
        updated_at: playbook.updated_at,
      },
      userId
    )
  );
}

export async function deletePlaybook(id: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("playbooks").delete().eq("id", id);
}

export async function upsertWeeklyReview(review: WeeklyReview, userId: string) {
  const supabase = client();
  if (!supabase) return;
  await supabase.from("weekly_reviews").upsert(
    row(
      {
        id: review.id,
        week_start: review.week_start,
        wins: review.wins,
        losses: review.losses,
        lessons: review.lessons,
        priorities_next_week: review.priorities_next_week,
        bottlenecks: review.bottlenecks,
        avoided: review.avoided,
        moved_forward: review.moved_forward,
        stop_doing: review.stop_doing,
        delegate_later: review.delegate_later,
        created_at: review.created_at,
      },
      userId
    )
  );
}

export type LocalWorkspace = {
  brands: Brand[];
  tasks: Task[];
  goals: Goal[];
  ideas: Idea[];
  kpis: Kpi[];
  reminders: Reminder[];
  playbooks: Playbook[];
  weeklyReviews: WeeklyReview[];
};

export function countItems(data: LocalWorkspace): number {
  return (
    data.brands.length +
    data.tasks.length +
    data.goals.length +
    data.ideas.length +
    data.kpis.length +
    data.reminders.length +
    data.playbooks.length +
    data.weeklyReviews.length
  );
}

/** Push all local items to Supabase (e.g. first login with existing localStorage data). */
export async function pushAllLocalToSupabase(
  userId: string,
  data: LocalWorkspace
): Promise<void> {
  await Promise.all(data.brands.map((b) => upsertBrand(b, userId)));
  await Promise.all([
    ...data.tasks.map((t) => upsertTask(t, userId)),
    ...data.goals.map((g) => upsertGoal(g, userId)),
    ...data.ideas.map((i) => upsertIdea(i, userId)),
    ...data.kpis.map((k) => upsertKpi(k, userId)),
    ...data.reminders.map((r) => upsertReminder(r, userId)),
    ...data.playbooks.map((p) => upsertPlaybook(p, userId)),
    ...data.weeklyReviews.map((w) => upsertWeeklyReview(w, userId)),
  ]);
}

function syncIf(userId: string | null, fn: () => Promise<void>) {
  if (userId) void fn();
}

export const founderSync = {
  brand: {
    upsert: (b: Brand, userId: string | null) =>
      syncIf(userId, () => upsertBrand(b, userId!)),
    delete: (id: string, userId: string | null) =>
      syncIf(userId, () => deleteBrand(id)),
  },
  task: {
    upsert: (t: Task, userId: string | null) =>
      syncIf(userId, () => upsertTask(t, userId!)),
    delete: (id: string, userId: string | null) =>
      syncIf(userId, () => deleteTask(id)),
  },
  goal: {
    upsert: (g: Goal, userId: string | null) =>
      syncIf(userId, () => upsertGoal(g, userId!)),
    delete: (id: string, userId: string | null) =>
      syncIf(userId, () => deleteGoal(id)),
  },
  idea: {
    upsert: (i: Idea, userId: string | null) =>
      syncIf(userId, () => upsertIdea(i, userId!)),
    delete: (id: string, userId: string | null) =>
      syncIf(userId, () => deleteIdea(id)),
  },
  kpi: {
    upsert: (k: Kpi, userId: string | null) =>
      syncIf(userId, () => upsertKpi(k, userId!)),
    delete: (id: string, userId: string | null) =>
      syncIf(userId, () => deleteKpi(id)),
  },
  reminder: {
    upsert: (r: Reminder, userId: string | null) =>
      syncIf(userId, () => upsertReminder(r, userId!)),
    delete: (id: string, userId: string | null) =>
      syncIf(userId, () => deleteReminder(id)),
  },
  playbook: {
    upsert: (p: Playbook, userId: string | null) =>
      syncIf(userId, () => upsertPlaybook(p, userId!)),
    delete: (id: string, userId: string | null) =>
      syncIf(userId, () => deletePlaybook(id)),
  },
  weeklyReview: {
    upsert: (w: WeeklyReview, userId: string | null) =>
      syncIf(userId, () => upsertWeeklyReview(w, userId!)),
  },
};
