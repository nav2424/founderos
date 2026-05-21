"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GoalProgressCard } from "@/components/goal-progress-card";
import { GoalFormDialog } from "@/components/goal-form-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFounderStore } from "@/store/use-founder-store";
import { isLongTermGoal } from "@/lib/goals";

export default function GoalsPage() {
  const goals = useFounderStore((s) => s.goals);
  const updateGoal = useFounderStore((s) => s.updateGoal);
  const [filter, setFilter] = useState<"active" | "completed" | "all">("active");
  const [longOpen, setLongOpen] = useState(false);
  const [shortOpen, setShortOpen] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "all") return goals;
    return goals.filter((g) => g.status === filter);
  }, [goals, filter]);

  const longTerm = filtered.filter((g) => isLongTermGoal(g.type));
  const shortTerm = filtered.filter((g) => !isLongTermGoal(g.type));

  return (
    <AppShell
      title="Goals"
      subtitle="Long-term vision · short-term execution"
    >
      <div className="flex flex-wrap gap-2 justify-between mb-6">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="bg-white/[0.03]">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLongOpen(true)}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Long-term
          </Button>
          <Button size="sm" onClick={() => setShortOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Short-term
          </Button>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-4">
          Long-term · Yearly & Quarterly
        </h2>
        <p className="text-xs text-zinc-600 mb-4 -mt-2">
          North star outcomes — e.g. $100k MRR by Dec 2026
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {longTerm.map((goal) => (
            <div key={goal.id} className="relative">
              <GoalProgressCard goal={goal} />
              {goal.status === "active" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-[10px] h-7"
                  onClick={() => updateGoal(goal.id, { status: "completed" })}
                >
                  Done
                </Button>
              )}
            </div>
          ))}
        </div>
        {longTerm.length === 0 && (
          <p className="text-sm text-zinc-600 py-8 text-center rounded-xl border border-dashed border-white/[0.08]">
            No long-term goals yet
          </p>
        )}
      </section>

      <section>
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-4">
          Short-term · Monthly & Weekly
        </h2>
        <p className="text-xs text-zinc-600 mb-4 -mt-2">
          Near-term milestones that ladder up to long-term goals
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {shortTerm.map((goal) => (
            <div key={goal.id} className="relative">
              <GoalProgressCard goal={goal} />
              {goal.status === "active" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-[10px] h-7"
                  onClick={() => updateGoal(goal.id, { status: "completed" })}
                >
                  Done
                </Button>
              )}
            </div>
          ))}
        </div>
        {shortTerm.length === 0 && (
          <p className="text-sm text-zinc-600 py-8 text-center rounded-xl border border-dashed border-white/[0.08]">
            No short-term goals yet
          </p>
        )}
      </section>

      {filtered.length === 0 && (
        <p className="text-center py-12 text-zinc-500">
          Add a goal from a brand Timeline or here
        </p>
      )}

      <GoalFormDialog
        open={longOpen}
        onOpenChange={setLongOpen}
        defaultHorizon="long_term"
      />
      <GoalFormDialog
        open={shortOpen}
        onOpenChange={setShortOpen}
        defaultHorizon="short_term"
      />
    </AppShell>
  );
}
