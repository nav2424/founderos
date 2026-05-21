"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useFounderStore } from "@/store/use-founder-store";
import type { Brand } from "@/lib/types";

export function BrandContextPanel({ brand }: { brand: Brand }) {
  const updateBrand = useFounderStore((s) => s.updateBrand);
  const [brief, setBrief] = useState(brand.brief ?? "");
  const [positioning, setPositioning] = useState(brand.positioning ?? "");
  const [icp, setIcp] = useState(brand.icp ?? "");
  const [constraints, setConstraints] = useState(brand.constraints ?? "");
  const [notes, setNotes] = useState(brand.notes ?? "");
  const [notionUrl, setNotionUrl] = useState(brand.notion_url ?? "");
  const [saved, setSaved] = useState(false);

  function save() {
    updateBrand(brand.id, {
      brief: brief || null,
      positioning: positioning || null,
      icp: icp || null,
      constraints: constraints || null,
      notes: notes || null,
      notion_url: notionUrl || null,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl space-y-5">
      <p className="text-xs text-zinc-600">
        AI uses this context on every command — no need to re-explain {brand.name}.
      </p>
      <div>
        <Label>Brand brief</Label>
        <Textarea
          className="mt-1.5"
          rows={4}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="What the brand is, stage, key products..."
        />
      </div>
      <div>
        <Label>Positioning</Label>
        <Textarea
          className="mt-1.5"
          rows={2}
          value={positioning}
          onChange={(e) => setPositioning(e.target.value)}
        />
      </div>
      <div>
        <Label>ICP</Label>
        <Textarea
          className="mt-1.5"
          rows={2}
          value={icp}
          onChange={(e) => setIcp(e.target.value)}
          placeholder="Ideal customer profile"
        />
      </div>
      <div>
        <Label>Constraints</Label>
        <Textarea
          className="mt-1.5"
          rows={2}
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          placeholder="Budget, team size, channels you won't use..."
        />
      </div>
      <div>
        <Label>Strategy notes</Label>
        <Textarea
          className="mt-1.5"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div>
        <Label>Linked doc URL</Label>
        <Input
          className="mt-1.5"
          value={notionUrl}
          onChange={(e) => setNotionUrl(e.target.value)}
          placeholder="https://notion.so/..."
        />
      </div>
      <Button onClick={save}>{saved ? "Saved" : "Save context"}</Button>
    </div>
  );
}
