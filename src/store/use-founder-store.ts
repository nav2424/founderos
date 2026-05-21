"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EMPTY_FOUNDER_DATA } from "@/lib/empty-state";
import type {
  Brand,
  Goal,
  Idea,
  Kpi,
  Playbook,
  Reminder,
  Task,
  WeeklyReview,
} from "@/lib/types";
import { founderSync } from "@/lib/supabase/data-sync";
import { generateId, priorityScore } from "@/lib/utils";

interface FounderState {
  brands: Brand[];
  tasks: Task[];
  goals: Goal[];
  ideas: Idea[];
  kpis: Kpi[];
  reminders: Reminder[];
  playbooks: Playbook[];
  weeklyReviews: WeeklyReview[];
  hydrated: boolean;
  userId: string | null;

  setUserId: (id: string | null) => void;
  hydrateFromSupabase: (data: Partial<FounderState>) => void;
  clearAllData: () => void;

  addBrand: (brand: Omit<Brand, "id" | "created_at">) => Brand;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;

  addTask: (task: Omit<Task, "id" | "created_at" | "completed_at">) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;

  addGoal: (goal: Omit<Goal, "id" | "created_at">) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  addIdea: (idea: Omit<Idea, "id" | "created_at">) => Idea;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  convertIdeaToTask: (ideaId: string) => Task | null;

  addKpi: (kpi: Omit<Kpi, "id">) => Kpi;
  updateKpi: (id: string, updates: Partial<Kpi>) => void;
  deleteKpi: (id: string) => void;

  addReminder: (reminder: Omit<Reminder, "id">) => Reminder;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;

  addPlaybook: (pb: Omit<Playbook, "id" | "created_at" | "updated_at">) => Playbook;
  updatePlaybook: (id: string, updates: Partial<Playbook>) => void;
  deletePlaybook: (id: string) => void;

  addWeeklyReview: (review: Omit<WeeklyReview, "id" | "created_at">) => WeeklyReview;
}

