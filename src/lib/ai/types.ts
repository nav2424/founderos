import type {
  FounderProfile,
  GoalStatus,
  GoalType,
  IdeaCategory,
  IdeaStatus,
  KnowledgeCategory,
  KpiPeriod,
  SystemLayer,
  TaskPriority,
  TaskStatus,
} from "@/lib/types";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface WorkspaceContext {
  brands: {
    id: string;
    name: string;
    stage: string;
    label: string;
    monthly_revenue?: number;
    brief?: string | null;
    positioning?: string | null;
    icp?: string | null;
    constraints?: string | null;
    notes?: string | null;
  }[];
  tasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    brand_name: string | null;
    due_date: string | null;
    focus_today?: boolean;
  }[];
  goals: {
    id: string;
    title: string;
    type: string;
    status: string;
    brand_name: string | null;
    target_metric?: string | null;
    current_value?: number;
    target_value?: number;
    deadline?: string | null;
  }[];
  ideas: { id: string; title: string; status: string; brand_name: string | null }[];
  kpis: {
    id: string;
    name: string;
    value: number;
    target_value?: number;
    brand_name: string | null;
  }[];
  reminders: {
    id: string;
    title: string;
    due_date: string;
    completed: boolean;
    brand_name: string | null;
    event_type?: string;
  }[];
  playbooks: { id: string; title: string; brand_name: string | null }[];
  weekly_reviews: {
    id: string;
    week_start: string;
    wins?: string | null;
    bottlenecks?: string | null;
    priorities_next_week?: string | null;
  }[];
}

export interface FounderContext {
  workspace: WorkspaceContext;
  founder_profile: FounderProfile;
  recalled_memory: {
    id: string;
    title: string;
    category: string;
    brand_name: string | null;
    system: string | null;
    excerpt: string;
    relevance: number;
  }[];
  memory_index: {
    total: number;
    by_brand: Record<string, number>;
    by_category: Record<string, number>;
  };
  operating_snapshot: {
    bottlenecks: { title: string; body: string; tone: string }[];
    focus_tasks: { title: string; brand: string | null; score: number }[];
    overdue_count: number;
    active_goal_count: number;
    brands_summary: {
      name: string;
      mrr: number;
      stage: string;
      primary_goal_pct: number | null;
    }[];
    upcoming_meetings: { title: string; when: string; brand: string | null }[];
  };
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
      brand_stage?: string | null;
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
      brand_stage?: string | null;
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
      brand_stage?: string | null;
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
      brand_stage?: string | null;
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
      brand_stage?: string | null;
      due_date?: string;
      end_date?: string | null;
      event_type?: "reminder" | "meeting" | "call" | "deadline";
      meeting_url?: string | null;
      location?: string | null;
      repeat_frequency?: string | null;
    }
  | {
      type: "create_playbook";
      title: string;
      brand_name?: string | null;
      brand_stage?: string | null;
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
      brand_stage?: string | null;
    }
  | { type: "delete_task"; match_title: string }
  | { type: "complete_reminder"; match_title: string }
  | { type: "delete_reminder"; match_title: string }
  | {
      type: "update_goal";
      match_title: string;
      brand_name?: string | null;
      brand_stage?: string | null;
      current_value?: number;
      target_value?: number;
      status?: GoalStatus;
    }
  | { type: "delete_goal"; match_title: string }
  | { type: "delete_idea"; match_title: string }
  | { type: "delete_brand"; brand_name: string; stage?: string }
  | {
      type: "merge_brands";
      source_brand_name: string;
      source_stage?: string;
      target_brand_name: string;
      target_stage?: string;
      only_active_tasks?: boolean;
      only_active_goals?: boolean;
    }
  | {
      type: "create_knowledge";
      title: string;
      content: string;
      category?: KnowledgeCategory;
      brand_name?: string | null;
      brand_stage?: string | null;
      system?: SystemLayer | null;
      tags?: string[];
      source?: string | null;
    }
  | {
      type: "update_knowledge";
      match_title: string;
      title?: string;
      content?: string;
      category?: KnowledgeCategory;
      tags?: string[];
    }
  | { type: "delete_knowledge"; match_title: string }
  | {
      type: "update_founder_profile";
      priorities?: string | null;
      focus_themes?: string | null;
      energy_notes?: string | null;
      strategic_goals?: string | null;
      deep_work_blocks?: string | null;
    }
  | {
      type: "update_brand_context";
      brand_name: string;
      brand_stage?: string;
      brief?: string | null;
      positioning?: string | null;
      icp?: string | null;
      constraints?: string | null;
      notes?: string | null;
    };

export interface AssistantResponse {
  reply: string;
  actions: FounderAction[];
}

export interface ActionResult {
  action: FounderAction;
  success: boolean;
  message: string;
}
