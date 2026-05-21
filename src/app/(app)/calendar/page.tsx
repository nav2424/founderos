"use client";

import { useState } from "react";
import { Bell, Check, Plus } from "lucide-react";
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
import { useFounderStore } from "@/store/use-founder-store";
import { formatDate, isOverdue } from "@/lib/utils";
import { parseISO, isFuture } from "date-fns";

export default function CalendarPage() {
  const brands = useFounderStore((s) => s.brands);
  const reminders = useFounderStore((s) => s.reminders);
  const addReminder = useFounderStore((s) => s.addReminder);
  const completeReminder = useFounderStore((s) => s.completeReminder);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [brandId, setBrandId] = useState("none");

  const upcoming = reminders.filter((r) => {
    if (r.completed) return false;
    try {
      return isFuture(parseISO(r.due_date));
    } catch {
      return !r.completed;
    }
  });

  const overdue = reminders.filter((r) => {
    if (r.completed) return false;
    return isOverdue(r.due_date.split("T")[0]);
  });

  const completed = reminders.filter((r) => r.completed);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    addReminder({
      title: title.trim(),
      description: null,
      brand_id: brandId === "none" ? null : brandId,
      due_date: new Date(dueDate).toISOString(),
      repeat_frequency: null,
      completed: false,
    });
    setTitle("");
    setDueDate("");
    setOpen(false);
  }

  function ReminderList({
    items,
    showOverdue,
  }: {
    items: typeof reminders;
    showOverdue?: boolean;
  }) {
    if (items.length === 0)
      return <p className="text-sm text-zinc-600 py-4">None</p>;
    return (
      <ul className="space-y-2">
        {items.map((r) => {
          const brand = brands.find((b) => b.id === r.brand_id);
          const overdue =
            showOverdue && isOverdue(r.due_date.split("T")[0]);
          return (
            <li
              key={r.id}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                overdue
                  ? "border-red-500/30 bg-red-500/5"
                  : "border-zinc-800 bg-zinc-900/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell
                  className={`h-4 w-4 ${overdue ? "text-red-400" : "text-zinc-500"}`}
                />
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    {r.title}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatDate(r.due_date)}
                    {brand && ` · ${brand.name}`}
                  </p>
                </div>
              </div>
              {!r.completed && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => completeReminder(r.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <AppShell title="Calendar" subtitle="Reminders & due dates">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Reminder
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-medium text-red-400">Overdue</h2>
            <Badge variant="destructive">{overdue.length}</Badge>
          </div>
          <ReminderList items={overdue} showOverdue />
        </section>
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-medium text-zinc-300">Upcoming</h2>
            <Badge variant="secondary">{upcoming.length}</Badge>
          </div>
          <ReminderList items={upcoming} />
        </section>
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-medium text-zinc-500">Completed</h2>
          </div>
          <ReminderList items={completed} />
        </section>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Reminder</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5"
                autoFocus
              />
            </div>
            <div>
              <Label>Due date</Label>
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1.5"
              />
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
            <Button type="submit" className="w-full">
              Add Reminder
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
