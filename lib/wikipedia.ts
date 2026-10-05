import type { PeakView } from "@/lib/types";

type WikiSummary = {
  extract?: string;
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
  content_urls?: { desktop?: { page?: string } };
};

export async function fetchWikiMedia(wikipediaTitle: string) {
  const title = encodeURIComponent(wikipediaTitle.replaceAll(" ", "_"));
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
    {
      headers: {
        Accept: "application/json",
        "Api-User-Agent": "WorldPeaks/0.1 (educational demo)",
      },
    },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as WikiSummary;
  return {
    summary: data.extract,
    imageUrl: data.originalimage?.source ?? data.thumbnail?.source,
    thumbUrl: data.thumbnail?.source ?? data.originalimage?.source,
    imageCredit: "Photograph via Wikipedia / Wikimedia Commons",
    wikipediaUrl: data.content_urls?.desktop?.page,
  };
}

export async function hydratePeak(peak: PeakView): Promise<PeakView> {
  if ((peak.thumbUrl && peak.imageUrl) || !peak.wikipediaTitle) return peak;
  const media = await fetchWikiMedia(peak.wikipediaTitle);
  if (!media) return peak;
  return { ...peak, ...media };
}

export async function hydratePeaks(
  peaks: PeakView[],
  onBatch?: (next: PeakView[]) => void,
) {
  const next = [...peaks];
  for (let i = 0; i < next.length; i += 1) {
    const peak = next[i];
    if (peak.thumbUrl) continue;
    next[i] = await hydratePeak(peak);
    onBatch?.([...next]);
    await new Promise((resolve) => setTimeout(resolve, 80));
  }
  return next;
}
