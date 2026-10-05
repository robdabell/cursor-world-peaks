import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const continent = v.union(
  v.literal("Africa"),
  v.literal("Antarctica"),
  v.literal("Asia"),
  v.literal("Europe"),
  v.literal("North America"),
  v.literal("Oceania"),
  v.literal("South America"),
);

export default defineSchema({
  peaks: defineTable({
    slug: v.string(),
    name: v.string(),
    localName: v.optional(v.string()),
    elevationM: v.number(),
    prominenceM: v.optional(v.number()),
    baseToSummitM: v.optional(v.number()),
    range: v.string(),
    countries: v.array(v.string()),
    continent,
    lat: v.number(),
    lng: v.number(),
    firstAscentYear: v.optional(v.number()),
    wikipediaTitle: v.string(),
    funFact: v.string(),
    summary: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    thumbUrl: v.optional(v.string()),
    imageCredit: v.optional(v.string()),
    wikipediaUrl: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_continent", ["continent"])
    .index("by_elevation", ["elevationM"]),
});
