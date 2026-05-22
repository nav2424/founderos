export type TaskStatus = "Inbox" | "To Do" | "In Progress" | "Waiting" | "Done";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";
export type GoalType = "Yearly" | "Quarterly" | "Monthly" | "Weekly";
export type GoalStatus = "active" | "completed" | "paused";
export type KpiPeriod = "Daily" | "Weekly" | "Monthly";
export type IdeaCategory =
  | "Content"
  | "Product"
  | "Marketing"
  | "Wholesale"
  | "Creator"
  | "Operations"
  | "Other";
export type IdeaStatus =
  | "Raw Idea"
  | "Considering"
  | "Testing"
  | "Implemented"
  | "Archived";

export type TaskRecurrence = "none" | "daily" | "weekly" | "monthly";

export interface Brand {
  id: string;
  user_id?: string;
  name: string;
  description: string | null;
  stage: string;
  monthly_revenue: number;
  priority_level: number;
  categories: string[];
  created_at: string;
  /** AI & strategy context */
  brief: string | null;
  positioning: string | null;
  icp: string | null;
  constraints: string | null;
  notes: string | null;
  notion_url: string | null;
}

export interface Task {
  id: string;
  user_id?: string;
  title: string;
  description: string | null;
  brand_id: string | null;
  goal_id: string | null;
  category: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  reminder_date: string | null;
  estimated_impact: number;
  effort_level: number;
  recurrence: TaskRecurrence;
  focus_today: boolean;
  created_at: string;
  completed_at: string | null;
}

export interface Goal {
  id: string;
  user_id?: string;
  title: string;
  description: string | null;
  brand_id: string | null;
  parent_goal_id: string | null;
  type: GoalType;
  target_metric: string | null;
  current_value: number;
  target_value: number;
  deadline: string | null;
  status: GoalStatus;
  created_at: string;
}

export interface Milestone {
  id: string;
  user_id?: string;
  brand_id: string;
  goal_id: string | null;
  title: string;
  description: string | null;
  due_date: string;
  status: "pending" | "completed";
  created_at: string;
}

export interface MrrEntry {
  id: string;
  user_id?: string;
  brand_id: string;
  amount: number;
  period: "weekly" | "monthly";
  recorded_at: string;
  notes: string | null;
}

export interface BrandFinance {
  id: string;
  user_id?: string;
  brand_id: string;
  month: string;
  revenue: number;
  cogs: number;
  ad_spend: number;
  notes: string | null;
}

export interface Contact {
  id: string;
  user_id?: string;
  brand_id: string;
  name: string;
  company: string | null;
  email: string | null;
  status: string;
  next_follow_up: string | null;
  notes: string | null;
  created_at: string;
}

export interface Kpi {
  id: string;
  user_id?: string;
  brand_id: string | null;
  name: string;
  value: number;
  target_value: number;
  period: KpiPeriod;
  date: string;
  notes: string | null;
  created_at?: string;
}

export interface Idea {
  id: string;
  user_id?: string;
  title: string;
  description: string | null;
  brand_id: string | null;
  category: IdeaCategory;
  priority: string;
  status: IdeaStatus;
  estimated_impact: number;
  effort_level: number;
  created_at: string;
}

export type CalendarEventType =
  | "reminder"
  | "meeting"
  | "call"
  | "deadline";

export interface Reminder {
  id: string;
  user_id?: string;
  title: string;
  description: string | null;
  brand_id: string | null;
  due_date: string;
  end_date: string | null;
  event_type: CalendarEventType;
  meeting_url: string | null;
  location: string | null;
  repeat_frequency: string | null;
  completed: boolean;
  created_at?: string;
}

export interface Playbook {
  id: string;
  user_id?: string;
  title: string;
  brand_id: string | null;
  category: string | null;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export interface WeeklyReview {
  id: string;
  user_id?: string;
  week_start: string;
  wins: string | null;
  losses: string | null;
  lessons: string | null;
  priorities_next_week: string | null;
  bottlenecks: string | null;
  avoided: string | null;
  moved_forward: string | null;
  stop_doing: string | null;
  delegate_later: string | null;
  created_at: string;
}

export type KnowledgeCategory =
  | "sop"
  | "team"
  | "hiring"
  | "vendor"
  | "product"
  | "manufacturing"
  | "packaging"
  | "brand_voice"
  | "creator"
  | "retail"
  | "pricing"
  | "meeting_notes"
  | "decision"
  | "strategy"
  | "finance"
  | "legal"
  | "other";

export type SystemLayer =
  | "creator"
  | "wholesale"
  | "manufacturing"
  | "content"
  | "hiring"
  | "product_dev"
  | "finance"
  | "partnerships";

export interface KnowledgeEntry {
  id: string;
  user_id?: string;
  title: string;
  content: string;
  brand_id: string | null;
  system: SystemLayer | null;
  category: KnowledgeCategory;
  tags: string[];
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface FounderProfile {
  priorities: string | null;
  focus_themes: string | null;
  energy_notes: string | null;
  strategic_goals: string | null;
  deep_work_blocks: string | null;
  updated_at: string | null;
}

export const DEFAULT_FOUNDER_PROFILE: FounderProfile = {
  priorities: null,
  focus_themes: null,
  energy_notes: null,
  strategic_goals: null,
  deep_work_blocks: null,
  updated_at: null,
};

export type QuickCaptureType = "task" | "idea" | "reminder" | "goal";

export const DEFAULT_BRAND_CONTEXT = {
  brief: null,
  positioning: null,
  icp: null,
  constraints: null,
  notes: null,
  notion_url: null,
} as const;

export const DEFAULT_TASK_EXTRAS = {
  goal_id: null,
  recurrence: "none" as TaskRecurrence,
  focus_today: false,
};

export const DEFAULT_REMINDER_EXTRAS = {
  end_date: null,
  event_type: "reminder" as CalendarEventType,
  meeting_url: null,
  location: null,
};
