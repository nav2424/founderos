"use client";

import Link from "next/link";
import { ExternalLink, MapPin, Video, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  brandNameForItem,
  EVENT_TYPE_STYLES,
  formatEventRange,
  isValidMeetingUrl,
  type CalendarItem,
} from "@/lib/calendar";
import type { Brand, Reminder } from "@/lib/types";
import { useFounderStore } from "@/store/use-founder-store";

interface EventDetailProps {
  item: CalendarItem | null;
  brands: Brand[];
  reminders: Reminder[];
  onEdit: (reminder: Reminder) => void;
  onClose: () => void;
}

export function EventDetail({
  item,
  brands,
  reminders,
  onEdit,
  onClose,
}: EventDetailProps) {
  const completeReminder = useFounderStore((s) => s.completeReminder);
  const completeTask = useFounderStore((s) => s.completeTask);

  if (!item) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] p-8 text-center">
        <p className="text-sm text-zinc-500">Select an event or day</p>
      </div>
    );
  }

  const style =
    EVENT_TYPE_STYLES[item.eventType] ?? EVENT_TYPE_STYLES.reminder;
  const brand = brandNameForItem(item.brandId, brands);
  const reminder =
    item.reminderId && reminders.find((r) => r.id === item.reminderId);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
      <div>
        <span
          className={cn(
            "inline-block rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider",
            style.chip
          )}
        >
          {style.label}
        </span>
        <h3 className="mt-2 text-lg font-medium text-zinc-100">{item.title}</h3>
        <p className="text-sm text-zinc-500 mt-1">
          {formatEventRange(
            item.start.toISOString(),
            item.end?.toISOString() ?? null
          )}
        </p>
        {brand && <p className="text-xs text-zinc-600 mt-1">{brand}</p>}
      </div>

      {item.description && (
        <p className="text-sm text-zinc-400 whitespace-pre-wrap">
          {item.description}
        </p>
      )}

      {item.location && (
        <div className="flex items-start gap-2 text-sm text-zinc-400">
          <MapPin className="h-4 w-4 shrink-0 text-zinc-600" />
          {item.location}
        </div>
      )}

      {item.meetingUrl && isValidMeetingUrl(item.meetingUrl) && (
        <a
          href={item.meetingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600/90 hover:bg-violet-500 px-4 py-3 text-sm font-medium text-white transition-colors"
        >
          <Video className="h-4 w-4" />
          Join meeting
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </a>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        {item.source === "event" && reminder && !item.completed && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => completeReminder(reminder.id)}
            >
              <Check className="h-3.5 w-3.5" />
              Done
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(reminder)}>
              Edit
            </Button>
          </>
        )}
        {item.source === "task" && item.taskId && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => completeTask(item.taskId!)}
            >
              <Check className="h-3.5 w-3.5" />
              Complete task
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/tasks">Open tasks</Link>
            </Button>
          </>
        )}
        <Button size="sm" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
