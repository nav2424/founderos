"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFounderStore } from "@/store/use-founder-store";
import { formatDate } from "@/lib/utils";

export function BrandContactsPanel({ brandId }: { brandId: string }) {
  const contacts = useFounderStore((s) =>
    s.contacts.filter((c) => c.brand_id === brandId)
  );
  const addContact = useFounderStore((s) => s.addContact);
  const deleteContact = useFounderStore((s) => s.deleteContact);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Lead");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addContact({
      brand_id: brandId,
      name: name.trim(),
      company: company || null,
      email: null,
      status,
      next_follow_up: null,
      notes: null,
    });
    setName("");
    setCompany("");
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
        <div>
          <Label className="text-xs">Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-40" />
        </div>
        <div>
          <Label className="text-xs">Company</Label>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1 w-40" />
        </div>
        <div>
          <Label className="text-xs">Status</Label>
          <Input value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-28" />
        </div>
        <Button type="submit" size="sm">
          Add
        </Button>
      </form>
      {contacts.length === 0 ? (
        <p className="text-sm text-zinc-600">No contacts yet</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-[11px] text-zinc-600">
                <th className="p-3">Name</th>
                <th className="p-3">Company</th>
                <th className="p-3">Status</th>
                <th className="p-3">Follow-up</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-b border-white/[0.04]">
                  <td className="p-3 text-zinc-200">{c.name}</td>
                  <td className="p-3 text-zinc-500">{c.company ?? "—"}</td>
                  <td className="p-3 text-zinc-400">{c.status}</td>
                  <td className="p-3 font-mono text-[11px] text-zinc-600">
                    {c.next_follow_up ? formatDate(c.next_follow_up) : "—"}
                  </td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-zinc-600"
                      onClick={() => deleteContact(c.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
