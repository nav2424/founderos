import type {
  Brand,
  FounderProfile,
  Goal,
  KnowledgeEntry,
  Reminder,
  Task,
} from "@/lib/types";
import { buildOperatingSnapshot } from "@/lib/founder-intelligence";
import { memoryIndexSummary, searchKnowledge } from "@/lib/memory-search";
import type { FounderContext, WorkspaceContext } from "./types";

export type FounderStoreSlice = {
  brands: Brand[];
  tasks: Task[];
  goals: Goal[];
  ideas: import("@/lib/types").Idea[];
  kpis: import("@/lib/types").Kpi[];
  reminders: Reminder[];
  playbooks: import("@/lib/types").Playbook[];
  weeklyReviews: import("@/lib/types").WeeklyReview[];
  knowledge: KnowledgeEntry[];
  founderProfile: FounderProfile;
};

function brandName(
  brands: { id: string; name: string }[],
  brandId: string | null
): string | null {
  if (!brandId) return null;
  return brands.find((b) => b.id === brandId)?.name ?? null;
}

export function buildWorkspaceContext(store: FounderStoreSlice): WorkspaceContext {
  const { brands } = store;

  return {
    brands: brands.map((b) => ({
      id: b.id,
      name: b.name,
      stage: b.stage,
      label: `${b.name} (${b.stage})`,
      monthly_revenue: b.monthly_revenue,
      brief: b.brief,
      positioning: b.positioning,
      icp: b.icp,
      constraints: b.constraints,
      notes: b.notes,
    })),
    tasks: store.tasks.slice(0, 80).map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      brand_name: brandName(brands, t.brand_id),
      due_date: t.due_date,
      focus_today: t.focus_today ?? false,
    })),
    goals: store.goals.slice(0, 40).map((g) => ({
      id: g.id,
      title: g.title,
      type: g.type,
      status: g.status,
      brand_name: brandName(brands, g.brand_id),
      target_metric: g.target_metric,
      current_value: g.current_value,
      target_value: g.target_value,
      deadline: g.deadline,
    })),
    ideas: store.ideas.slice(0, 40).map((i) => ({
      id: i.id,
      title: i.title,
      status: i.status,
      brand_name: brandName(brands, i.brand_id),
    })),
    kpis: store.kpis.slice(0, 30).map((k) => ({
      id: k.id,
      name: k.name,
      value: k.value,
      target_value: k.target_value,
      brand_name: brandName(brands, k.brand_id),
    })),
    reminders: store.reminders.slice(0, 30).map((r) => ({
      id: r.id,
      title: r.title,
      due_date: r.due_date,
      completed: r.completed,
      brand_name: brandName(brands, r.brand_id),
      event_type: r.event_type,
    })),
    playbooks: store.playbooks.slice(0, 20).map((p) => ({
      id: p.id,
      title: p.title,
      brand_name: brandName(brands, p.brand_id),
    })),
    weekly_reviews: store.weeklyReviews.slice(0, 6).map((w) => ({
      id: w.id,
      week_start: w.week_start,
      wins: w.wins,
      bottlenecks: w.bottlenecks,
      priorities_next_week: w.priorities_next_week,
    })),
  };
}

/** Full founder OS context: workspace + memory retrieval + operating intelligence. */
export function buildFounderContext(
  store: FounderStoreSlice,
  userQuery: string
): FounderContext {
  const workspace = buildWorkspaceContext(store);
  const brandMap = new Map(store.brands.map((b) => [b.id, b.name]));

  const recalled_memory = searchKnowledge(
    store.knowledge,
    userQuery,
    brandMap,
    12
  );

  const memory_index = memoryIndexSummary(store.knowledge, brandMap);

  const operating_snapshot = buildOperatingSnapshot(
    store.brands,
    store.tasks,
    store.goals,
    store.reminders
  );

  return {
    workspace,
    founder_profile: store.founderProfile,
    recalled_memory,
    memory_index,
    operating_snapshot,
  };
}

export function contextToPrompt(ctx: FounderContext): string {
  return JSON.stringify(ctx, null, 2);
}
