export const TASK_STATUSES = [
  "Inbox",
  "To Do",
  "In Progress",
  "Waiting",
  "Done",
] as const;

export const TASK_PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;

export const GOAL_TYPES = ["Yearly", "Quarterly", "Monthly", "Weekly"] as const;

export const GOAL_METRICS = [
  "MRR",
  "Revenue",
  "Profit",
  "Customers",
  "Units sold",
  "Custom",
] as const;

export const LONG_TERM_GOAL_TYPES = ["Yearly", "Quarterly"] as const;
export const SHORT_TERM_GOAL_TYPES = ["Monthly", "Weekly"] as const;

export const IDEA_CATEGORIES = [
  "Content",
  "Product",
  "Marketing",
  "Wholesale",
  "Creator",
  "Operations",
  "Other",
] as const;

export const IDEA_STATUSES = [
  "Raw Idea",
  "Considering",
  "Testing",
  "Implemented",
  "Archived",
] as const;

export const CALENDAR_EVENT_TYPES = [
  { value: "meeting", label: "Meeting" },
  { value: "call", label: "Call" },
  { value: "reminder", label: "Reminder" },
  { value: "deadline", label: "Deadline" },
] as const;

export const KNOWLEDGE_CATEGORIES = [
  { value: "decision", label: "Strategic decision" },
  { value: "meeting_notes", label: "Meeting notes" },
  { value: "sop", label: "SOP / process" },
  { value: "team", label: "Team & roles" },
  { value: "hiring", label: "Hiring plan" },
  { value: "vendor", label: "Vendor / supplier" },
  { value: "product", label: "Product / formula" },
  { value: "manufacturing", label: "Manufacturing spec" },
  { value: "packaging", label: "Packaging" },
  { value: "brand_voice", label: "Brand voice" },
  { value: "creator", label: "Creator agreement" },
  { value: "retail", label: "Retail / wholesale terms" },
  { value: "pricing", label: "Pricing" },
  { value: "strategy", label: "Strategy" },
  { value: "finance", label: "Finance" },
  { value: "legal", label: "Legal" },
  { value: "other", label: "Other" },
] as const;

export const SYSTEM_LAYERS = [
  { value: "creator", label: "Creator program" },
  { value: "wholesale", label: "Wholesale" },
  { value: "manufacturing", label: "Manufacturing / R&D" },
  { value: "content", label: "Content engine" },
  { value: "hiring", label: "Hiring" },
  { value: "product_dev", label: "Product development" },
  { value: "finance", label: "Finance" },
  { value: "partnerships", label: "Partnerships" },
] as const;

export const NAV_ITEMS = [
  { href: "/assistant", label: "AI Assistant", icon: "Bot" },
  { href: "/memory", label: "Memory", icon: "Brain" },
  { href: "/today", label: "Today", icon: "Sun" },
  { href: "/portfolio", label: "Portfolio", icon: "Briefcase" },
  { href: "/brands", label: "Brands", icon: "Building2" },
  { href: "/tasks", label: "Tasks", icon: "CheckSquare" },
  { href: "/goals", label: "Goals", icon: "Target" },
  { href: "/calendar", label: "Calendar", icon: "Calendar" },
  { href: "/ideas", label: "Ideas", icon: "Lightbulb" },
  { href: "/kpis", label: "KPIs", icon: "BarChart3" },
  { href: "/playbooks", label: "Playbooks", icon: "BookOpen" },
  { href: "/weekly-review", label: "Weekly Review", icon: "ClipboardList" },
  { href: "/settings", label: "Settings", icon: "Settings" },
];
