"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { PeakDetailView } from "@/components/PeakDetailView";
import type { PeakView } from "@/lib/types";

export function PeakDetail({ slug }: { slug: string }) {
  const peak = useQuery(api.peaks.getBySlug, { slug }) as PeakView | null | undefined;
  const related = useQuery(api.peaks.related, { slug }) as PeakView[] | undefined;
  const all = useQuery(api.peaks.list, {}) as PeakView[] | undefined;

  if (peak === undefined) {
    return (
      <p className="px-5 py-24 font-mono text-sm text-[var(--rd-muted)] sm:px-8">
        Finding the summit…
      </p>
    );
  }

  if (peak === null) {
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

  return (
    <PeakDetailView
      peak={peak}
      related={related ?? []}
      all={all ?? [peak]}
    />
  );
}
