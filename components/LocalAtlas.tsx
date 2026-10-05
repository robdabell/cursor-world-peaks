"use client";

import { useEffect, useState } from "react";
import { PeakBrowser } from "@/components/PeakBrowser";
import { LOCAL_PEAKS } from "@/lib/localPeaks";
import { hydratePeaks } from "@/lib/wikipedia";
import type { PeakView } from "@/lib/types";

export function LocalAtlas() {
  const [peaks, setPeaks] = useState<PeakView[]>(LOCAL_PEAKS);

  useEffect(() => {
    void hydratePeaks(LOCAL_PEAKS, setPeaks);
  }, []);

  return (
    <PeakBrowser
      peaks={peaks}
      intro="Seventy-two notable summits as a contact sheet. Photographs load from Wikipedia; statistics live in the catalog. Sign in to Convex later if you want the same data persisted in the cloud."
      note="Local catalog · Wikipedia photographs"
    />
  );
}
