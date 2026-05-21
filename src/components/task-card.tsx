import { CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelativeDate, isOverdue, priorityScore } from "@/lib/utils";
import type { Task } from "@/lib/types";
import { useFounderStore } from "@/store/use-founder-store";

interface TaskCardProps {
  task: Task;
  showBrand?: boolean;
  compact?: boolean;
}

export function TaskCard({ task, showBrand = true, compact }: TaskCardProps) {
  const brands = useFounderStore((s) => s.brands);
  const completeTask = useFounderStore((s) => s.completeTask);
  const brand = brands.find((b) => b.id === task.brand_id);
  const score = priorityScore(task.estimated_impact, task.effort_level);
  const overdue = isOverdue(task.due_date);

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-3 transition-colors hover:border-zinc-700",
        overdue && task.status !== "Done" && "border-red-500/30"
      )}
    >
      <button
        type="button"
        onClick={() => completeTask(task.id)}
        className="mt-0.5 shrink-0 text-zinc-500 hover:text-emerald-400"
        disabled={task.status === "Done"}
      >
        {task.status === "Done" ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium text-zinc-200",
            task.status === "Done" && "line-through text-zinc-500"
          )}
        >
          {task.title}
        </p>
        {!compact && task.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
            {task.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {showBrand && brand && (
            <Badge variant="outline" className="text-[10px]">
              {brand.name}
            </Badge>
          )}
          <Badge
            variant={
              task.priority === "Critical"
                ? "destructive"
                : task.priority === "High"
                  ? "warning"
                  : "secondary"
            }
            className="text-[10px]"
          >
            {task.priority}
          </Badge>
          {task.due_date && (
            <span
              className={cn(
                "text-[10px]",
                overdue ? "text-red-400" : "text-zinc-500"
              )}
            >
              {formatRelativeDate(task.due_date)}
            </span>
          )}
          <span className="text-[10px] text-emerald-500/80">
            ⚡ {score}
          </span>
        </div>
      </div>
    </div>
  );
}
