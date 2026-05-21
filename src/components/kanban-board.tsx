"use client";

import { TASK_STATUSES } from "@/lib/constants";
import type { Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "./task-card";
import { useFounderStore } from "@/store/use-founder-store";

interface KanbanBoardProps {
  tasks: Task[];
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const updateTask = useFounderStore((s) => s.updateTask);

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {TASK_STATUSES.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        return (
          <div
            key={status}
            className="flex min-w-[260px] flex-1 flex-col rounded-xl border border-zinc-800/60 bg-zinc-900/20"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const taskId = e.dataTransfer.getData("taskId");
              if (taskId) updateTask(taskId, { status: status as TaskStatus });
            }}
          >
            <div className="border-b border-zinc-800/60 px-3 py-2.5">
              <span className="text-xs font-medium text-zinc-400">{status}</span>
              <span className="ml-2 text-xs text-zinc-600">
                {columnTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 p-2 min-h-[120px]">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("taskId", task.id)
                  }
                  className="cursor-grab active:cursor-grabbing"
                >
                  <TaskCard task={task} compact />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
