# World Peaks

A visual gazetteer of notable mountains: photographs, elevations, and a contact-sheet browser. **Next.js** on **Vercel**; the database and seed jobs on **Convex**.

Display type is **Newsreader**, a labelled stand-in for Wasabi. Interface type is Geist. Project colour is alpine charcoal; tour yellow is used only as a finding accent.

## Run it

```bash
npm install
npm run dev
```

The Convex CLI will ask you to sign in with GitHub (free tier) and create a project. That writes `.env.local` with `NEXT_PUBLIC_CONVEX_URL`. The app then seeds ~72 peaks and pulls Wikipedia thumbnails.

Open [http://localhost:3000](http://localhost:3000).

Frontend only (after Convex is already configured):

```bash
npm run dev:web
```

## Deploy

1. Push the repo to GitHub.
2. Import it on [Vercel](https://vercel.com) (Hobby is enough).
3. In the Convex dashboard, run **Production deploy** or `npx convex deploy`, and set `NEXT_PUBLIC_CONVEX_URL` on the Vercel project to the production Convex URL.

## Data

Catalog lives in `convex/lib/catalog.ts`. Elevations and first-ascent years are illustrative, not a survey product. Photographs come from the Wikipedia REST summary API when enrichment succeeds.
