"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { api } from "../convex/_generated/api";
import { PeakBrowser } from "@/components/PeakBrowser";
import type { PeakView } from "@/lib/types";

export function Atlas() {
  const ensure = useMutation(api.seed.ensure);
  const enrich = useAction(api.seed.enrichFromWikipedia);
  const enrichOnce = useRef(false);
  const peaks = useQuery(api.peaks.list, {}) as PeakView[] | undefined;

  useEffect(() => {
    void ensure();
  }, [ensure]);

  useEffect(() => {
    if (!peaks?.length || enrichOnce.current) return;
    if (peaks.some((peak) => !peak.thumbUrl)) {
      enrichOnce.current = true;
      void enrich();
    }
  }, [peaks, enrich]);

  return (
    <PeakBrowser
      peaks={peaks}
      loading={peaks === undefined}
      intro="Seventy-odd summits in Convex. Photographs from Wikipedia when the enrichment run lands; statistics you can sort with your eyes."
    />
  );
}
