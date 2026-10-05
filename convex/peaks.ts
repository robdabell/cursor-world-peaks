import { v } from "convex/values";
import { query } from "./_generated/server";
import { continent } from "./schema";

export const list = query({
  args: {
    continent: v.optional(continent),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const rows = args.continent
      ? await ctx.db
          .query("peaks")
          .withIndex("by_continent", (q) => q.eq("continent", args.continent!))
          .collect()
      : await ctx.db.query("peaks").collect();

    const q = args.search?.trim().toLowerCase();
    const filtered = q
      ? rows.filter((peak) => {
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
      : rows;

    return filtered.sort((a, b) => b.elevationM - a.elevationM);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("peaks")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const related = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const peak = await ctx.db
      .query("peaks")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!peak) return [];
    const same = await ctx.db
      .query("peaks")
      .withIndex("by_continent", (q) => q.eq("continent", peak.continent))
      .collect();
    return same
      .filter((row) => row.slug !== slug)
      .sort((a, b) => b.elevationM - a.elevationM)
      .slice(0, 6);
  },
});

export const summary = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("peaks").collect();
    if (rows.length === 0) {
      return { count: 0, highest: null, continents: 0 };
    }
    const highest = rows.reduce((a, b) => (a.elevationM >= b.elevationM ? a : b));
    const continents = new Set(rows.map((row) => row.continent)).size;
    return {
      count: rows.length,
      highest: { name: highest.name, slug: highest.slug, elevationM: highest.elevationM },
      continents,
    };
  },
});
