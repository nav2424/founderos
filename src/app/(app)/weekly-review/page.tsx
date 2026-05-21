"use client";

import { AppShell } from "@/components/layout/app-shell";
import { WeeklyReviewForm } from "@/components/weekly-review-form";

export default function WeeklyReviewPage() {
  return (
    <AppShell
      title="Weekly Review"
      subtitle="Reflect, learn, and set next week's priorities"
    >
      <WeeklyReviewForm />
    </AppShell>
  );
}
