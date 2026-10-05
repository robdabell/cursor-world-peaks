"use client";

import Link from "next/link";
import { formatMetres } from "@/lib/geo";
import type { PeakView } from "@/lib/types";

export function PeakCard({ peak }: { peak: PeakView }) {
  const src = peak.thumbUrl ?? peak.imageUrl;
  const shade = Math.min(1, peak.elevationM / 8849);

  return (
    <Link
      href={`/p/${peak.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden bg-[var(--rd-charcoal)] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rd-yellow)]"
    >
      {src ? (
        // Wikimedia hosts vary; native img avoids next/image remote allowlists.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(165deg, #7A8589 0%, #23323A ${40 + shade * 50}%)`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl leading-none tracking-tight">
            {peak.name}
          </h2>
          <p className="mt-2 font-mono text-[11px] tracking-wide text-white/80 uppercase">
            {peak.range}
          </p>
        </div>
        <p className="font-mono text-sm text-[var(--rd-yellow)]">
          {formatMetres(peak.elevationM)}
        </p>
      </div>
    </Link>
  );
}
