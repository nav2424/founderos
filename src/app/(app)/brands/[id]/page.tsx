"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { BrandTimeline } from "@/components/brand-timeline";
import { BrandContextPanel } from "@/components/brand-context-panel";
import { BrandContactsPanel } from "@/components/brand-contacts-panel";
import { BrandFinancePanel } from "@/components/brand-finance-panel";
import { TaskCard } from "@/components/task-card";
import { GoalProgressCard } from "@/components/goal-progress-card";
import { KpiCard } from "@/components/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFounderStore } from "@/store/use-founder-store";
import { formatDate } from "@/lib/utils";

export default function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const brands = useFounderStore((s) => s.brands);
  const tasks = useFounderStore((s) => s.tasks);
  const goals = useFounderStore((s) => s.goals);
  const kpis = useFounderStore((s) => s.kpis);
  const ideas = useFounderStore((s) => s.ideas);
  const reminders = useFounderStore((s) => s.reminders);
  const playbooks = useFounderStore((s) => s.playbooks);

  const brand = brands.find((b) => b.id === id);
  if (!brand) notFound();

  const brandTasks = tasks.filter((t) => t.brand_id === id);
  const brandGoals = goals.filter((g) => g.brand_id === id);
  const brandKpis = kpis.filter((k) => k.brand_id === id);
  const brandIdeas = ideas.filter((i) => i.brand_id === id);
  const brandReminders = reminders.filter((r) => r.brand_id === id);
  const brandPlaybooks = playbooks.filter((p) => p.brand_id === id);

  const recentActivity = [
    ...brandTasks.slice(0, 3).map((t) => ({
      label: `Task: ${t.title}`,
      date: t.created_at,
    })),
    ...brandIdeas.slice(0, 2).map((i) => ({
      label: `Idea: ${i.title}`,
      date: i.created_at,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <AppShell title={brand.name} subtitle={brand.description ?? undefined}>
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge variant="outline">{brand.stage}</Badge>
        <Badge variant="secondary" className="font-mono">
          ${brand.monthly_revenue.toLocaleString()} MRR
        </Badge>
        <Badge variant="outline">
          {brandGoals.filter((g) => g.status === "active").length} active goals
        </Badge>
      </div>

      {brand.categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-1.5">
          {brand.categories.map((cat) => (
            <Badge key={cat} variant="outline" className="text-[10px]">
              {cat}
            </Badge>
          ))}
        </div>
      )}

      <Tabs defaultValue="timeline">
        <TabsList className="mb-4 flex-wrap h-auto bg-white/[0.03]">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="ideas">Ideas</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="playbooks">Playbooks</TabsTrigger>
          <TabsTrigger value="context">Context</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="finance">P&amp;L</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <BrandTimeline brand={brand} />
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-2xl font-semibold tracking-tight">
                {brandTasks.filter((t) => t.status !== "Done").length}
              </p>
              <p className="text-xs text-zinc-500">Active tasks</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-2xl font-semibold tracking-tight">
                {brandGoals.filter((g) => g.status === "active").length}
              </p>
              <p className="text-xs text-zinc-500">Active goals</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-2xl font-semibold tracking-tight">
                {brandIdeas.filter((i) => i.status !== "Archived").length}
              </p>
              <p className="text-xs text-zinc-500">Active ideas</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-3">
          {brandGoals.map((g) => (
            <GoalProgressCard key={g.id} goal={g} />
          ))}
          {brandGoals.length === 0 && (
            <p className="text-sm text-zinc-500">No goals — use the Timeline tab</p>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-2">
          {brandTasks.map((t) => (
            <TaskCard key={t.id} task={t} showBrand={false} />
          ))}
        </TabsContent>

        <TabsContent value="kpis">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {brandKpis.map((k) => (
              <KpiCard key={k.id} kpi={k} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ideas" className="space-y-2">
          {brandIdeas.map((idea) => (
            <div
              key={idea.id}
              className="rounded-lg border border-white/[0.06] p-3"
            >
              <p className="text-sm font-medium text-zinc-200">{idea.title}</p>
              <div className="mt-1 flex gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  {idea.category}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {idea.status}
                </Badge>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="reminders" className="space-y-2">
          {brandReminders.map((r) => (
            <div
              key={r.id}
              className="flex justify-between gap-2 rounded-lg border border-white/[0.06] px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <span
                  className={
                    r.completed ? "line-through text-zinc-500" : "text-zinc-200"
                  }
                >
                  {r.title}
                </span>
                {r.meeting_url && (
                  <a
                    href={r.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[11px] text-violet-400 hover:text-violet-300 truncate"
                  >
                    Join link
                  </a>
                )}
              </div>
              <span className="text-xs text-zinc-500 shrink-0">
                {formatDate(r.due_date)}
              </span>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="context">
          <BrandContextPanel brand={brand} />
        </TabsContent>

        <TabsContent value="contacts">
          <BrandContactsPanel brandId={brand.id} />
        </TabsContent>

        <TabsContent value="finance">
          <BrandFinancePanel brandId={brand.id} />
        </TabsContent>

        <TabsContent value="playbooks">
          {brandPlaybooks.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No playbooks yet —{" "}
              <Link href="/playbooks" className="text-emerald-400">
                add one
              </Link>
            </p>
          ) : (
            brandPlaybooks.map((pb) => (
              <div
                key={pb.id}
                className="rounded-lg border border-white/[0.06] p-3 mb-2"
              >
                <p className="font-medium text-zinc-200">{pb.title}</p>
                <p className="text-xs text-zinc-500 mt-1">{pb.category}</p>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-2">
          {recentActivity.map((a, i) => (
            <div
              key={i}
              className="flex justify-between text-sm border-b border-white/[0.06] pb-2"
            >
              <span className="text-zinc-300">{a.label}</span>
              <span className="text-xs text-zinc-500">
                {formatDate(a.date)}
              </span>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
