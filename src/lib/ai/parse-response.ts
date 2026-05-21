import type { AssistantResponse, FounderAction } from "./types";

const ACTION_TYPES = new Set([
  "create_brand",
  "create_task",
  "create_goal",
  "create_idea",
  "create_kpi",
  "create_reminder",
  "create_playbook",
  "create_weekly_review",
  "complete_task",
  "update_task",
  "delete_task",
  "complete_reminder",
  "delete_reminder",
  "update_goal",
  "delete_goal",
  "delete_idea",
  "delete_brand",
  "merge_brands",
]);

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  return trimmed;
}

export function parseAssistantResponse(raw: string): AssistantResponse {
  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(raw));
  } catch {
    return {
      reply: raw.trim() || "I couldn't parse a structured response. Try again.",
      actions: [],
    };
  }

  if (!parsed || typeof parsed !== "object") {
    return { reply: "Invalid response format.", actions: [] };
  }

  const obj = parsed as Record<string, unknown>;
  const reply =
    typeof obj.reply === "string" ? obj.reply : "Done.";
  const actions: FounderAction[] = [];

  if (Array.isArray(obj.actions)) {
    for (const item of obj.actions) {
      if (
        item &&
        typeof item === "object" &&
        "type" in item &&
        typeof (item as { type: string }).type === "string" &&
        ACTION_TYPES.has((item as { type: string }).type)
      ) {
        actions.push(item as FounderAction);
      }
    }
  }

  return { reply, actions };
}
