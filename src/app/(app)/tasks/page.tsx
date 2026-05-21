"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { KanbanBoard } from "@/components/kanban-board";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants";
import type { TaskPriority } from "@/lib/types";
import { isOverdue } from "@/lib/utils";

export default function TasksPage() {
  const brands = useFounderStore((s) => s.brands);
  const tasks = useFounderStore((s) => s.tasks);
  const addTask = useFounderStore((s) => s.addTask);

  const [brandFilter, setBrandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dueFilter, setDueFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [brandId, setBrandId] = useState("none");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [impact, setImpact] = useState(3);
  const [effort, setEffort] = useState(3);

  const filtered = useMemo(() => {
    let list = tasks;
    if (brandFilter !== "all")
      list = list.filter((t) => t.brand_id === brandFilter);
    if (statusFilter !== "all")
      list = list.filter((t) => t.status === statusFilter);
    if (priorityFilter !== "all")
      list = list.filter((t) => t.priority === priorityFilter);
    if (dueFilter === "overdue") {
      list = list.filter(
        (t) => isOverdue(t.due_date) && t.status !== "Done"
      );
    } else if (dueFilter === "today") {
      const today = new Date().toISOString().split("T")[0];
      list = list.filter((t) => t.due_date === today);
    }
    return getSortedByPriority(list);
  }, [tasks, brandFilter, statusFilter, priorityFilter, dueFilter]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      description: null,
      brand_id: brandId === "none" ? null : brandId,
      category: null,
      status: "Inbox",
      priority,
      due_date: null,
      reminder_date: null,
      estimated_impact: impact,
      effort_level: effort,
    });
    setTitle("");
    setOpen(false);
  }

  return (
    <AppShell title="Tasks" subtitle="Kanban & table views">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {TASK_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priority</SelectItem>
              {TASK_PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dueFilter} onValueChange={setDueFilter}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="Due" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any due</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="today">Due today</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Quick add
        </Button>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
          <KanbanBoard tasks={filtered} />
        </TabsContent>
        <TabsContent value="table">
          <DataTable tasks={filtered} />
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
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
              <div>
                <Label>Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as TaskPriority)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Impact (1-5)</Label>
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
                <Label>Effort (1-5)</Label>
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
              Add Task
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
