"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { KpiPeriod } from "@/lib/types";

export default function KpisPage() {
  const brands = useFounderStore((s) => s.brands);
  const kpis = useFounderStore((s) => s.kpis);
  const addKpi = useFounderStore((s) => s.addKpi);
  const [brandFilter, setBrandFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState(0);
  const [target, setTarget] = useState(100);
  const [period, setPeriod] = useState<KpiPeriod>("Monthly");
  const [brandId, setBrandId] = useState("none");

  const filtered = useMemo(() => {
    if (brandFilter === "all") return kpis;
    return kpis.filter((k) => k.brand_id === brandFilter);
  }, [kpis, brandFilter]);

  const chartData = filtered.map((k) => ({
    name: k.name.length > 12 ? k.name.slice(0, 12) + "…" : k.name,
    value: k.value,
    target: k.target_value,
  }));

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addKpi({
      brand_id: brandId === "none" ? null : brandId,
      name: name.trim(),
      value,
      target_value: target,
      period,
      date: new Date().toISOString().split("T")[0],
      notes: null,
    });
    setName("");
    setOpen(false);
  }

  return (
    <AppShell title="KPIs" subtitle="Track what matters per brand">
      <div className="flex justify-between mb-4">
        <Select value={brandFilter} onValueChange={setBrandFilter}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue />
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
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add KPI
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
        {filtered.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 h-72">
          <p className="text-sm text-zinc-400 mb-4">Value vs Target</p>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981" }}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#52525b"
                strokeDasharray="4 4"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add KPI Entry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5"
                placeholder="Monthly revenue"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Current value</Label>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Target</Label>
                <Input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Period</Label>
                <Select
                  value={period}
                  onValueChange={(v) => setPeriod(v as KpiPeriod)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
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
            <Button type="submit" className="w-full">
              Save KPI
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
