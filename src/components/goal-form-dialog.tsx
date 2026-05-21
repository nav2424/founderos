"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  GOAL_METRICS,
  GOAL_TYPES,
  LONG_TERM_GOAL_TYPES,
  SHORT_TERM_GOAL_TYPES,
} from "@/lib/constants";
import { goalHorizonLabel } from "@/lib/goals";
import type { GoalType } from "@/lib/types";

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-select brand */
  brandId?: string;
  /** Default horizon when opening */
  defaultHorizon?: "long_term" | "short_term";
}

export function GoalFormDialog({
  open,
  onOpenChange,
  brandId: fixedBrandId,
  defaultHorizon = "long_term",
}: GoalFormDialogProps) {
  const brands = useFounderStore((s) => s.brands);
  const addGoal = useFounderStore((s) => s.addGoal);
  const updateBrand = useFounderStore((s) => s.updateBrand);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<GoalType>(
    defaultHorizon === "long_term" ? "Yearly" : "Monthly"
  );
  const [brandId, setBrandId] = useState(fixedBrandId ?? "none");
  const [metric, setMetric] = useState("MRR");
  const [customMetric, setCustomMetric] = useState("");
  const [target, setTarget] = useState(100000);
  const [current, setCurrent] = useState(0);
  const [deadline, setDeadline] = useState("");

  const selectedBrand = brands.find(
    (b) => b.id === (fixedBrandId ?? (brandId === "none" ? null : brandId))
  );

  useEffect(() => {
    if (open && selectedBrand && metric === "MRR") {
      setCurrent(selectedBrand.monthly_revenue);
    }
  }, [open, selectedBrand, metric]);

  useEffect(() => {
    if (open) {
      setType(defaultHorizon === "long_term" ? "Yearly" : "Monthly");
      if (fixedBrandId) setBrandId(fixedBrandId);
    }
  }, [open, defaultHorizon, fixedBrandId]);

  function reset() {
    setTitle("");
    setDescription("");
    setMetric("MRR");
    setCustomMetric("");
    setTarget(100000);
    setCurrent(0);
    setDeadline("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const targetMetric =
      metric === "Custom" ? customMetric.trim() || "Custom" : metric;
    const bid = fixedBrandId ?? (brandId === "none" ? null : brandId);

    addGoal({
      title: title.trim(),
      description: description.trim() || null,
      brand_id: bid,
      type,
      target_metric: targetMetric,
      current_value: current,
      target_value: target,
      deadline: deadline || null,
      status: "active",
    });

    if (bid && metric === "MRR" && selectedBrand) {
      updateBrand(bid, { monthly_revenue: current });
    }

    reset();
    onOpenChange(false);
  }

  const typesForHorizon =
    defaultHorizon === "long_term"
      ? LONG_TERM_GOAL_TYPES
      : SHORT_TERM_GOAL_TYPES;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {goalHorizonLabel(type)} goal
            {selectedBrand ? ` · ${selectedBrand.name}` : ""}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Goal</Label>
            <Input
              autoFocus
              placeholder="e.g. Hit $50k MRR"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5"
              rows={2}
              placeholder="What does success look like?"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Timeframe</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as GoalType)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(fixedBrandId ? GOAL_TYPES : typesForHorizon).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target by</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
          {!fixedBrandId && (
            <div>
              <Label>Brand</Label>
              <Select value={brandId} onValueChange={setBrandId}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
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
          )}
          <div>
            <Label>Metric</Label>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOAL_METRICS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {metric === "Custom" && (
              <Input
                placeholder="Metric name"
                value={customMetric}
                onChange={(e) => setCustomMetric(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Current {metric === "MRR" ? "($)" : ""}</Label>
              <Input
                type="number"
                value={current}
                onChange={(e) => setCurrent(Number(e.target.value))}
                className="mt-1.5"
              />
              {selectedBrand && metric === "MRR" && (
                <button
                  type="button"
                  className="mt-1 text-[10px] text-emerald-500/80 hover:text-emerald-400"
                  onClick={() =>
                    setCurrent(selectedBrand.monthly_revenue)
                  }
                >
                  Use brand MRR (${selectedBrand.monthly_revenue.toLocaleString()})
                </button>
              )}
            </div>
            <div>
              <Label>Target {metric === "MRR" ? "($)" : ""}</Label>
              <Input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="mt-1.5"
                placeholder={metric === "MRR" ? "50000" : ""}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Add to timeline
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
