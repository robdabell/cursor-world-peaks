import Link from "next/link";
import { PeakCard } from "@/components/PeakCard";
import { PeakMap } from "@/components/PeakMap";
import {
  formatLatLng,
  formatMetres,
  timesBenNevis,
  timesEiffel,
} from "@/lib/geo";
import type { PeakView } from "@/lib/types";

export function PeakDetailView({
  peak,
  related,
  all,
}: {
  peak: PeakView;
  related: PeakView[];
  all: PeakView[];
}) {
  const src = peak.imageUrl ?? peak.thumbUrl;

  return (
    <article>
      <nav className="flex items-center justify-between border-b border-[var(--rd-rule)] px-5 py-4 font-mono text-[11px] tracking-wide uppercase sm:px-8">
        <Link href="/" className="text-[var(--rd-muted)] hover:text-[var(--rd-ink)]">
          ← World Peaks
        </Link>
        <span className="text-[var(--rd-yellow)]">{peak.continent}</span>
      </nav>

      <div className="grid lg:grid-cols-12">
        <div className="relative min-h-[56vh] bg-[var(--rd-charcoal)] lg:col-span-7">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={peak.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#7A8589] to-[#23323A]" />
          )}
        </div>
        <div className="flex flex-col justify-between gap-10 px-5 py-8 sm:px-8 lg:col-span-5">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-[var(--rd-muted)] uppercase">
              {peak.range}
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.9]">
              {peak.name}
            </h1>
            {peak.localName ? (
              <p className="mt-3 text-[var(--rd-muted)]">{peak.localName}</p>
            ) : null}
          </div>
          <p className="max-w-md text-[1.05rem] leading-relaxed text-[var(--rd-ink)]">
            {peak.summary ?? peak.funFact}
          </p>
        </div>
      </div>

      <section className="grid grid-cols-2 border-y border-[var(--rd-rule)] sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Elevation" value={formatMetres(peak.elevationM)} />
        <Stat
          label="Prominence"
          value={peak.prominenceM ? formatMetres(peak.prominenceM) : "—"}
        />
        <Stat label="First ascent" value={peak.firstAscentYear?.toString() ?? "—"} />
        <Stat label="Coordinates" value={formatLatLng(peak.lat, peak.lng)} />
        <Stat
          label="× Ben Nevis"
          value={timesBenNevis(peak.elevationM).toFixed(1)}
        />
        <Stat
          label="× Eiffel Tower"
          value={timesEiffel(peak.elevationM).toFixed(1)}
        />
      </section>

      {peak.baseToSummitM ? (
        <p className="border-b border-[var(--rd-rule)] px-5 py-4 font-mono text-sm text-[var(--rd-ink)] sm:px-8">
          From the ocean floor this mountain is {formatMetres(peak.baseToSummitM)}{" "}
          — taller than anything that starts at sea level.
        </p>
      ) : null}

      <section className="grid gap-8 px-5 py-10 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="font-mono text-[11px] tracking-[0.18em] text-[var(--rd-muted)] uppercase">
            Position
          </h2>
          <div className="mt-4">
            <PeakMap peaks={all.length ? all : [peak]} activeSlug={peak.slug} />
          </div>
        </div>
        <div className="lg:col-span-5">
          <h2 className="font-mono text-[11px] tracking-[0.18em] text-[var(--rd-muted)] uppercase">
            Note
          </h2>
          <p className="mt-4 leading-relaxed text-[var(--rd-muted)]">
            {peak.funFact}
          </p>
          <p className="mt-6 font-mono text-[11px] text-[var(--rd-muted)]">
            {peak.countries.join(" · ")}
            {peak.imageCredit ? ` · ${peak.imageCredit}` : ""}
          </p>
          {peak.wikipediaUrl ? (
            <a
              href={peak.wikipediaUrl}
              className="mt-4 inline-block font-mono text-[11px] tracking-wide text-[var(--rd-ink)] uppercase underline decoration-[var(--rd-yellow)] underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Wikipedia entry
            </a>
          ) : null}
        </div>
      </section>

      {related.length > 0 ? (
        <section>
          <h2 className="border-t border-[var(--rd-rule)] px-5 py-6 font-mono text-[11px] tracking-[0.18em] text-[var(--rd-muted)] uppercase sm:px-8">
            Same continent
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((row) => (
              <li key={row.slug} className="border-t border-r border-[var(--rd-rule)]">
                <PeakCard peak={row} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-b border-[var(--rd-rule)] px-5 py-5 last:border-r-0 sm:px-6">
      <p className="font-mono text-[11px] tracking-wide text-[var(--rd-muted)] uppercase">
        {label}
      </p>
      <p className="mt-2 font-mono text-sm text-[var(--rd-ink)] sm:text-base">
        {value}
      </p>
    </div>
  );
}
