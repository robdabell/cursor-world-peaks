import { CATALOG } from "@/convex/lib/catalog";
import type { PeakView } from "@/lib/types";

export const LOCAL_PEAKS: PeakView[] = CATALOG.map((peak) => ({
  ...peak,
  _id: peak.slug,
}));

export function localPeak(slug: string) {
  return LOCAL_PEAKS.find((peak) => peak.slug === slug) ?? null;
}

export function localRelated(slug: string) {
  const peak = localPeak(slug);
  if (!peak) return [];
  return LOCAL_PEAKS.filter(
    (row) => row.continent === peak.continent && row.slug !== slug,
  )
    .sort((a, b) => b.elevationM - a.elevationM)
    .slice(0, 6);
}
