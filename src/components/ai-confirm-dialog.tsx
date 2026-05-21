"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { FounderAction } from "@/lib/ai/types";

function describeAction(action: FounderAction): string {
  switch (action.type) {
    case "delete_brand":
      return `Delete brand "${action.brand_name}"`;
    case "merge_brands":
      return `Merge "${action.source_brand_name}" into "${action.target_brand_name}" and remove source`;
    case "delete_task":
      return `Delete task "${action.match_title}"`;
    case "delete_goal":
      return `Delete goal "${action.match_title}"`;
    default:
      return action.type;
  }
}

interface AiConfirmDialogProps {
  open: boolean;
  actions: FounderAction[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function AiConfirmDialog({
  open,
  actions,
  onConfirm,
  onCancel,
}: AiConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="border-white/[0.08] bg-[#0a0a0b] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm changes</DialogTitle>
          <p className="text-sm text-zinc-500">
            The assistant wants to run destructive actions. Review before
            applying.
          </p>
        </DialogHeader>
        <ul className="space-y-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
          {actions.map((a, i) => (
            <li key={i} className="text-sm text-zinc-200">
              {describeAction(a)}
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-500"
            onClick={onConfirm}
          >
            Apply {actions.length} action{actions.length === 1 ? "" : "s"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
