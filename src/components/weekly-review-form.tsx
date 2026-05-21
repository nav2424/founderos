"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFounderStore } from "@/store/use-founder-store";
import { getWeekStart } from "@/lib/utils";
import { format, parseISO } from "date-fns";

const fields = [
  { key: "wins", label: "What were my wins this week?" },
  { key: "avoided", label: "What did I avoid?" },
  { key: "moved_forward", label: "What moved the business forward?" },
  { key: "bottlenecks", label: "What are the biggest bottlenecks?" },
  { key: "priorities_next_week", label: "What are my top 3 priorities next week?" },
  { key: "stop_doing", label: "What should I stop doing?" },
  { key: "delegate_later", label: "What should I delegate or systemize later?" },
  { key: "losses", label: "What didn't go well? (losses)" },
  { key: "lessons", label: "Key lessons learned" },
] as const;

type FieldKey = (typeof fields)[number]["key"];

export function WeeklyReviewForm() {
  const addWeeklyReview = useFounderStore((s) => s.addWeeklyReview);
  const weeklyReviews = useFounderStore((s) => s.weeklyReviews);
  const [values, setValues] = useState<Record<FieldKey, string>>(
    Object.fromEntries(fields.map((f) => [f.key, ""])) as Record<FieldKey, string>
  );
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addWeeklyReview({
      week_start: getWeekStart(),
      wins: values.wins || null,
      losses: values.losses || null,
      lessons: values.lessons || null,
      priorities_next_week: values.priorities_next_week || null,
      bottlenecks: values.bottlenecks || null,
      avoided: values.avoided || null,
      moved_forward: values.moved_forward || null,
      stop_doing: values.stop_doing || null,
      delegate_later: values.delegate_later || null,
    });
    setSaved(true);
    setValues(
      Object.fromEntries(fields.map((f) => [f.key, ""])) as Record<FieldKey, string>
    );
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <Label className="text-zinc-300">{label}</Label>
            <Textarea
              value={values[key]}
              onChange={(e) =>
                setValues((v) => ({ ...v, [key]: e.target.value }))
              }
              className="mt-1.5"
              rows={3}
              placeholder="Write freely..."
            />
          </div>
        ))}
        <Button type="submit" size="lg">
          {saved ? "Saved!" : "Save Weekly Review"}
        </Button>
      </form>

      {weeklyReviews.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-3">History</h3>
          <div className="space-y-3">
            {weeklyReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4"
              >
                <p className="text-sm font-medium text-zinc-200">
                  Week of{" "}
                  {format(parseISO(review.week_start), "MMM d, yyyy")}
                </p>
                {review.wins && (
                  <p className="mt-2 text-xs text-zinc-500">
                    <span className="text-emerald-400">Wins:</span>{" "}
                    {review.wins.slice(0, 120)}
                    {review.wins.length > 120 ? "…" : ""}
                  </p>
                )}
                {review.priorities_next_week && (
                  <p className="mt-1 text-xs text-zinc-500">
                    <span className="text-zinc-400">Next week:</span>{" "}
                    {review.priorities_next_week.slice(0, 120)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
