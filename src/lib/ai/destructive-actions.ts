import type { FounderAction } from "./types";

const DESTRUCTIVE_TYPES = new Set([
  "delete_brand",
  "merge_brands",
  "delete_task",
  "delete_goal",
]);

export function getDestructiveActions(
  actions: FounderAction[]
): FounderAction[] {
  return actions.filter((a) => DESTRUCTIVE_TYPES.has(a.type));
}

export function hasDestructiveActions(actions: FounderAction[]): boolean {
  return getDestructiveActions(actions).length > 0;
}
