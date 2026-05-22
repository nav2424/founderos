import type { CalendarEventType, Reminder } from "./types";
import { DEFAULT_REMINDER_EXTRAS } from "./types";
import { normalizeReminder } from "./normalize-persist";

const META_MARKER = "\n__FOUNDEROS_CALENDAR__:";

interface CalendarMeta {
  event_type?: CalendarEventType;
  end_date?: string | null;
  meeting_url?: string | null;
  location?: string | null;
}

/** Parse datetime-local without UTC day shift. */
export function localDatetimeToStorage(value: string): string | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return null;
  const [, y, mo, d, h, mi] = match;
  const date = new Date(
    Number(y),
    Number(mo) - 1,
    Number(d),
    Number(h),
    Number(mi),
    0,
    0
  );
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function storageToLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}

export function packReminderDescription(reminder: Reminder): string | null {
  const meta: CalendarMeta = {
    event_type: reminder.event_type,
    end_date: reminder.end_date,
    meeting_url: reminder.meeting_url,
    location: reminder.location,
  };
  const hasMeta =
    meta.event_type !== "reminder" ||
    meta.end_date ||
    meta.meeting_url ||
    meta.location;

  let userDesc = reminder.description;
  if (userDesc?.includes(META_MARKER)) {
    userDesc = userDesc.split(META_MARKER)[0]?.trim() || null;
  }

  if (!hasMeta) return userDesc;

  const payload = `${userDesc ?? ""}${META_MARKER}${JSON.stringify(meta)}`;
  return payload.trim() || null;
}

function unpackMeta(description: string | null): {
  description: string | null;
  meta: CalendarMeta;
} {
  if (!description?.includes(META_MARKER)) {
    return { description, meta: {} };
  }
  const [userDesc, json] = description.split(META_MARKER);
  try {
    const meta = JSON.parse(json) as CalendarMeta;
    return {
      description: userDesc?.trim() || null,
      meta,
    };
  } catch {
    return { description, meta: {} };
  }
}

/** Normalize reminder from DB row (Supabase may lack v2 columns). */
export function normalizeReminderFromDb(
  row: Partial<Reminder> & Record<string, unknown>
): Reminder {
  const { description, meta } = unpackMeta(
    (row.description as string | null) ?? null
  );

  return normalizeReminder({
    ...DEFAULT_REMINDER_EXTRAS,
    id: row.id as string,
    title: row.title as string,
    description,
    brand_id: (row.brand_id as string | null) ?? null,
    due_date: row.due_date as string,
    end_date:
      (row.end_date as string | null) ?? meta.end_date ?? null,
    event_type:
      (row.event_type as CalendarEventType) ??
      meta.event_type ??
      "reminder",
    meeting_url:
      (row.meeting_url as string | null) ?? meta.meeting_url ?? null,
    location: (row.location as string | null) ?? meta.location ?? null,
    repeat_frequency: (row.repeat_frequency as string | null) ?? null,
    completed: Boolean(row.completed),
    created_at: (row.created_at as string) ?? undefined,
    user_id: row.user_id as string | undefined,
  });
}

export function mergeById<T extends { id: string }>(
  local: T[],
  remote: T[],
  normalize: (item: T) => T
): T[] {
  const map = new Map<string, T>();
  for (const item of remote) {
    map.set(item.id, normalize(item));
  }
  for (const item of local) {
    map.set(item.id, normalize(item));
  }
  return Array.from(map.values());
}
