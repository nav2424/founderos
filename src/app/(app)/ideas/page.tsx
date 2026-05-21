"use client";

import { useMemo, useState } from "react";
import { Archive, ArrowRightCircle, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { useFounderStore, getSortedByPriority } from "@/store/use-founder-store";
import { IDEA_CATEGORIES } from "@/lib/constants";
import { priorityScore } from "@/lib/utils";
import type { IdeaCategory } from "@/lib/types";

export default function IdeasPage() {
  const brands = useFounderStore((s) => s.brands);
  const ideas = useFounderStore((s) => s.ideas);
  const addIdea = useFounderStore((s) => s.addIdea);
  const updateIdea = useFounderStore((s) => s.updateIdea);
  const convertIdeaToTask = useFounderStore((s) => s.convertIdeaToTask);

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<IdeaCategory>("Other");
  const [brandId, setBrandId] = useState("none");
  const [impact, setImpact] = useState(3);
  const [effort, setEffort] = useState(3);

  const filtered = useMemo(() => {
    let list = ideas.filter((i) => i.status !== "Archived");
    if (categoryFilter !== "all")
      list = list.filter((i) => i.category === categoryFilter);
    return getSortedByPriority(list);
  }, [ideas, categoryFilter]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addIdea({
      title: title.trim(),
      description: null,
      brand_id: brandId === "none" ? null : brandId,
      category,
      priority: "Medium",
      status: "Raw Idea",
      estimated_impact: impact,
      effort_level: effort,
    });
    setTitle("");
    setOpen(false);
  }

  return (
    <AppShell title="Ideas" subtitle="Inbox for content, product & growth">
      <div className="flex flex-wrap gap-2 justify-between mb-4">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {IDEA_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> New Idea
        </Button>
      </div>

      <div className="space-y-3">
        {filtered.map((idea) => {
          const score = priorityScore(
            idea.estimated_impact,
            idea.effort_level
          );
          const brand = brands.find((b) => b.id === idea.brand_id);
          return (
            <div
              key={idea.id}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-zinc-100">{idea.title}</h3>
                  {idea.description && (
                    <p className="text-sm text-zinc-500 mt-1">
                      {idea.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {idea.category}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {idea.status}
                    </Badge>
                    {brand && (
                      <Badge variant="outline" className="text-[10px]">
                        {brand.name}
                      </Badge>
                    )}
                    <span className="text-[10px] text-emerald-400">
                      Score {score}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Convert to task"
                    onClick={() => convertIdeaToTask(idea.id)}
                  >
                    <ArrowRightCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Archive"
                    onClick={() =>
                      updateIdea(idea.id, { status: "Archived" })
                    }
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Idea</DialogTitle>
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
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as IdeaCategory)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IDEA_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
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
                <Label>Impact</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={impact}
                  onChange={(e) => setImpact(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Effort</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={effort}
                  onChange={(e) => setEffort(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Add Idea
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
