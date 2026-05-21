import type { Brand } from "@/lib/types";

/** Match brand by name; disambiguate with stage when multiple share a name. */
export function resolveBrand(
  brands: Brand[],
  name?: string | null,
  stage?: string | null
): Brand | undefined {
  if (!name?.trim()) return undefined;

  const n = name.trim().toLowerCase();
  let matches = brands.filter(
    (b) =>
      b.name.toLowerCase() === n ||
      b.name.toLowerCase().includes(n) ||
      n.includes(b.name.toLowerCase())
  );

  if (stage?.trim()) {
    const s = stage.trim().toLowerCase();
    const byStage = matches.filter((b) => b.stage.toLowerCase() === s);
    if (byStage.length > 0) matches = byStage;
  }

  return matches[0];
}

export function resolveBrandId(
  brands: Brand[],
  name?: string | null,
  stage?: string | null
): string | null {
  return resolveBrand(brands, name, stage)?.id ?? null;
}
