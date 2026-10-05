"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PeakDetailView } from "@/components/PeakDetailView";
import { LOCAL_PEAKS, localPeak, localRelated } from "@/lib/localPeaks";
import { hydratePeak, hydratePeaks } from "@/lib/wikipedia";
import type { PeakView } from "@/lib/types";

export function LocalPeakDetail({ slug }: { slug: string }) {
  const base = useMemo(() => localPeak(slug), [slug]);
  const [peak, setPeak] = useState<PeakView | null>(base);
  const [related, setRelated] = useState<PeakView[]>(() => localRelated(slug));
  const [all, setAll] = useState<PeakView[]>(LOCAL_PEAKS);

  useEffect(() => {
    setPeak(base);
    setRelated(localRelated(slug));
  }, [base, slug]);

  useEffect(() => {
    if (!base) return;
    void hydratePeak(base).then(setPeak);
  }, [base]);

  useEffect(() => {
    void hydratePeaks(localRelated(slug), setRelated);
  }, [slug]);

  useEffect(() => {
    void hydratePeaks(LOCAL_PEAKS, setAll);
  }, []);

  if (!peak) {
    return (
      <main className="px-5 py-24 sm:px-8">
        <p className="font-mono text-sm text-[var(--rd-muted)]">
          No peak with that slug.
        </p>
        <Link href="/" className="mt-4 inline-block underline">
          Back to the sheet
        </Link>
      </main>
    );
  }

  return <PeakDetailView peak={peak} related={related} all={all} />;
}
