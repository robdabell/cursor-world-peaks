"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PeakCard } from "@/components/PeakCard";
import { PeakMap } from "@/components/PeakMap";
import { CONTINENTS, formatMetres } from "@/lib/geo";
import type { Continent } from "@/lib/geo";
import type { PeakView } from "@/lib/types";

type View = "sheet" | "map";

export function PeakBrowser({
  peaks,
  loading,
  note,
  intro,
}: {
  peaks: PeakView[] | undefined;
  loading?: boolean;
  note?: string;
  intro: string;
}) {
  const [continent, setContinent] = useState<Continent | "all">("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<View>("sheet");

  const visible = useMemo(() => {
    if (!peaks) return undefined;
    const q = search.trim().toLowerCase();
    return peaks
      .filter((peak) => (continent === "all" ? true : peak.continent === continent))
      .filter((peak) => {
        if (!q) return true;
        const hay = [
          peak.name,
          peak.localName ?? "",
          peak.range,
          peak.continent,
          ...peak.countries,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => b.elevationM - a.elevationM);
  }, [peaks, continent, search]);

  const highest = peaks?.reduce(
    (a, b) => (a.elevationM >= b.elevationM ? a : b),
    peaks[0],
  );
  const continentCount = new Set(peaks?.map((p) => p.continent)).size;
  const missingPhotos = visible?.filter((peak) => !peak.thumbUrl).length ?? 0;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="grid grid-cols-1 border-b border-[var(--rd-rule)] lg:grid-cols-12">
        <div className="flex flex-col justify-between gap-8 px-5 py-8 sm:px-8 lg:col-span-7 lg:py-10">
          <p className="font-mono text-[11px] tracking-[0.22em] text-[var(--rd-muted)] uppercase">
            World Peaks · a visual gazetteer
          </p>
          <h1 className="max-w-xl font-[family-name:var(--font-display)] text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.9] text-[var(--rd-ink)]">
            The world’s mountains, as a contact sheet.
          </h1>
        </div>
        <div className="flex flex-col justify-end gap-6 border-t border-[var(--rd-rule)] px-5 py-8 sm:px-8 lg:col-span-5 lg:border-t-0 lg:border-l">
          <p className="max-w-sm text-[var(--rd-muted)]">{intro}</p>
          <dl className="flex flex-wrap gap-x-8 gap-y-4 font-mono text-xs">
            <div>
              <dt className="text-[var(--rd-muted)]">Peaks</dt>
              <dd className="mt-1 text-lg text-[var(--rd-ink)]">
                {peaks?.length ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--rd-muted)]">Continents</dt>
              <dd className="mt-1 text-lg text-[var(--rd-ink)]">
                {peaks ? continentCount : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--rd-muted)]">Roof</dt>
              <dd className="mt-1 text-lg whitespace-nowrap text-[var(--rd-ink)]">
                {highest ? (
                  <Link
                    href={`/p/${highest.slug}`}
                    className="underline decoration-[var(--rd-yellow)] underline-offset-4"
                  >
                    {formatMetres(highest.elevationM)}
                  </Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-[var(--rd-rule)] bg-[var(--rd-paper)]/95 px-5 py-3 backdrop-blur-sm sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={continent === "all"}
            onClick={() => setContinent("all")}
          >
            All
          </FilterChip>
          {CONTINENTS.map((name) => (
            <FilterChip
              key={name}
              active={continent === name}
              onClick={() => setContinent(name)}
            >
              {name}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="peak-search">
            Search peaks
          </label>
          <input
            id="peak-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, range, country"
            className="h-9 w-full min-w-56 border border-[var(--rd-rule)] bg-transparent px-3 text-sm text-[var(--rd-ink)] outline-none placeholder:text-[var(--rd-muted)] focus:border-[var(--rd-ink)] sm:w-64"
          />
          <div className="flex border border-[var(--rd-rule)]">
            <button
              type="button"
              onClick={() => setView("sheet")}
              className={`h-9 px-3 font-mono text-[11px] tracking-wide uppercase ${view === "sheet" ? "bg-[var(--rd-ink)] text-white" : "text-[var(--rd-muted)]"}`}
            >
              Sheet
            </button>
            <button
              type="button"
              onClick={() => setView("map")}
              className={`h-9 px-3 font-mono text-[11px] tracking-wide uppercase ${view === "map" ? "bg-[var(--rd-ink)] text-white" : "text-[var(--rd-muted)]"}`}
            >
              Map
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {loading || visible === undefined ? (
          <p className="px-5 py-16 font-mono text-sm text-[var(--rd-muted)] sm:px-8">
            Loading the gazetteer…
          </p>
        ) : visible.length === 0 ? (
          <p className="px-5 py-16 font-mono text-sm text-[var(--rd-muted)] sm:px-8">
            No peaks match that filter.
          </p>
        ) : view === "map" ? (
          <div className="px-5 py-6 sm:px-8">
            <PeakMap peaks={visible} />
            <p className="mt-3 font-mono text-[11px] text-[var(--rd-muted)]">
              Dot size scales with elevation. Yellow marks the open summit.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((peak) => (
              <li
                key={peak.slug}
                className="border-b border-r border-[var(--rd-rule)]"
              >
                <PeakCard peak={peak} />
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="flex flex-col gap-2 border-t border-[var(--rd-rule)] px-5 py-6 font-mono text-[11px] text-[var(--rd-muted)] sm:flex-row sm:justify-between sm:px-8">
        <p>
          Illustrative elevations and years. Display serif is Newsreader, a
          stand-in for Wasabi. Photos: Wikipedia where available.
        </p>
        <p>
          {note ??
            (missingPhotos > 0
              ? `Fetching ${missingPhotos} photographs…`
              : "Convex + Next.js · deploy on Vercel")}
        </p>
      </footer>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 font-mono text-[11px] tracking-wide uppercase ${
        active
          ? "bg-[var(--rd-ink)] text-white"
          : "border border-[var(--rd-rule)] text-[var(--rd-muted)] hover:border-[var(--rd-ink)] hover:text-[var(--rd-ink)]"
      }`}
    >
      {children}
    </button>
  );
}
