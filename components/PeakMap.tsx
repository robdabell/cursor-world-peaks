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
    <div
      id="peak-map"
      className="relative aspect-[2/1] min-h-[min(70dvh,36rem)] w-full overflow-hidden bg-[var(--rd-charcoal)] scroll-mt-28"
    >
      {/* Natural Earth 110m land, public domain, equirectangular. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/world-equirectangular.svg"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-fill"
      />
      {peaks.map((peak) => {
        const { x, y } = projectEquirectangular(peak.lat, peak.lng);
        const size = 8 + (peak.elevationM / 8849) * 12;
        const active = peak.slug === activeSlug;
        return (
          <button
            key={peak.slug}
            type="button"
            title={`${peak.name} · ${peak.elevationM} m`}
            onClick={() => router.push(`/p/${peak.slug}`)}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rd-yellow)]"
            style={{
              left: `${x * 100}%`,
              top: `${y * 100}%`,
              width: size,
              height: size,
              background: active ? "#D4A900" : "#F5EEDC",
              boxShadow: active
                ? "0 0 0 2px #23323A, 0 0 0 6px rgba(212, 169, 0, 0.35)"
                : "0 0 0 1px rgba(35, 50, 58, 0.65)",
            }}
          />
        );
      })}
    </div>
  );
}
