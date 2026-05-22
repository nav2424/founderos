"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFounderStore } from "@/store/use-founder-store";
import type { QuickCaptureType } from "@/lib/types";
import { Lightbulb, CheckSquare, Bell, Target } from "lucide-react";

interface QuickCaptureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const types: { id: QuickCaptureType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "task", label: "Task", icon: CheckSquare },
  { id: "idea", label: "Idea", icon: Lightbulb },
  { id: "reminder", label: "Reminder", icon: Bell },
  { id: "goal", label: "Goal", icon: Target },
];

export function QuickCapture({ open, onOpenChange }: QuickCaptureProps) {
  const brands = useFounderStore((s) => s.brands);
  const addTask = useFounderStore((s) => s.addTask);
  const addIdea = useFounderStore((s) => s.addIdea);
  const addReminder = useFounderStore((s) => s.addReminder);
  const addGoal = useFounderStore((s) => s.addGoal);

  const [step, setStep] = useState<"type" | "form">("type");
  const [captureType, setCaptureType] = useState<QuickCaptureType>("task");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState<string>("none");

  function reset() {
    setStep("type");
    setCaptureType("task");
    setTitle("");
    setDescription("");
    setBrandId("none");
  }

  function handleClose(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const bid = brandId === "none" ? null : brandId;

    switch (captureType) {
      case "task":
        addTask({
          title: title.trim(),
          description: description || null,
          brand_id: bid,
          goal_id: null,
          category: null,
          status: "Inbox",
          priority: "Medium",
          due_date: null,
          reminder_date: null,
          estimated_impact: 3,
          effort_level: 3,
          recurrence: "none",
          focus_today: false,
        });
        break;
      case "idea":
        addIdea({
          title: title.trim(),
          description: description || null,
          brand_id: bid,
          category: "Other",
          priority: "Medium",
          status: "Raw Idea",
          estimated_impact: 3,
          effort_level: 3,
        });
        break;
      case "reminder":
        addReminder({
          title: title.trim(),
          description: description || null,
          brand_id: bid,
          due_date: new Date(Date.now() + 86400000).toISOString(),
          end_date: null,
          event_type: "reminder",
          meeting_url: null,
          location: null,
          repeat_frequency: null,
          completed: false,
        });
        break;
      case "goal":
        addGoal({
          title: title.trim(),
          description: description || null,
          brand_id: bid,
          type: "Weekly",
          target_metric: null,
          current_value: 0,
          target_value: 100,
          deadline: null,
          status: "active",
        });
        break;
    }
    handleClose(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "type" ? "Quick Capture" : `New ${captureType}`}
          </DialogTitle>
        </DialogHeader>

        {step === "type" ? (
          <div className="grid grid-cols-2 gap-2">
            {types.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setCaptureType(id);
                  setStep("form");
                }}
                className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800 p-4 hover:border-emerald-500/40 hover:bg-zinc-900 transition-colors"
              >
                <Icon className="h-5 w-5 text-emerald-400" />
                <span className="text-sm text-zinc-300">{label}</span>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's on your mind?"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5"
                rows={2}
              />
            </div>
            <div>
              <Label>Brand</Label>
              <Select value={brandId} onValueChange={setBrandId}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No brand</SelectItem>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("type")}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Add {captureType}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
