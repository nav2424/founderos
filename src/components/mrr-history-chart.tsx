"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MrrEntry } from "@/lib/types";
import { format, parseISO } from "date-fns";

interface MrrHistoryChartProps {
  entries: MrrEntry[];
}

export function MrrHistoryChart({ entries }: MrrHistoryChartProps) {
  const data = [...entries]
    .sort((a, b) => a.recorded_at.localeCompare(b.recorded_at))
    .map((e) => ({
      date: e.recorded_at,
      label: format(parseISO(e.recorded_at), "MMM d"),
      amount: e.amount,
    }));

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-xs text-zinc-600">
        Log MRR below to build history
      </p>
    );
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: "#71717a", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "#0a0a0b",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(v: number) => [`$${v.toLocaleString()}`, "MRR"]}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#34d399"
            strokeWidth={2}
            dot={{ fill: "#34d399", r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
