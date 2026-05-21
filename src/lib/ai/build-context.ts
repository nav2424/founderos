import type { Brand } from "@/lib/types";
import type { WorkspaceContext } from "./types";

type StoreSlice = {
  brands: Pick<
    Brand,
    | "id"
    | "name"
    | "stage"
    | "brief"
    | "positioning"
    | "icp"
    | "constraints"
  >[];
  tasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    brand_id: string | null;
    due_date: string | null;
  }[];
  goals: {
    id: string;
    title: string;
    type: string;
    status: string;
    brand_id: string | null;
    target_metric: string | null;
    current_value: number;
    target_value: number;
    deadline: string | null;
  }[];
  ideas: {
    id: string;
    title: string;
    status: string;
    brand_id: string | null;
  }[];
  kpis: {
    id: string;
    name: string;
    value: number;
    brand_id: string | null;
  }[];
  reminders: {
    id: string;
    title: string;
    due_date: string;
    completed: boolean;
    brand_id: string | null;
  }[];
  playbooks: { id: string; title: string; brand_id: string | null }[];
  weeklyReviews: { id: string; week_start: string }[];
};

function brandName(
  brands: { id: string; name: string }[],
  brandId: string | null
): string | null {
  if (!brandId) return null;
  return brands.find((b) => b.id === brandId)?.name ?? null;
}

export function buildWorkspaceContext(store: StoreSlice): WorkspaceContext {
  const { brands } = store;

  return {
    brands: brands.map((b) => ({
      id: b.id,
      name: b.name,
      stage: b.stage,
      label: `${b.name} (${b.stage})`,
      brief: b.brief,
      positioning: b.positioning,
      icp: b.icp,
      constraints: b.constraints,
    })),
    tasks: store.tasks.slice(0, 80).map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      brand_name: brandName(brands, t.brand_id),
      due_date: t.due_date,
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
      brand_name: brandName(brands, k.brand_id),
    })),
    reminders: store.reminders.slice(0, 30).map((r) => ({
      id: r.id,
      title: r.title,
      due_date: r.due_date,
      completed: r.completed,
      brand_name: brandName(brands, r.brand_id),
    })),
    playbooks: store.playbooks.slice(0, 20).map((p) => ({
      id: p.id,
      title: p.title,
      brand_name: brandName(brands, p.brand_id),
    })),
    weekly_reviews: store.weeklyReviews.slice(0, 10).map((w) => ({
      id: w.id,
      week_start: w.week_start,
    })),
  };
}

export function contextToPrompt(ctx: WorkspaceContext): string {
  return JSON.stringify(ctx, null, 2);
}
