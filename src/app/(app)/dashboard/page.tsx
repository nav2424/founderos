"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardCard } from "@/components/dashboard-card";
import { BrandCard } from "@/components/brand-card";
import { TaskCard } from "@/components/task-card";
import { GoalProgressCard } from "@/components/goal-progress-card";
import { KpiCard } from "@/components/kpi-card";
import { Button } from "@/components/ui/button";
import { useFounderStore, getSortedByPriority } from "@/store/use-founder-store";
import { isOverdue } from "@/lib/utils";
import { parseISO, isFuture, addDays } from "date-fns";

export default function DashboardPage() {
  const brands = useFounderStore((s) => s.brands);
  const tasks = useFounderStore((s) => s.tasks);
  const goals = useFounderStore((s) => s.goals);
  const kpis = useFounderStore((s) => s.kpis);
  const reminders = useFounderStore((s) => s.reminders);

  const activeTasks = tasks.filter((t) => t.status !== "Done");
  const topPriorities = getSortedByPriority(activeTasks).slice(0, 3);
  const overdueTasks = activeTasks.filter((t) => isOverdue(t.due_date));
  const weeklyGoals = goals.filter(
    (g) => g.type === "Weekly" && g.status === "active"
  );
  const monthlyGoals = goals.filter(
    (g) => g.type === "Monthly" && g.status === "active"
  );
  const displayGoals =
    weeklyGoals.length > 0 ? weeklyGoals : monthlyGoals.slice(0, 3);

  const upcomingReminders = reminders
    .filter((r) => !r.completed)
    .filter((r) => {
      try {
        const d = parseISO(r.due_date);
        return isFuture(d) && d <= addDays(new Date(), 7);
      } catch {
        return true;
      }
    })
    .slice(0, 5);

  const overdueReminders = reminders.filter((r) => {
    if (r.completed) return false;
    try {
      return !isFuture(parseISO(r.due_date));
    } catch {
      return false;
    }
  });

  const attentionItems = [
    ...overdueTasks.map((t) => ({
      type: "task" as const,
      label: t.title,
      detail: "Overdue task",
      href: "/tasks",
    })),
    ...overdueReminders.map((r) => ({
      type: "reminder" as const,
      label: r.title,
      detail: "Overdue reminder",
      href: "/calendar",
    })),
    ...activeTasks
      .filter((t) => t.priority === "Critical")
      .slice(0, 3)
      .map((t) => ({
        type: "critical" as const,
        label: t.title,
        detail: "Critical priority",
        href: "/tasks",
      })),
  ].slice(0, 6);

  const brandKpis = kpis.slice(0, 4);

  return (
    <AppShell
      title="Dashboard"
      subtitle={new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })}
    >
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
        <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
        <p className="text-sm text-zinc-300">
          Press <kbd className="rounded bg-zinc-800 px-1.5 text-xs">⌘K</kbd> to
          quick capture — task, idea, reminder, or goal.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <DashboardCard
            title="Today's Top 3 Priorities"
            action={
              <Link href="/tasks">
                <Button variant="ghost" size="sm" className="text-xs">
                  All tasks <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            }
            empty={topPriorities.length === 0}
            emptyMessage="No active tasks — capture something!"
          >
            <div className="space-y-2">
              {topPriorities.map((task, i) => (
                <div key={task.id} className="flex gap-2">
                  <span className="text-xs font-bold text-emerald-500/60 w-4 pt-3">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <TaskCard task={task} />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <div className="grid gap-4 sm:grid-cols-2">
            <DashboardCard
              title="Overdue Tasks"
              empty={overdueTasks.length === 0}
              emptyMessage="You're on track — no overdue tasks"
            >
              <div className="space-y-2">
                {overdueTasks.slice(0, 4).map((task) => (
                  <TaskCard key={task.id} task={task} compact />
                ))}
              </div>
            </DashboardCard>

            <DashboardCard
              title="Upcoming Reminders"
              action={
                <Link href="/calendar">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Calendar
                  </Button>
                </Link>
              }
              empty={upcomingReminders.length === 0}
              emptyMessage="No reminders this week"
            >
              <ul className="space-y-2">
                {upcomingReminders.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between rounded-lg bg-zinc-900/50 px-3 py-2 text-sm"
                  >
                    <span className="text-zinc-300">{r.title}</span>
                    <span className="text-xs text-zinc-500">
                      {new Date(r.due_date).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </DashboardCard>
          </div>

          <DashboardCard
            title="What needs my attention?"
            empty={attentionItems.length === 0}
            emptyMessage="All clear — focus on growth"
          >
            <ul className="space-y-2">
              {attentionItems.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg border border-zinc-800/60 px-3 py-2.5 hover:border-amber-500/30 transition-colors"
                  >
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-sm text-zinc-200">{item.label}</p>
                      <p className="text-xs text-zinc-500">{item.detail}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </DashboardCard>
        </div>

        <div className="space-y-4">
          <DashboardCard title="Weekly Goals Progress">
            <div className="space-y-3">
              {displayGoals.length === 0 ? (
                <p className="text-sm text-zinc-600">No active weekly goals</p>
              ) : (
                displayGoals.slice(0, 3).map((goal) => (
                  <GoalProgressCard key={goal.id} goal={goal} />
                ))
              )}
            </div>
          </DashboardCard>

          <DashboardCard
            title="KPI Snapshot"
            action={
              <Link href="/kpis">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all
                </Button>
              </Link>
            }
          >
            <div className="grid grid-cols-2 gap-2">
              {brandKpis.map((kpi) => (
                <KpiCard key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-zinc-400">Your Brands</h2>
          <Link href="/brands">
            <Button variant="ghost" size="sm" className="text-xs">
              Manage brands
            </Button>
          </Link>
        </div>
        {brands.length === 0 ? (
          <p className="text-sm text-zinc-500 rounded-xl border border-dashed border-zinc-800 px-4 py-8 text-center">
            No brands yet —{" "}
            <Link href="/brands" className="text-emerald-400 hover:underline">
              add your first brand
            </Link>{" "}
            to get started.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <BrandCard
                key={brand.id}
                brand={brand}
                taskCount={tasks.filter(
                  (t) => t.brand_id === brand.id && t.status !== "Done"
                ).length}
                goalCount={goals.filter(
                  (g) => g.brand_id === brand.id && g.status === "active"
                ).length}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
