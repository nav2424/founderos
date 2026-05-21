"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { BrandCard } from "@/components/brand-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFounderStore } from "@/store/use-founder-store";
import { NATURAL_SCENTS_CATEGORIES } from "@/lib/constants";

export default function BrandsPage() {
  const brands = useFounderStore((s) => s.brands);
  const tasks = useFounderStore((s) => s.tasks);
  const goals = useFounderStore((s) => s.goals);
  const addBrand = useFounderStore((s) => s.addBrand);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addBrand({
      name: name.trim(),
      description: description || null,
      stage: "Idea",
      monthly_revenue: 0,
      priority_level: brands.length + 1,
      categories: [],
    });
    setName("");
    setDescription("");
    setOpen(false);
  }

  return (
    <AppShell title="Brands" subtitle="Manage your portfolio">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Brand
        </Button>
      </div>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Brand</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5"
                placeholder="Brand name"
                autoFocus
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <p className="text-xs text-zinc-500">
              Tip: Natural Scents uses categories:{" "}
              {NATURAL_SCENTS_CATEGORIES.slice(0, 3).join(", ")}…
            </p>
            <Button type="submit" className="w-full">
              Create Brand
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
