"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFounderStore } from "@/store/use-founder-store";

export function BrandFinancePanel({ brandId }: { brandId: string }) {
  const finances = useFounderStore((s) =>
    s.brandFinances.filter((f) => f.brand_id === brandId)
  );
  const addBrandFinance = useFounderStore((s) => s.addBrandFinance);
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [revenue, setRevenue] = useState("");
  const [cogs, setCogs] = useState("");
  const [adSpend, setAdSpend] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const rev = Number(revenue);
    if (Number.isNaN(rev)) return;
    addBrandFinance({
      brand_id: brandId,
      month,
      revenue: rev,
      cogs: Number(cogs) || 0,
      ad_spend: Number(adSpend) || 0,
      notes: null,
    });
    setRevenue("");
    setCogs("");
    setAdSpend("");
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-zinc-600">
        Lightweight P&amp;L per month — revenue, COGS, ad spend, net.
      </p>
      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-5 items-end">
        <div>
          <Label className="text-xs">Month</Label>
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Revenue</Label>
          <Input value={revenue} onChange={(e) => setRevenue(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">COGS</Label>
          <Input value={cogs} onChange={(e) => setCogs(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Ad spend</Label>
          <Input value={adSpend} onChange={(e) => setAdSpend(e.target.value)} className="mt-1" />
        </div>
        <Button type="submit" size="sm">
          Save month
        </Button>
      </form>
      <div className="space-y-2">
        {finances.map((f) => {
          const net = f.revenue - f.cogs - f.ad_spend;
          return (
            <div
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm"
            >
              <span className="font-mono text-zinc-500">{f.month}</span>
              <span className="text-zinc-400">
                Rev ${f.revenue.toLocaleString()} · COGS ${f.cogs.toLocaleString()} · Ads $
                {f.ad_spend.toLocaleString()}
              </span>
              <span className={net >= 0 ? "text-emerald-400" : "text-amber-400"}>
                Net ${net.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