export const useFounderStore = create<FounderState>()(
  persist(
    (set, get) => ({
      ...EMPTY_FOUNDER_DATA,
      hydrated: false,
      userId: null,

      setUserId: (id) => set({ userId: id }),

      hydrateFromSupabase: (data) =>
        set({
          ...data,
          hydrated: true,
        }),

      clearAllData: () => set({ ...EMPTY_FOUNDER_DATA, hydrated: true }),

      addBrand: (brand) => {
        const newBrand: Brand = {
          ...brand,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        set((s) => ({ brands: [...s.brands, newBrand] }));
        founderSync.brand.upsert(newBrand, get().userId);
        return newBrand;
      },

      updateBrand: (id, updates) => {
        set((s) => ({
          brands: s.brands.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        }));
        const updated = get().brands.find((b) => b.id === id);
        if (updated) founderSync.brand.upsert(updated, get().userId);
      },

      deleteBrand: (id) => {
        const userId = get().userId;
        set((s) => ({
          brands: s.brands.filter((b) => b.id !== id),
          tasks: s.tasks.map((t) =>
            t.brand_id === id ? { ...t, brand_id: null } : t
          ),
          goals: s.goals.map((g) =>
            g.brand_id === id ? { ...g, brand_id: null } : g
          ),
          ideas: s.ideas.map((i) =>
            i.brand_id === id ? { ...i, brand_id: null } : i
          ),
          kpis: s.kpis.map((k) =>
            k.brand_id === id ? { ...k, brand_id: null } : k
          ),
          reminders: s.reminders.map((r) =>
            r.brand_id === id ? { ...r, brand_id: null } : r
          ),
          playbooks: s.playbooks.map((p) =>
            p.brand_id === id ? { ...p, brand_id: null } : p
          ),
        }));
        founderSync.brand.delete(id, userId);
      },

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: generateId(),
          created_at: new Date().toISOString(),
          completed_at: null,
        };
        set((s) => ({ tasks: [...s.tasks, newTask] }));
        founderSync.task.upsert(newTask, get().userId);
        return newTask;
      },

      updateTask: (id, updates) => {
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
        const updated = get().tasks.find((t) => t.id === id);
        if (updated) founderSync.task.upsert(updated, get().userId);
      },

      deleteTask: (id) => {
        const userId = get().userId;
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
        founderSync.task.delete(id, userId);
      },

      completeTask: (id) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: "Done" as const,
                  completed_at: new Date().toISOString(),
                }
              : t
          ),
        }));
        const updated = get().tasks.find((t) => t.id === id);
        if (updated) founderSync.task.upsert(updated, get().userId);
      },

      addGoal: (goal) => {
        const newGoal: Goal = {
          ...goal,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        set((s) => ({ goals: [...s.goals, newGoal] }));
        founderSync.goal.upsert(newGoal, get().userId);
        return newGoal;
      },

      updateGoal: (id, updates) => {
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        }));
        const updated = get().goals.find((g) => g.id === id);
        if (updated) founderSync.goal.upsert(updated, get().userId);
      },

      deleteGoal: (id) => {
        const userId = get().userId;
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
        founderSync.goal.delete(id, userId);
      },

      addIdea: (idea) => {
        const newIdea: Idea = {
          ...idea,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        set((s) => ({ ideas: [...s.ideas, newIdea] }));
        founderSync.idea.upsert(newIdea, get().userId);
        return newIdea;
      },

      updateIdea: (id, updates) => {
        set((s) => ({
          ideas: s.ideas.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));
        const updated = get().ideas.find((i) => i.id === id);
        if (updated) founderSync.idea.upsert(updated, get().userId);
      },

      deleteIdea: (id) => {
        const userId = get().userId;
        set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) }));
        founderSync.idea.delete(id, userId);
      },

      convertIdeaToTask: (ideaId) => {
        const idea = get().ideas.find((i) => i.id === ideaId);
        if (!idea) return null;
        const task = get().addTask({
          title: idea.title,
          description: idea.description,
          brand_id: idea.brand_id,
          category: idea.category,
          status: "Inbox",
          priority: idea.priority as Task["priority"],
          due_date: null,
          reminder_date: null,
          estimated_impact: idea.estimated_impact,
          effort_level: idea.effort_level,
        });
        get().updateIdea(ideaId, { status: "Implemented" });
        return task;
      },

      addKpi: (kpi) => {
        const newKpi: Kpi = { ...kpi, id: generateId() };
        set((s) => ({ kpis: [...s.kpis, newKpi] }));
        founderSync.kpi.upsert(newKpi, get().userId);
        return newKpi;
      },

      updateKpi: (id, updates) => {
        set((s) => ({
          kpis: s.kpis.map((k) => (k.id === id ? { ...k, ...updates } : k)),
        }));
        const updated = get().kpis.find((k) => k.id === id);
        if (updated) founderSync.kpi.upsert(updated, get().userId);
      },

      deleteKpi: (id) => {
        const userId = get().userId;
        set((s) => ({ kpis: s.kpis.filter((k) => k.id !== id) }));
        founderSync.kpi.delete(id, userId);
      },

      addReminder: (reminder) => {
        const newReminder: Reminder = { ...reminder, id: generateId() };
        set((s) => ({ reminders: [...s.reminders, newReminder] }));
        founderSync.reminder.upsert(newReminder, get().userId);
        return newReminder;
      },

      updateReminder: (id, updates) => {
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
        const updated = get().reminders.find((r) => r.id === id);
        if (updated) founderSync.reminder.upsert(updated, get().userId);
      },

      deleteReminder: (id) => {
        const userId = get().userId;
        set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) }));
        founderSync.reminder.delete(id, userId);
      },

      completeReminder: (id) => {
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id ? { ...r, completed: true } : r
          ),
        }));
        const updated = get().reminders.find((r) => r.id === id);
        if (updated) founderSync.reminder.upsert(updated, get().userId);
      },

      addPlaybook: (pb) => {
        const now = new Date().toISOString();
        const newPb: Playbook = {
          ...pb,
          id: generateId(),
          created_at: now,
          updated_at: now,
        };
        set((s) => ({ playbooks: [...s.playbooks, newPb] }));
        founderSync.playbook.upsert(newPb, get().userId);
        return newPb;
      },

      updatePlaybook: (id, updates) => {
        set((s) => ({
          playbooks: s.playbooks.map((p) =>
            p.id === id
              ? { ...p, ...updates, updated_at: new Date().toISOString() }
              : p
          ),
        }));
        const updated = get().playbooks.find((p) => p.id === id);
        if (updated) founderSync.playbook.upsert(updated, get().userId);
      },

      deletePlaybook: (id) => {
        const userId = get().userId;
        set((s) => ({ playbooks: s.playbooks.filter((p) => p.id !== id) }));
        founderSync.playbook.delete(id, userId);
      },

      addWeeklyReview: (review) => {
        const newReview: WeeklyReview = {
          ...review,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        set((s) => ({ weeklyReviews: [newReview, ...s.weeklyReviews] }));
        founderSync.weeklyReview.upsert(newReview, get().userId);
        return newReview;
      },
    }),
    {
      name: "founderos-v2",
      partialize: (state) => ({
        brands: state.brands,
        tasks: state.tasks,
        goals: state.goals,
        ideas: state.ideas,
        kpis: state.kpis,
        reminders: state.reminders,
        playbooks: state.playbooks,
        weeklyReviews: state.weeklyReviews,
      }),
    }
  )
);

export function getSortedByPriority<T extends { estimated_impact: number; effort_level: number }>(
  items: T[]
): T[] {
  return [...items].sort(
    (a, b) =>
      priorityScore(b.estimated_impact, b.effort_level) -
      priorityScore(a.estimated_impact, a.effort_level)
  );
}
