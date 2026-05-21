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
}

export interface Task {
  id: string;
  user_id?: string;
  title: string;
  description: string | null;
  brand_id: string | null;
  category: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  reminder_date: string | null;
  estimated_impact: number;
  effort_level: number;
  created_at: string;
  completed_at: string | null;
}

export interface Goal {
  id: string;
  user_id?: string;
  title: string;
  description: string | null;
  brand_id: string | null;
  type: GoalType;
  target_metric: string | null;
  current_value: number;
  target_value: number;
  deadline: string | null;
  status: GoalStatus;
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

export interface Reminder {
  id: string;
  user_id?: string;
  title: string;
  description: string | null;
  brand_id: string | null;
  due_date: string;
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

export type QuickCaptureType = "task" | "idea" | "reminder" | "goal";
