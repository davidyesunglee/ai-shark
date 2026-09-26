---
name: SEO content pages (guides)
description: How indexable content pages, sitemap, and structured data are wired for aishark.org SEO/growth work.
---

# SEO content page pattern

Public, indexable content pages (e.g. `/guides`, `/guides/:slug`) are the growth lever for organic search. Established conventions:

- **Content lives in `shared/`** (e.g. `shared/guides.ts`), NOT `client/src/`. This is deliberate: the Express `/sitemap.xml` route imports the slug list (`guideSlugs`) from `@shared/...` so URLs can never drift from the content. The server imports `@shared` fine (same as `@shared/schema`).

- **Structured data** uses the `useJsonLd(blocks)` hook in `client/src/lib/useSEO.ts` — injects `<script type="application/ld+json" id="jsonld-...">` per block and cleans up on unmount. Pair with `useSEO({title, description, canonical, noindex})`. Article/FAQPage/BreadcrumbList are the schemas that matter for content pages.

- **Hooks-order trap:** page components resolve a route param to a data object that may be missing (bad slug). ALWAYS call `useSEO`/`useJsonLd` BEFORE the `if (!data) return <NotFound/>` early return, passing safe fallbacks + `noindex:true` when missing. Calling hooks after the early return is a React hooks-order violation.

- **Analytics allowlist:** `server/routes.ts` has `TRACKED_PAGE_PATHS` (a Set) gating visit + `/api/track-pageview`. A Set cannot match dynamic slugs — use the `isTrackedPath()` helper (Set membership OR regex like `/^\/guides\/[a-z0-9-]+$/`) or new content pages record zero traffic.

- **Real image URLs only:** JSON-LD `publisher.logo` / OG images must point to files that exist in prod. Site logo is `https://aishark.org/favicon.png` (in `public/`), there is no `logo.png`.

**Why:** these four (shared source of truth, JSON-LD hook, hooks ordering, tracking allowlist) were the exact issues surfaced building the first guide pages; getting any wrong silently breaks indexing or measurement.
