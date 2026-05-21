"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export default function PlaybooksPage() {
  const brands = useFounderStore((s) => s.brands);
  const playbooks = useFounderStore((s) => s.playbooks);
  const addPlaybook = useFounderStore((s) => s.addPlaybook);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [brandId, setBrandId] = useState("none");
  const [selected, setSelected] = useState<string | null>(null);

  const active = playbooks.find((p) => p.id === selected);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const pb = addPlaybook({
      title: title.trim(),
      brand_id: brandId === "none" ? null : brandId,
      category: category || null,
      content: content || null,
    });
    setSelected(pb.id);
    setTitle("");
    setCategory("");
    setContent("");
    setOpen(false);
  }

  return (
    <AppShell title="Playbooks" subtitle="SOPs & repeatable processes">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> New Playbook
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-1">
          {playbooks.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No playbooks yet. Document your creator outreach, wholesale
              onboarding, or content batch process.
            </p>
          ) : (
            playbooks.map((pb) => {
              const brand = brands.find((b) => b.id === pb.brand_id);
              return (
                <button
                  key={pb.id}
                  type="button"
                  onClick={() => setSelected(pb.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-colors ${
                    selected === pb.id
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <p className="font-medium text-zinc-200">{pb.title}</p>
                  <div className="mt-1 flex gap-2">
                    {pb.category && (
                      <Badge variant="secondary" className="text-[10px]">
                        {pb.category}
                      </Badge>
                    )}
                    {brand && (
                      <Badge variant="outline" className="text-[10px]">
                        {brand.name}
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 min-h-[300px]">
          {active ? (
            <>
              <h2 className="text-lg font-semibold text-zinc-100">
                {active.title}
              </h2>
              <pre className="mt-4 whitespace-pre-wrap text-sm text-zinc-400 font-sans">
                {active.content || "No content yet — edit to add steps."}
              </pre>
            </>
          ) : (
            <p className="text-zinc-500 text-sm">
              Select a playbook or create one
            </p>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Playbook</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5"
                placeholder="Creator outreach SOP"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5"
                  placeholder="Creator Partnerships"
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
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1.5"
                rows={8}
                placeholder="Step 1: ...&#10;Step 2: ..."
              />
            </div>
            <Button type="submit" className="w-full">
              Create Playbook
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
