"use client";

import { useMemo, useState } from "react";
import { Plus, Target, TrendingUp, Flag } from "lucide-react";
import { MrrHistoryChart } from "@/components/mrr-history-chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GoalFormDialog } from "@/components/goal-form-dialog";
import { useFounderStore } from "@/store/use-founder-store";
import {
  daysUntilDeadline,
  formatGoalValue,
  goalHorizonLabel,
  isLongTermGoal,
  isMrrGoal,
} from "@/lib/goals";
import { formatDate, goalProgress } from "@/lib/utils";
import type { Brand, Goal } from "@/lib/types";
import { cn } from "@/lib/utils";
import { parseISO, format } from "date-fns";

interface BrandTimelineProps {
  brand: Brand;
}

function TimelineGoalCard({
  goal,
  onUpdateProgress,
  linkedTaskCount = 0,
}: {
  goal: Goal;
  onUpdateProgress: (id: string, current: number) => void;
  linkedTaskCount?: number;
}) {
  const progress = goalProgress(goal.current_value, goal.target_value);
  const days = daysUntilDeadline(goal.deadline);
  const overdue = days !== null && days < 0;

  return (
    <div
      className={cn(
        "relative rounded-xl border p-4 transition-colors",
        "border-white/[0.06] bg-white/[0.02]",
        overdue && goal.status === "active" && "border-amber-500/20"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-100">{goal.title}</p>
          {goal.description && (
            <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
              {goal.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge variant="outline" className="text-[10px]">
              {goalHorizonLabel(goal.type)}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {goal.type}
            </Badge>
            {goal.target_metric && (
              <Badge variant="outline" className="text-[10px]">
                {goal.target_metric}
              </Badge>
            )}
            {linkedTaskCount > 0 && (
              <Badge variant="outline" className="text-[10px]">
                {linkedTaskCount} linked task{linkedTaskCount > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>
        {goal.deadline && (
          <div className="shrink-0 text-right">
            <p className="text-[11px] font-mono text-zinc-400">
              {formatDate(goal.deadline)}
            </p>
            {days !== null && goal.status === "active" && (
              <p
                className={cn(
                  "text-[10px] mt-0.5",
                  overdue ? "text-amber-400" : "text-zinc-600"
                )}
              >
                {overdue
                  ? `${Math.abs(days)}d overdue`
                  : days === 0
                    ? "Due today"
                    : `${days}d left`}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-zinc-500">
            {formatGoalValue(goal.current_value, goal.target_metric)}
            <span className="text-zinc-600"> → </span>
            {formatGoalValue(goal.target_value, goal.target_metric)}
          </span>
          <span className="text-emerald-400/90 font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
        {goal.status === "active" && (
          <div className="mt-2 flex gap-2">
            <input
              type="number"
              defaultValue={goal.current_value}
              className="h-7 w-24 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 text-xs"
              onBlur={(e) => {
                const v = Number(e.target.value);
                if (!Number.isNaN(v) && v !== goal.current_value) {
                  onUpdateProgress(goal.id, v);
                }
              }}
            />
            <span className="text-[10px] text-zinc-600 self-center">
              Update progress
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function BrandTimeline({ brand }: BrandTimelineProps) {
  const goals = useFounderStore((s) => s.goals);
  const tasks = useFounderStore((s) => s.tasks);
  const mrrEntries = useFounderStore((s) => s.mrrEntries);
  const milestones = useFounderStore((s) => s.milestones);
  const updateGoal = useFounderStore((s) => s.updateGoal);
  const updateBrand = useFounderStore((s) => s.updateBrand);
  const addMrrEntry = useFounderStore((s) => s.addMrrEntry);
  const addMilestone = useFounderStore((s) => s.addMilestone);

  const [longOpen, setLongOpen] = useState(false);
  const [shortOpen, setShortOpen] = useState(false);
  const [mrrAmount, setMrrAmount] = useState(String(brand.monthly_revenue || ""));
  const [msTitle, setMsTitle] = useState("");
  const [msDate, setMsDate] = useState("");

  const brandGoals = useMemo(
    () => goals.filter((g) => g.brand_id === brand.id),
    [goals, brand.id]
  );

  const active = brandGoals.filter((g) => g.status === "active");
  const longTerm = active.filter((g) => isLongTermGoal(g.type));
  const shortTerm = active.filter((g) => !isLongTermGoal(g.type));
  const withDeadline = [...active]
    .filter((g) => g.deadline)
    .sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""));

  const primaryMrr = longTerm.find(isMrrGoal) ?? shortTerm.find(isMrrGoal);
  const brandMrrHistory = mrrEntries.filter((e) => e.brand_id === brand.id);
  const brandMilestones = milestones.filter((m) => m.brand_id === brand.id);
  const linkedTasks = (goalId: string) =>
    tasks.filter((t) => t.goal_id === goalId && t.status !== "Done");

  const timelineRange = useMemo(() => {
    if (withDeadline.length === 0) return null;
    const dates = withDeadline.map((g) => parseISO(g.deadline!));
    const min = new Date();
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    if (max <= min) max.setMonth(max.getMonth() + 3);
    return { min, max };
  }, [withDeadline]);

  function handleProgress(goalId: string, current: number) {
    updateGoal(goalId, { current_value: current });
    const goal = brandGoals.find((g) => g.id === goalId);
    if (goal && isMrrGoal(goal)) {
      updateBrand(brand.id, { monthly_revenue: current });
    }
  }

  return (
    <div className="space-y-8">
      {/* North star / current MRR */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:col-span-1">
          <div className="flex items-center gap-2 text-zinc-500">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-[11px] uppercase tracking-wider">Current MRR</span>
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">
            ${brand.monthly_revenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-zinc-600 mt-1">Synced from brand · updates with MRR goals</p>
        </div>
        {primaryMrr && (
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] p-5 sm:col-span-2">
            <div className="flex items-center gap-2 text-emerald-400/80">
              <Target className="h-3.5 w-3.5" />
              <span className="text-[11px] uppercase tracking-wider">
                Primary target
              </span>
            </div>
            <p className="mt-2 text-lg font-medium text-zinc-100">
              {primaryMrr.title}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-zinc-400">
                {formatGoalValue(primaryMrr.current_value, primaryMrr.target_metric)}{" "}
                → {formatGoalValue(primaryMrr.target_value, primaryMrr.target_metric)}
              </span>
              {primaryMrr.deadline && (
                <span className="font-mono text-xs text-zinc-500">
                  by {formatDate(primaryMrr.deadline)}
                </span>
              )}
            </div>
            <Progress
              value={goalProgress(
                primaryMrr.current_value,
                primaryMrr.target_value
              )}
              className="mt-3 h-2"
            />
          </div>
        )}
      </div>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-4">
          MRR history
        </h3>
        <MrrHistoryChart entries={brandMrrHistory} />
        <form
          className="mt-4 flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const amount = Number(mrrAmount);
            if (Number.isNaN(amount)) return;
            addMrrEntry({
              brand_id: brand.id,
              amount,
              period: "monthly",
              notes: null,
            });
          }}
        >
          <div>
            <Label className="text-xs">Log MRR</Label>
            <Input
              type="number"
              value={mrrAmount}
              onChange={(e) => setMrrAmount(e.target.value)}
              className="mt-1 w-32"
            />
          </div>
          <Button type="submit" size="sm" variant="outline">
            Record
          </Button>
          <p className="text-[10px] text-zinc-600 self-center">
            Updates brand MRR and active MRR goals
          </p>
        </form>
      </section>

      {/* Visual timeline strip */}
      {timelineRange && withDeadline.length > 0 && (
        <section>
          <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-4">
            Timeline
          </h3>
          <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 pb-8">
            <div className="absolute left-6 right-6 top-12 h-px bg-white/[0.08]" />
            <div className="flex justify-between gap-4 overflow-x-auto pb-2">
              {withDeadline.map((goal) => {
                const end = parseISO(goal.deadline!);
                const span =
                  timelineRange.max.getTime() - timelineRange.min.getTime();
                const pos =
                  span > 0
                    ? ((end.getTime() - timelineRange.min.getTime()) / span) *
                      100
                    : 50;
                return (
                  <div
                    key={goal.id}
                    className="relative flex min-w-[100px] flex-col items-center"
                    style={{ flex: `0 0 ${Math.max(100, pos)}px` }}
                  >
                    <div
                      className={cn(
                        "z-10 h-2.5 w-2.5 rounded-full ring-4 ring-[#050506]",
                        isLongTermGoal(goal.type)
                          ? "bg-violet-400"
                          : "bg-emerald-400"
                      )}
                    />
                    <p className="mt-4 text-center text-[10px] font-mono text-zinc-500">
                      {format(end, "MMM yyyy")}
                    </p>
                    <p className="mt-1 max-w-[120px] text-center text-[11px] text-zinc-300 line-clamp-2">
                      {goal.title}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-[10px] text-zinc-600 text-center">
              Today · {format(timelineRange.min, "MMM d, yyyy")} →{" "}
              {format(timelineRange.max, "MMM d, yyyy")}
            </p>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-zinc-200">Milestones</h3>
            <p className="text-xs text-zinc-600">
              Checkpoints between now and your MRR deadline
            </p>
          </div>
        </div>
        <form
          className="mb-4 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!msTitle.trim() || !msDate) return;
            addMilestone({
              brand_id: brand.id,
              goal_id: primaryMrr?.id ?? null,
              title: msTitle.trim(),
              description: null,
              due_date: msDate,
            });
            setMsTitle("");
            setMsDate("");
          }}
        >
          <Input
            placeholder="e.g. 10 retail partners"
            value={msTitle}
            onChange={(e) => setMsTitle(e.target.value)}
            className="flex-1 min-w-[200px]"
          />
          <Input
            type="date"
            value={msDate}
            onChange={(e) => setMsDate(e.target.value)}
            className="w-36"
          />
          <Button type="submit" size="sm" variant="outline">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </form>
        <div className="space-y-2">
          {brandMilestones.length === 0 ? (
            <p className="text-sm text-zinc-600 py-4 text-center rounded-xl border border-dashed border-white/[0.08]">
              No milestones yet
            </p>
          ) : (
            brandMilestones.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] px-4 py-3"
              >
                <Flag className="h-3.5 w-3.5 text-violet-400/80 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200">{m.title}</p>
                  <p className="text-[11px] font-mono text-zinc-600">
                    {formatDate(m.due_date)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Long-term */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-zinc-200">Long-term</h3>
            <p className="text-xs text-zinc-600">
              Yearly & quarterly — north star outcomes
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setLongOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
        <div className="space-y-3">
          {longTerm.length === 0 ? (
            <p className="text-sm text-zinc-600 py-6 text-center rounded-xl border border-dashed border-white/[0.08]">
              No long-term goals — e.g. &quot;$100k MRR by Dec 2026&quot;
            </p>
          ) : (
            longTerm.map((g) => (
              <TimelineGoalCard
                key={g.id}
                goal={g}
                onUpdateProgress={handleProgress}
                linkedTaskCount={linkedTasks(g.id).length}
              />
            ))
          )}
        </div>
      </section>

      {/* Short-term */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-zinc-200">Short-term</h3>
            <p className="text-xs text-zinc-600">
              Monthly & weekly — execution milestones
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setShortOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
        <div className="space-y-3">
          {shortTerm.length === 0 ? (
            <p className="text-sm text-zinc-600 py-6 text-center rounded-xl border border-dashed border-white/[0.08]">
              No short-term goals — e.g. &quot;10 wholesale accounts this quarter&quot;
            </p>
          ) : (
            shortTerm.map((g) => (
              <TimelineGoalCard
                key={g.id}
                goal={g}
                onUpdateProgress={handleProgress}
                linkedTaskCount={linkedTasks(g.id).length}
              />
            ))
          )}
        </div>
      </section>

      {brandGoals.filter((g) => g.status === "completed").length > 0 && (
        <section>
          <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-600 mb-3">
            Completed
          </h3>
          <div className="space-y-2 opacity-60">
            {brandGoals
              .filter((g) => g.status === "completed")
              .map((g) => (
                <TimelineGoalCard
                  key={g.id}
                  goal={g}
                  onUpdateProgress={handleProgress}
                />
              ))}
          </div>
        </section>
      )}

      <GoalFormDialog
        open={longOpen}
        onOpenChange={setLongOpen}
        brandId={brand.id}
        defaultHorizon="long_term"
      />
      <GoalFormDialog
        open={shortOpen}
        onOpenChange={setShortOpen}
        brandId={brand.id}
        defaultHorizon="short_term"
      />
    </div>
  );
}
