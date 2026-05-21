"use client";

import { useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  countItems,
  pushAllLocalToSupabase,
} from "@/lib/supabase/data-sync";
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
    if (!isSupabaseConfigured()) {
      useFounderStore.setState({ hydrated: true });
      return;
    }

    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        useFounderStore.setState({ hydrated: true });
        return;
      }

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

      const remote = {
        brands: (brands.data ?? []) as Brand[],
        tasks: (tasks.data ?? []) as Task[],
        goals: (goals.data ?? []) as Goal[],
        ideas: (ideas.data ?? []) as Idea[],
        kpis: (kpis.data ?? []) as Kpi[],
        reminders: (reminders.data ?? []) as Reminder[],
        playbooks: (playbooks.data ?? []) as Playbook[],
        weeklyReviews: (reviews.data ?? []) as WeeklyReview[],
      };

      const remoteCount = countItems(remote);
      const local = useFounderStore.getState();
      const localCount = countItems(local);

      if (remoteCount > 0) {
        hydrateFromSupabase(remote);
      } else if (localCount > 0) {
        await pushAllLocalToSupabase(user.id, local);
        useFounderStore.setState({ hydrated: true });
      } else {
        useFounderStore.setState({ hydrated: true });
      }
    }

    function startSync() {
      if (useFounderStore.getState().hydrated) return;
      void load();
    }

    if (useFounderStore.persist.hasHydrated()) {
      startSync();
    }

    const unsub = useFounderStore.persist.onFinishHydration(() => {
      startSync();
    });

    return unsub;
  }, [hydrateFromSupabase, setUserId]);
}
