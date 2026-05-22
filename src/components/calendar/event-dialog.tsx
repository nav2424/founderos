"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CALENDAR_EVENT_TYPES } from "@/lib/constants";
import {
  localDatetimeToStorage,
  storageToLocalInput,
} from "@/lib/reminder-sync";
import type { Brand, CalendarEventType, Reminder } from "@/lib/types";
import { useFounderStore } from "@/store/use-founder-store";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brands: Brand[];
  initialDate?: Date | null;
  editing?: Reminder | null;
  onSaved?: (dueDateIso: string) => void;
}

export function EventDialog({
  open,
  onOpenChange,
  brands,
  initialDate,
  editing,
  onSaved,
}: EventDialogProps) {
  const addReminder = useFounderStore((s) => s.addReminder);
  const updateReminder = useFounderStore((s) => s.updateReminder);
  const deleteReminder = useFounderStore((s) => s.deleteReminder);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [eventType, setEventType] = useState<CalendarEventType>("meeting");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [location, setLocation] = useState("");
  const [brandId, setBrandId] = useState("none");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setSaveError(null);
    if (!open) return;
    if (editing) {
      setTitle(editing.title);
      setDescription(editing.description ?? "");
      setStart(storageToLocalInput(editing.due_date));
      setEnd(storageToLocalInput(editing.end_date));
      setEventType(editing.event_type);
      setMeetingUrl(editing.meeting_url ?? "");
      setLocation(editing.location ?? "");
      setBrandId(editing.brand_id ?? "none");
    } else {
      setTitle("");
      setDescription("");
      setEventType("meeting");
      setMeetingUrl("");
      setLocation("");
      setBrandId("none");
      if (initialDate) {
        const d = initialDate;
        const pad = (n: number) => String(n).padStart(2, "0");
        setStart(
          `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T09:00`
        );
        setEnd(
          `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T10:00`
        );
      } else {
        const now = new Date();
        now.setMinutes(0, 0, 0);
        const later = new Date(now.getTime() + 3600000);
        setStart(storageToLocalInput(now.toISOString()));
        setEnd(storageToLocalInput(later.toISOString()));
      }
    }
  }, [open, editing, initialDate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    if (!title.trim() || !start) {
      setSaveError("Title and start time are required.");
      return;
    }

    const dueDate = localDatetimeToStorage(start);
    if (!dueDate) {
      setSaveError("Invalid start date or time.");
      return;
    }
    const endDate = end ? localDatetimeToStorage(end) : null;
    if (end && !endDate) {
      setSaveError("Invalid end date or time.");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      brand_id: brandId === "none" ? null : brandId,
      due_date: dueDate,
      end_date: endDate,
      event_type: eventType,
      meeting_url: meetingUrl.trim() || null,
      location: location.trim() || null,
      repeat_frequency: null as string | null,
      completed: editing?.completed ?? false,
    };

    if (editing) {
      updateReminder(editing.id, payload);
    } else {
      addReminder(payload);
    }
    onSaved?.(dueDate);
    onOpenChange(false);
  }

  const showMeetingField =
    eventType === "meeting" || eventType === "call" || meetingUrl.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/[0.08] bg-[#0a0a0b] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit event" : "New calendar event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5"
              placeholder="Wholesale sync, investor call…"
              autoFocus
            />
          </div>
          <div>
            <Label>Type</Label>
            <Select
              value={eventType}
              onValueChange={(v) => setEventType(v as CalendarEventType)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CALENDAR_EVENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Starts</Label>
              <Input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Ends</Label>
              <Input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
          {showMeetingField && (
            <div>
              <Label>Zoom / Meet / Teams link</Label>
              <Input
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                className="mt-1.5"
                placeholder="https://zoom.us/j/… or https://meet.google.com/…"
              />
            </div>
          )}
          <div>
            <Label>Location (optional)</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1.5"
              placeholder="Office, phone, address…"
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5"
              rows={2}
            />
          </div>
          <div>
            <Label>Brand</Label>
            <Select value={brandId} onValueChange={setBrandId}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {brands.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {saveError && (
            <p className="text-sm text-red-400">{saveError}</p>
          )}
          <div className="flex gap-2">
            {editing && (
              <Button
                type="button"
                variant="ghost"
                className="text-red-400 hover:text-red-300"
                onClick={() => {
                  deleteReminder(editing.id);
                  onOpenChange(false);
                }}
              >
                Delete
              </Button>
            )}
            <Button type="submit" className="flex-1">
              {editing ? "Save" : "Add to calendar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
