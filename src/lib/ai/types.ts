import type {
  GoalStatus,
  GoalType,
  IdeaCategory,
  IdeaStatus,
  KpiPeriod,
  TaskPriority,
  TaskStatus,
} from "@/lib/types";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface WorkspaceContext {
  brands: { id: string; name: string; stage: string }[];
  tasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    brand_name: string | null;
    due_date: string | null;
  }[];
  goals: {
    id: string;
    title: string;
    type: string;
    status: string;
    brand_name: string | null;
  }[];
  ideas: { id: string; title: string; status: string; brand_name: string | null }[];
  kpis: { id: string; name: string; value: number; brand_name: string | null }[];
  reminders: {
    id: string;
    title: string;
    due_date: string;
    completed: boolean;
    brand_name: string | null;
  }[];
  playbooks: { id: string; title: string; brand_name: string | null }[];
  weekly_reviews: { id: string; week_start: string }[];
}

export type FounderAction =
  | {
      type: "create_brand";
      name: string;
      description?: string | null;
      stage?: string;
      monthly_revenue?: number;
      categories?: string[];
    }
  | {
      type: "create_task";
      title: string;
      description?: string | null;
      brand_name?: string | null;
      category?: string | null;
      status?: TaskStatus;
      priority?: TaskPriority;
      due_date?: string | null;
      estimated_impact?: number;
      effort_level?: number;
    }
  | {
      type: "create_goal";
      title: string;
      description?: string | null;
      brand_name?: string | null;
      goal_type?: GoalType;
      target_metric?: string | null;
      current_value?: number;
      target_value?: number;
      deadline?: string | null;
      status?: GoalStatus;
    }
  | {
      type: "create_idea";
      title: string;
      description?: string | null;
      brand_name?: string | null;
      category?: IdeaCategory;
      status?: IdeaStatus;
      priority?: string;
      estimated_impact?: number;
      effort_level?: number;
    }
  | {
      type: "create_kpi";
      name: string;
      brand_name?: string | null;
      value?: number;
      target_value?: number;
      period?: KpiPeriod;
      date?: string;
      notes?: string | null;
    }
  | {
      type: "create_reminder";
      title: string;
      description?: string | null;
      brand_name?: string | null;
      due_date?: string;
      repeat_frequency?: string | null;
    }
  | {
      type: "create_playbook";
      title: string;
      brand_name?: string | null;
      category?: string | null;
      content?: string | null;
    }
  | {
      type: "create_weekly_review";
      week_start?: string;
      wins?: string | null;
      losses?: string | null;
      lessons?: string | null;
      priorities_next_week?: string | null;
      bottlenecks?: string | null;
      avoided?: string | null;
      moved_forward?: string | null;
      stop_doing?: string | null;
      delegate_later?: string | null;
    }
  | { type: "complete_task"; match_title: string }
  | {
      type: "update_task";
      match_title: string;
      title?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      due_date?: string | null;
      brand_name?: string | null;
    }
  | { type: "delete_task"; match_title: string }
  | { type: "complete_reminder"; match_title: string }
  | { type: "delete_reminder"; match_title: string }
  | {
      type: "update_goal";
      match_title: string;
      current_value?: number;
      target_value?: number;
      status?: GoalStatus;
    }
  | { type: "delete_goal"; match_title: string }
  | { type: "delete_idea"; match_title: string };

export interface AssistantResponse {
  reply: string;
  actions: FounderAction[];
}

export interface ActionResult {
  action: FounderAction;
  success: boolean;
  message: string;
}
