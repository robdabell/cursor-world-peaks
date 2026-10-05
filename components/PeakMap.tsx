"use client";

import { useRouter } from "next/navigation";
import { projectEquirectangular } from "@/lib/geo";
import type { PeakView } from "@/lib/types";

export function PeakMap({
  peaks,
  activeSlug,
}: {
  peaks: PeakView[];
  activeSlug?: string;
}) {
  const router = useRouter();

  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden bg-[var(--rd-charcoal)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[8%] border border-white/15"
      />
      {peaks.map((peak) => {
        const { x, y } = projectEquirectangular(peak.lat, peak.lng);
        const size = 6 + (peak.elevationM / 8849) * 10;
        const active = peak.slug === activeSlug;
        return (
          <button
            key={peak.slug}
            type="button"
            title={`${peak.name} · ${peak.elevationM} m`}
            onClick={() => router.push(`/p/${peak.slug}`)}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rd-yellow)]"
            style={{
              left: `${8 + x * 84}%`,
              top: `${8 + y * 84}%`,
              width: size,
              height: size,
              background: active ? "#D4A900" : "#F5EEDC",
              boxShadow: active ? "0 0 0 6px rgba(212, 169, 0, 0.28)" : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
