"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useFounderStore } from "@/store/use-founder-store";
import { brandHealth, primaryGoalProgress } from "@/lib/portfolio";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const healthStyles = {
  green: "bg-emerald-500/20 text-emerald-300",
  yellow: "bg-amber-500/20 text-amber-300",
  red: "bg-red-500/20 text-red-300",
};

export default function PortfolioPage() {
  const brands = useFounderStore((s) => s.brands);
  const goals = useFounderStore((s) => s.goals);
  const tasks = useFounderStore((s) => s.tasks);

  const sorted = [...brands].sort(
    (a, b) => a.priority_level - b.priority_level
  );
  const totalMrr = brands.reduce((s, b) => s + b.monthly_revenue, 0);

  return (
    <AppShell
      title="Portfolio"
      subtitle={`${brands.length} brands · $${totalMrr.toLocaleString()} MRR`}
    >
      {brands.length === 0 ? (
        <p className="text-sm text-zinc-600">
          Add brands to see your CEO dashboard.
        </p>
      ) : (
        <div className="space-y-3">
          {sorted.map((brand) => {
            const health = brandHealth(brand, goals, tasks);
            const pct = primaryGoalProgress(brand.id, goals);
            return (
              <Link
                key={brand.id}
                href={`/brands/${brand.id}`}
                className="block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-medium text-zinc-100">
                        {brand.name}
                      </h3>
                      <Badge
                        className={cn(
                          "text-[10px] uppercase",
                          healthStyles[health]
                        )}
                      >
                        {health}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">{brand.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold tabular-nums text-zinc-100">
                      ${brand.monthly_revenue.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-zinc-600">MRR</p>
                  </div>
                </div>
                {pct > 0 && (
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-[11px]">
                      <span className="text-zinc-500">Primary goal</span>
                      <span className="text-emerald-400/90">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
