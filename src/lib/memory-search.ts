import type { KnowledgeEntry } from "./types";

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function scoreEntry(entry: KnowledgeEntry, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 0;
  const hay = tokens(
    `${entry.title} ${entry.content} ${entry.tags.join(" ")} ${entry.category} ${entry.source ?? ""}`
  );
  let score = 0;
  for (const q of queryTokens) {
    if (hay.some((h) => h === q || h.includes(q) || q.includes(h))) score += 2;
    if (entry.title.toLowerCase().includes(q)) score += 3;
  }
  return score;
}

export interface RecalledMemory {
  id: string;
  title: string;
  category: string;
  brand_name: string | null;
  system: string | null;
  excerpt: string;
  relevance: number;
}

export function searchKnowledge(
  entries: KnowledgeEntry[],
  query: string,
  brandNames: Map<string, string>,
  limit = 12
): RecalledMemory[] {
  const queryTokens = tokens(query);
  if (queryTokens.length === 0) {
    return entries
      .slice()
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .slice(0, 6)
      .map((e) => toRecalled(e, brandNames, 1));
  }

  return entries
    .map((e) => ({ e, score: scoreEntry(e, queryTokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ e, score }) => toRecalled(e, brandNames, score));
}

function toRecalled(
  e: KnowledgeEntry,
  brandNames: Map<string, string>,
  relevance: number
): RecalledMemory {
  const excerpt =
    e.content.length > 400 ? `${e.content.slice(0, 400)}…` : e.content;
  return {
    id: e.id,
    title: e.title,
    category: e.category,
    brand_name: e.brand_id ? brandNames.get(e.brand_id) ?? null : null,
    system: e.system,
    excerpt,
    relevance,
  };
}

export function memoryIndexSummary(
  entries: KnowledgeEntry[],
  brandNames: Map<string, string>
): { total: number; by_brand: Record<string, number>; by_category: Record<string, number> } {
  const by_brand: Record<string, number> = { Global: 0 };
  const by_category: Record<string, number> = {};

  for (const e of entries) {
    const brand = e.brand_id
      ? (brandNames.get(e.brand_id) ?? "Unknown")
      : "Global";
    by_brand[brand] = (by_brand[brand] ?? 0) + 1;
    by_category[e.category] = (by_category[e.category] ?? 0) + 1;
  }

  return { total: entries.length, by_brand, by_category };
}
