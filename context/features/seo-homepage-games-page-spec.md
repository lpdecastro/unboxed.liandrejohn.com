# SEO for Homepage & Games Page Spec

## Task

Improve on-page and technical SEO for `/` and `/games` — richer metadata, Open Graph/Twitter cards, JSON-LD structured data, and a sitemap/robots setup — without changing any visible page content or layout.

## Site URL

- The site has no production domain yet (roadmap targets AWS Amplify). Add `NEXT_PUBLIC_SITE_URL` to `.env.example` (default documented as e.g. `https://unboxed.example.com`, with local dev falling back to `http://localhost:3000`).
- Read it once in `src/app/layout.jsx` via `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")` so every relative OG/Twitter image and canonical URL resolves correctly. Document the env var in README/CLAUDE.md.

## Metadata (`layout.jsx` + per-page)

- Keep the existing root `metadata.title`/`description` in `src/app/layout.jsx` as the fallback, but expand it with:
  - `openGraph`: `title`, `description`, `url: "/"`, `siteName: "Unboxed"`, `locale: "en_PH"`, `type: "website"`, `images` (see OG Image below).
  - `twitter`: `card: "summary_large_image"`, `title`, `description`, `images`.
  - `alternates.canonical: "/"`.
  - `robots: { index: true, follow: true }` (explicit default; keeps room for a future `noindex` page).
- Give `/games` (`src/app/games/page.jsx`) its own full metadata object (it already has `title`/`description` — extend it, don't replace the copy) mirroring the same `openGraph`/`twitter`/`alternates.canonical: "/games"` shape, with copy specific to browsing/booking games (e.g. mention Monopoly, Exploding Kittens, GCash, Lalamove, Metro Manila availability).
- Use `title.template`/`title.default` on the root metadata (e.g. `%s — Unboxed`) so `/games`'s title only needs to set its own segment, avoiding duplicated " — Unboxed" suffixes.

## OG Image

- No branded social-share image exists yet. Reuse `public/img/logo.png` as the initial `openGraph`/`twitter` image (absolute URL via `metadataBase`) rather than blocking this spec on new design assets.
- Note under Out of Scope that a purpose-built 1200×630 OG image is a follow-up, not part of this feature.

## Structured Data (JSON-LD)

- Add a small `src/components/JsonLd.jsx` helper (`<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`) — plain server component, no client JS.
- On `/` (`src/app/page.jsx`): emit a `LocalBusiness` node (`name: "Unboxed"`, `areaServed: "Metro Manila"`, `url`, `image`) so search engines understand this is a local rental service, not a generic e-commerce catalog.
- On `/games` (`src/app/games/page.jsx`): emit an `ItemList` of the 8 games (from the existing `getGames()` result already fetched on that page — no new data fetching), each item a minimal `Product`-shaped entry (`name`, `description: shortDescription`, `image: imageSrc`, `offers: { price: pricePerDay, priceCurrency: "PHP" }`). This reflects real rental pricing already computed server-side; don't invent availability/rating data that doesn't exist.

## Sitemap & Robots

- Add `src/app/sitemap.js` (`export default function sitemap()`) returning `/` and `/games` entries (`url`, `lastModified: new Date()`, `changeFrequency`, `priority`), using `NEXT_PUBLIC_SITE_URL` for absolute URLs — Next.js serves this at `/sitemap.xml` automatically.
- Add `src/app/robots.js` (`export default function robots()`) allowing all crawlers on `/` and pointing `sitemap` at `${NEXT_PUBLIC_SITE_URL}/sitemap.xml` — served at `/robots.txt`.

## Semantic/Accessibility Touch-ups (existing markup only)

- `src/app/page.jsx`'s hero `<img>` (Unsplash placeholder) and the featured-game `<Image>` tags already carry descriptive `alt` text — no change needed there.
- Confirm each page has exactly one `<h1>` (homepage hero `<h1>` already exists; check `/games` — `GamesPageClient.jsx` — still uses only its existing visually-hidden `<h1>` per `context/features/game-listing-page-spec.md`, don't add a second one).

## Out of Scope

- Designing a real 1200×630 OG/social-share image (placeholder logo image is used instead).
- Per-game individual pages/slugs for deeper SEO (games are only ever shown on `/` and `/games`; no dynamic `/games/[slug]` routes exist).
- Analytics/Search Console setup, backlinks, or any off-page SEO.
- Performance/Core Web Vitals work (image optimization, lazy-loading) beyond what's already in place.
- Blog/content marketing pages.
- Any change to visible page copy, layout, or booking flow — this is metadata/structured-data only.

## Acceptance Criteria

- [ ] `NEXT_PUBLIC_SITE_URL` added to `.env.example` and documented in README/CLAUDE.md.
- [ ] `metadataBase` set in `src/app/layout.jsx` from `NEXT_PUBLIC_SITE_URL` (falls back to `http://localhost:3000`).
- [ ] Root layout metadata includes `openGraph`, `twitter`, `alternates.canonical`, `robots`, and a `title.template`/`title.default`.
- [ ] `/games` metadata extended with matching `openGraph`, `twitter`, `alternates.canonical: "/games"`.
- [ ] `LocalBusiness` JSON-LD rendered on `/`; `ItemList`/`Product` JSON-LD rendered on `/games` using real `getGames()` data.
- [ ] `src/app/sitemap.js` and `src/app/robots.js` added, both resolving via `NEXT_PUBLIC_SITE_URL`; `/sitemap.xml` and `/robots.txt` serve correctly in dev.
- [ ] Each page still has exactly one `<h1>`; no visible content, layout, or booking behavior changes.
- [ ] Production build passes.
- [ ] `view-source`/dev-server check confirms rendered `<head>` contains the new OG/Twitter/canonical tags and JSON-LD `<script>` blocks on both pages.
