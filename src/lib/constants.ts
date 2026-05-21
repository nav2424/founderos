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

export const NAV_ITEMS = [
  { href: "/assistant", label: "AI Assistant", icon: "Bot" },
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
