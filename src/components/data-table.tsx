"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import {
  cn,
  formatRelativeDate,
  isOverdue,
  priorityScore,
} from "@/lib/utils";
import type { Task } from "@/lib/types";
import { useFounderStore } from "@/store/use-founder-store";

interface DataTableProps {
  tasks: Task[];
}

export function DataTable({ tasks }: DataTableProps) {
  const brands = useFounderStore((s) => s.brands);
  const completeTask = useFounderStore((s) => s.completeTask);

  if (tasks.length === 0) {
    return (
      <p className="text-center py-12 text-sm text-zinc-500">No tasks match filters</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
            <th className="p-3 font-medium">Task</th>
            <th className="p-3 font-medium hidden sm:table-cell">Brand</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium">Priority</th>
            <th className="p-3 font-medium hidden md:table-cell">Due</th>
            <th className="p-3 font-medium hidden lg:table-cell">Score</th>
            <th className="p-3 w-10" />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const brand = brands.find((b) => b.id === task.brand_id);
            const score = priorityScore(
              task.estimated_impact,
              task.effort_level
            );
            return (
              <tr
                key={task.id}
                className={cn(
                  "border-b border-zinc-800/50 hover:bg-zinc-900/40",
                  isOverdue(task.due_date) &&
                    task.status !== "Done" &&
                    "bg-red-500/5"
                )}
              >
                <td className="p-3">
                  <span
                    className={cn(
                      "font-medium text-zinc-200",
                      task.status === "Done" && "line-through text-zinc-500"
                    )}
                  >
                    {task.title}
                  </span>
                </td>
                <td className="p-3 hidden sm:table-cell text-zinc-500">
                  {brand?.name ?? "—"}
                </td>
                <td className="p-3">
                  <Badge variant="secondary" className="text-[10px]">
                    {task.status}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge
                    variant={
                      task.priority === "Critical"
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {task.priority}
                  </Badge>
                </td>
                <td
                  className={cn(
                    "p-3 hidden md:table-cell",
                    isOverdue(task.due_date) ? "text-red-400" : "text-zinc-500"
                  )}
                >
                  {formatRelativeDate(task.due_date)}
                </td>
                <td className="p-3 hidden lg:table-cell text-emerald-400">
                  {score}
                </td>
                <td className="p-3">
                  {task.status !== "Done" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => completeTask(task.id)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
