import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { goalProgress } from "@/lib/utils";
import type { Goal } from "@/lib/types";
import { useFounderStore } from "@/store/use-founder-store";

interface GoalProgressCardProps {
  goal: Goal;
}

export function GoalProgressCard({ goal }: GoalProgressCardProps) {
  const brands = useFounderStore((s) => s.brands);
  const brand = brands.find((b) => b.id === goal.brand_id);
  const progress = goalProgress(goal.current_value, goal.target_value);

  return (
    <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-zinc-200">{goal.title}</p>
          {brand && (
            <p className="text-xs text-zinc-500 mt-0.5">{brand.name}</p>
          )}
        </div>
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          {goal.type}
        </Badge>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
          <span>
            {goal.current_value.toLocaleString()} /{" "}
            {goal.target_value.toLocaleString()}
            {goal.target_metric && ` ${goal.target_metric}`}
          </span>
          <span className="text-emerald-400">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    </div>
  );
}
