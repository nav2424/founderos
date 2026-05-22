import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { goalProgress, formatDate } from "@/lib/utils";
import {
  daysUntilDeadline,
  formatGoalValue,
  goalHorizonLabel,
} from "@/lib/goals";
import type { Goal } from "@/lib/types";
import { useFounderStore } from "@/store/use-founder-store";
import { cn } from "@/lib/utils";

interface GoalProgressCardProps {
  goal: Goal;
  onMarkDone?: () => void;
}

export function GoalProgressCard({ goal, onMarkDone }: GoalProgressCardProps) {
  const brands = useFounderStore((s) => s.brands);
  const brand = brands.find((b) => b.id === goal.brand_id);
  const progress = goalProgress(goal.current_value, goal.target_value);
  const days = daysUntilDeadline(goal.deadline);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-200 pr-1">{goal.title}</p>
          {brand && (
            <p className="text-xs text-zinc-500 mt-0.5">{brand.name}</p>
          )}
        </div>
        {goal.status === "active" && onMarkDone && (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 h-7 text-[10px] text-zinc-500 hover:text-zinc-200"
            onClick={onMarkDone}
          >
            Done
          </Button>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Badge variant="outline" className="text-[10px]">
          {goalHorizonLabel(goal.type)}
        </Badge>
        <Badge variant="secondary" className="text-[10px]">
          {goal.type}
        </Badge>
        {goal.target_metric && (
          <Badge variant="outline" className="text-[10px]">
            {goal.target_metric}
          </Badge>
        )}
        {goal.status === "completed" && (
          <Badge className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/20">
            Completed
          </Badge>
        )}
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
          <span>
            {formatGoalValue(goal.current_value, goal.target_metric)} →{" "}
            {formatGoalValue(goal.target_value, goal.target_metric)}
          </span>
          <span className="text-emerald-400/90">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
        {goal.deadline && (
          <p
            className={cn(
              "mt-2 text-[10px] font-mono",
              days !== null && days < 0 ? "text-amber-400" : "text-zinc-600"
            )}
          >
            Target: {formatDate(goal.deadline)}
            {days !== null && goal.status === "active" && (
              <> · {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}</>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
