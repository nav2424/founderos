"use client";

import { useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useFounderStore } from "@/store/use-founder-store";
import {
  KNOWLEDGE_CATEGORIES,
  SYSTEM_LAYERS,
} from "@/lib/constants";
import type { KnowledgeCategory, KnowledgeEntry, SystemLayer } from "@/lib/types";

export function FounderMemoryPanel() {
  const brands = useFounderStore((s) => s.brands);
  const knowledge = useFounderStore((s) => s.knowledge);
  const founderProfile = useFounderStore((s) => s.founderProfile);
  const addKnowledge = useFounderStore((s) => s.addKnowledge);
  const deleteKnowledge = useFounderStore((s) => s.deleteKnowledge);
  const updateFounderProfile = useFounderStore((s) => s.updateFounderProfile);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<KnowledgeCategory>("decision");
  const [brandId, setBrandId] = useState("none");
  const [system, setSystem] = useState<string>("none");

  const filtered = knowledge.filter((k) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      k.title.toLowerCase().includes(q) ||
      k.content.toLowerCase().includes(q) ||
      k.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addKnowledge({
      title: title.trim(),
      content: content.trim(),
      brand_id: brandId === "none" ? null : brandId,
      system: system === "none" ? null : (system as SystemLayer),
      category,
      tags: [],
      source: null,
    });
    setTitle("");
    setContent("");
    setOpen(false);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h2 className="text-sm font-medium text-zinc-200 mb-1">
          Global founder layer
        </h2>
        <p className="text-xs text-zinc-600 mb-4">
          Priorities, energy, deep work — injected into every AI command.
        </p>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Current priorities</Label>
            <Textarea
              className="mt-1"
              rows={2}
              value={founderProfile.priorities ?? ""}
              onChange={(e) =>
                updateFounderProfile({ priorities: e.target.value || null })
              }
              placeholder="Top 3 outcomes this quarter…"
            />
          </div>
          <div>
            <Label className="text-xs">Strategic goals (personal)</Label>
            <Textarea
              className="mt-1"
              rows={2}
              value={founderProfile.strategic_goals ?? ""}
              onChange={(e) =>
                updateFounderProfile({
                  strategic_goals: e.target.value || null,
                })
              }
            />
          </div>
          <div>
            <Label className="text-xs">Focus themes</Label>
            <Input
              className="mt-1"
              value={founderProfile.focus_themes ?? ""}
              onChange={(e) =>
                updateFounderProfile({ focus_themes: e.target.value || null })
              }
              placeholder="Wholesale, creator scale, ops…"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="text-sm font-medium text-zinc-200">
              Knowledge library
            </h2>
            <p className="text-xs text-zinc-600">
              {knowledge.length} entries — searchable by AI
            </p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add memory
          </Button>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search decisions, vendors, formulas…"
            className="pl-9"
          />
        </div>
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-zinc-600 py-8 text-center rounded-xl border border-dashed border-white/[0.08]">
              No memories yet — paste meeting notes in AI or add here
            </p>
          ) : (
            filtered.map((k) => (
              <MemoryCard
                key={k.id}
                entry={k}
                brandName={
                  k.brand_id
                    ? brands.find((b) => b.id === k.brand_id)?.name
                    : null
                }
                onDelete={() => deleteKnowledge(k.id)}
              />
            ))
          )}
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-white/[0.08] bg-[#0a0a0b] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add to memory</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5"
                placeholder="e.g. Wholesale terms — Sephora pilot"
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1.5"
                rows={6}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as KnowledgeCategory)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KNOWLEDGE_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
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
                    <SelectItem value="none">Global</SelectItem>
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
              <Label>System (cross-company)</Label>
              <Select value={system} onValueChange={setSystem}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {SYSTEM_LAYERS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Save memory
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MemoryCard({
  entry,
  brandName,
  onDelete,
}: {
  entry: KnowledgeEntry;
  brandName?: string | null;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-200">{entry.title}</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            <Badge variant="outline" className="text-[10px]">
              {entry.category.replace("_", " ")}
            </Badge>
            {brandName && (
              <Badge variant="secondary" className="text-[10px]">
                {brandName}
              </Badge>
            )}
            {entry.system && (
              <Badge variant="outline" className="text-[10px]">
                {entry.system}
              </Badge>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 h-8 w-8 text-zinc-600"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <p className="mt-2 text-xs text-zinc-500 line-clamp-3 whitespace-pre-wrap">
        {entry.content}
      </p>
    </div>
  );
}
