import { TrendingUp, TrendingDown } from "lucide-react";
import { goalProgress } from "@/lib/utils";
import type { Kpi } from "@/lib/types";

interface KpiCardProps {
  kpi: Kpi;
}

export function KpiCard({ kpi }: KpiCardProps) {
  const progress = goalProgress(kpi.value, kpi.target_value);
  const onTrack = progress >= 50;

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
      <div className="flex items-start justify-between">
        <p className="text-xs text-zinc-500">{kpi.name}</p>
        {onTrack ? (
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-amber-500" />
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold text-zinc-100">
        {kpi.notes === "%" ? `${kpi.value}%` : kpi.value.toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Target: {kpi.notes === "%" ? `${kpi.target_value}%` : kpi.target_value.toLocaleString()}
      </p>
      <div className="mt-3 h-1 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  );
}
