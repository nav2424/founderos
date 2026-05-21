"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { TaskCard } from "@/components/task-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFounderStore } from "@/store/use-founder-store";
import {
  filterTodayReminders,
  filterTodayTasks,
  filterWeekGoals,
  upcomingMilestones,
} from "@/lib/today";
import { buildWeeklyInsights } from "@/lib/insights";
import { formatDate } from "@/lib/utils";
import { Focus, Target, CalendarClock, Flag } from "lucide-react";

export default function TodayPage() {
  const tasks = useFounderStore((s) => s.tasks);
  const goals = useFounderStore((s) => s.goals);
  const reminders = useFounderStore((s) => s.reminders);
  const milestones = useFounderStore((s) => s.milestones);
  const brands = useFounderStore((s) => s.brands);
  const toggleTaskFocus = useFounderStore((s) => s.toggleTaskFocus);
  const clearFocusTasks = useFounderStore((s) => s.clearFocusTasks);

  const { focus, dueToday, overdue } = filterTodayTasks(tasks);
  const rem = filterTodayReminders(reminders);
  const weekGoals = filterWeekGoals(goals);
  const timelineMs = upcomingMilestones(milestones, 2);
  const insights = buildWeeklyInsights(brands, goals, tasks);

  const focusIds = new Set(focus.map((t) => t.id));

  return (
    <AppShell
      title="Today"
      subtitle={new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      })}
    >
      {insights[0] && insights[0].id !== "all-clear" && (
        <div className="mb-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] p-4">
          <p className="text-sm font-medium text-zinc-100">{insights[0].title}</p>
          <p className="mt-1 text-xs text-zinc-500">{insights[0].body}</p>
          {insights[0].suggestedTasks && (
            <ul className="mt-2 space-y-1">
              {insights[0].suggestedTasks.map((s, i) => (
                <li key={i} className="text-[11px] text-zinc-600">
                  · {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Focus className="h-4 w-4 text-emerald-400/80" />
            <h2 className="text-sm font-medium text-zinc-200">Focus (max 3)</h2>
          </div>
          {focus.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFocusTasks}>
              Clear
            </Button>
          )}
        </div>
        {focus.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/[0.08] py-6 text-center text-sm text-zinc-600">
            Star tasks below to focus — hides noise, keeps impact front and center
          </p>
        ) : (
          <div className="space-y-2">
            {focus.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-medium text-zinc-200">
            Due today
            {dueToday.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {dueToday.length}
              </Badge>
            )}
          </h2>
          <div className="space-y-2">
            {dueToday.length === 0 ? (
              <p className="text-xs text-zinc-600">No tasks due today</p>
            ) : (
              dueToday.map((t) => (
                <div key={t.id} className="relative">
                  <TaskCard task={t} />
                  {!focusIds.has(t.id) && focus.length < 3 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-2 h-7 text-[10px]"
                      onClick={() => toggleTaskFocus(t.id)}
                    >
                      Focus
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-medium text-amber-400/90">
            Overdue
            {overdue.length > 0 && (
              <Badge className="ml-2 bg-amber-500/20 text-amber-300">
                {overdue.length}
              </Badge>
            )}
          </h2>
          <div className="space-y-2">
            {overdue.length === 0 ? (
              <p className="text-xs text-zinc-600">Nothing overdue</p>
            ) : (
              overdue.map((t) => (
                <TaskCard key={t.id} task={t} />
              ))
            )}
          </div>
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-zinc-500" />
          <h2 className="text-sm font-medium text-zinc-200">Reminders</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[11px] uppercase tracking-wider text-zinc-600">
              Today
            </p>
            {rem.today.length === 0 ? (
              <p className="mt-2 text-xs text-zinc-600">None</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {rem.today.map((r) => (
                  <li key={r.id} className="text-sm text-zinc-300">
                    {r.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-wider text-amber-400/70">
              Overdue
            </p>
            {rem.overdue.length === 0 ? (
              <p className="mt-2 text-xs text-zinc-600">None</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {rem.overdue.map((r) => (
                  <li key={r.id} className="text-sm text-zinc-300">
                    {r.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <Link
          href="/calendar"
          className="mt-2 inline-block text-[11px] text-emerald-500/80 hover:text-emerald-400"
        >
          Open calendar →
        </Link>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-violet-400/80" />
          <h2 className="text-sm font-medium text-zinc-200">
            Goals due this week
          </h2>
        </div>
        {weekGoals.length === 0 ? (
          <p className="text-xs text-zinc-600">No short-term goals due this week</p>
        ) : (
          <div className="space-y-2">
            {weekGoals.map((g) => (
              <div
                key={g.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              >
                <p className="text-sm text-zinc-200">{g.title}</p>
                {g.deadline && (
                  <p className="text-[11px] text-zinc-600">
                    {formatDate(g.deadline)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {timelineMs.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <Flag className="h-4 w-4 text-zinc-500" />
            <h2 className="text-sm font-medium text-zinc-200">
              Upcoming milestones
            </h2>
          </div>
          <div className="space-y-2">
            {timelineMs.map((m) => {
              const brand = brands.find((b) => b.id === m.brand_id);
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-zinc-200">{m.title}</p>
                    {brand && (
                      <p className="text-[11px] text-zinc-600">{brand.name}</p>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-zinc-500">
                    {formatDate(m.due_date)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/portfolio">Portfolio</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/weekly-review">Weekly review</Link>
        </Button>
      </div>
    </AppShell>
  );
}
