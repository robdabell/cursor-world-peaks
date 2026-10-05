import { v } from "convex/values";
import { action, internalMutation, internalQuery, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { CATALOG } from "./lib/catalog";

export const ensure = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("peaks").take(1);
    if (existing.length > 0) {
      return { inserted: 0, already: true };
    }
    for (const peak of CATALOG) {
      await ctx.db.insert("peaks", peak);
    }
    return { inserted: CATALOG.length, already: false };
  },
});

export const listPeaks = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("peaks").collect();
  },
});

export const patchMedia = internalMutation({
  args: {
    id: v.id("peaks"),
    summary: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    thumbUrl: v.optional(v.string()),
    imageCredit: v.optional(v.string()),
    wikipediaUrl: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const enrichFromWikipedia = action({
  args: {},
  handler: async (ctx) => {
    const peaks = await ctx.runQuery(internal.seed.listPeaks);
    let updated = 0;
    for (const peak of peaks) {
      if (peak.thumbUrl && peak.imageUrl) continue;
      const title = encodeURIComponent(peak.wikipediaTitle.replaceAll(" ", "_"));
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
        {
          headers: {
            "User-Agent":
              "WorldPeaks/0.1 (educational demo of Convex + Next.js)",
            "Api-User-Agent":
              "WorldPeaks/0.1 (educational demo of Convex + Next.js)",
            Accept: "application/json",
          },
        },
      );
      if (!res.ok) continue;
      const data = (await res.json()) as {
        extract?: string;
        thumbnail?: { source?: string };
        originalimage?: { source?: string };
        content_urls?: { desktop?: { page?: string } };
      };
      await ctx.runMutation(internal.seed.patchMedia, {
        id: peak._id,
        summary: data.extract,
        imageUrl: data.originalimage?.source ?? data.thumbnail?.source,
        thumbUrl: data.thumbnail?.source ?? data.originalimage?.source,
        imageCredit: "Photograph via Wikipedia / Wikimedia Commons",
        wikipediaUrl: data.content_urls?.desktop?.page,
      });
      updated += 1;
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    return { updated };
  },
});
