"use client";

import { useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useFounderStore } from "@/store/use-founder-store";
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

export function useSupabaseSync() {
  const hydrateFromSupabase = useFounderStore((s) => s.hydrateFromSupabase);
  const setUserId = useFounderStore((s) => s.setUserId);
  const hydrated = useFounderStore((s) => s.hydrated);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const [brands, tasks, goals, ideas, kpis, reminders, playbooks, reviews] =
        await Promise.all([
          supabase.from("brands").select("*"),
          supabase.from("tasks").select("*"),
          supabase.from("goals").select("*"),
          supabase.from("ideas").select("*"),
          supabase.from("kpis").select("*"),
          supabase.from("reminders").select("*"),
          supabase.from("playbooks").select("*"),
          supabase.from("weekly_reviews").select("*"),
        ]);

      if (brands.data && brands.data.length > 0) {
        hydrateFromSupabase({
          brands: brands.data as Brand[],
          tasks: (tasks.data ?? []) as Task[],
          goals: (goals.data ?? []) as Goal[],
          ideas: (ideas.data ?? []) as Idea[],
          kpis: (kpis.data ?? []) as Kpi[],
          reminders: (reminders.data ?? []) as Reminder[],
          playbooks: (playbooks.data ?? []) as Playbook[],
          weeklyReviews: (reviews.data ?? []) as WeeklyReview[],
        });
      }
    }

    if (!hydrated) load();
  }, [hydrateFromSupabase, setUserId, hydrated]);
}
