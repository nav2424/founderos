"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GoalProgressCard } from "@/components/goal-progress-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFounderStore } from "@/store/use-founder-store";
import { GOAL_TYPES } from "@/lib/constants";
import type { GoalType } from "@/lib/types";

export default function GoalsPage() {
  const brands = useFounderStore((s) => s.brands);
  const goals = useFounderStore((s) => s.goals);
  const addGoal = useFounderStore((s) => s.addGoal);
  const updateGoal = useFounderStore((s) => s.updateGoal);
  const [filter, setFilter] = useState<"active" | "completed" | "all">("active");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<GoalType>("Monthly");
  const [brandId, setBrandId] = useState("none");
  const [target, setTarget] = useState(100);
  const [current, setCurrent] = useState(0);

  const filtered = useMemo(() => {
    if (filter === "all") return goals;
    return goals.filter((g) => g.status === filter);
  }, [goals, filter]);

  const byType = GOAL_TYPES.reduce(
    (acc, t) => {
      acc[t] = filtered.filter((g) => g.type === t);
      return acc;
    },
    {} as Record<string, typeof goals>
  );

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addGoal({
      title: title.trim(),
      description: null,
      brand_id: brandId === "none" ? null : brandId,
      type,
      target_metric: null,
      current_value: current,
      target_value: target,
      deadline: null,
      status: "active",
    });
    setTitle("");
    setOpen(false);
  }

  return (
    <AppShell title="Goals" subtitle="Yearly → weekly execution">
      <div className="flex flex-wrap gap-2 justify-between mb-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Goal
        </Button>
      </div>

      {GOAL_TYPES.map((goalType) => {
        const items = byType[goalType];
        if (items.length === 0) return null;
        return (
          <section key={goalType} className="mb-8">
            <h2 className="text-sm font-medium text-zinc-400 mb-3">
              {goalType} Goals
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((goal) => (
                <div key={goal.id} className="relative">
                  <GoalProgressCard goal={goal} />
                  {goal.status === "active" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-[10px]"
                      onClick={() =>
                        updateGoal(goal.id, { status: "completed" })
                      }
                    >
                      Complete
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <p className="text-center py-12 text-zinc-500">No goals yet</p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Goal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as GoalType)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Brand</Label>
                <Select value={brandId} onValueChange={setBrandId}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Current</Label>
                <Input
                  type="number"
                  value={current}
                  onChange={(e) => setCurrent(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Target</Label>
                <Input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Add Goal
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
