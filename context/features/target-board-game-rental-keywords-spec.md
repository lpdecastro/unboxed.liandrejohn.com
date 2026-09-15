# Target Board Game Rental Keywords Spec

## Task

Sharpen Unboxed's existing SEO/AEO/AIO/GEO work to rank and get cited for "board game rentals", "board game rental service in Metro Manila", "where to rent board games", and adjacent natural-language queries a searcher or AI assistant might ask — via keyword-aligned metadata/copy, expanded FAQ content matching real question phrasing, and richer local-entity structured data — without changing the booking flow, pricing, or page layout.

## Background

Two prior specs already covered the fundamentals: `context/features/seo-homepage-games-page-spec.md` (metadata, OG/Twitter, `LocalBusiness`/`ItemList` JSON-LD, sitemap/robots) and `context/features/improve-aeo-geo-aio-spec.md` (visible FAQ accordion + `FAQPage`/`HowTo` JSON-LD + `llms.txt`). This spec doesn't add new mechanisms — it re-tunes existing copy/metadata and extends the existing FAQ array so the site actually contains the phrases and direct answers these specific queries are looking for.

## Metadata

- `src/app/games/page.jsx`: title changes from the generic `"Choose Your Games"` to something that stands alone in a search result and names the intent directly — e.g. `"Rent Board Games in Metro Manila"` (renders as "Rent Board Games in Metro Manila — Unboxed" via the existing title template). Rework `description` to lead with "rent," name a few games, and mention Metro Manila up front.
- `src/app/layout.jsx` (homepage/root metadata): title stays as-is (`"Unboxed — Board Game Rentals in Metro Manila"` already leads with the target phrase). Rework `description` to explicitly read as a rental-service description — e.g. "Unboxed is a personal board game rental service in Metro Manila — browse the collection, pick your dates, pay via GCash, and get games delivered and returned through Lalamove."

## Homepage Copy (`src/app/page.jsx`)

- Hero lead paragraph: work in the phrase "board game rental service" once, naturally — it currently only appears in the eyebrow line and JSON-LD, never in a sentence a reader or an AI assistant would actually quote.
- Extend the existing `faqs` array (currently 6 entries from the prior AEO spec) with 3 more Q&As phrased to match real search queries, answered honestly — no unverifiable "best"/"#1"/"top-rated" claims:
  - "Where can I rent board games in Metro Manila?" → direct answer naming Unboxed, online booking on the site, delivery via Lalamove.
  - "Can I rent board games for a party or event?" → yes, multiple games can be booked together (10% discount at 2+), note it's a small personal collection (one copy per game, so availability depends on dates).
  - "Do you deliver board game rentals near me?" → Lalamove delivery covers all of Metro Manila, name a few example cities.
  - These flow into the existing `faqJsonLd` automatically since it's generated from the same `faqs` array — no separate schema work needed.

## Structured Data (`src/app/page.jsx`)

- `localBusinessJsonLd`: add `alternateName: "Unboxed Board Game Rentals"` — a stronger entity match for the "board game rental(s)" phrase in structured data only, without touching the visible brand name anywhere in the UI (logo, navbar, footer all stay "Unboxed").
- `areaServed`: upgrade from a single `City` ("Metro Manila") to an array of named `City` entities for a handful of real Metro Manila cities (e.g. Quezon City, Manila, Makati, Taguig, Pasig, Mandaluyong) plus keep "Metro Manila" itself in the array — truthful, since delivery already covers all of it; gives local queries ("board game rental Makati", "... QC") more to match against.

## Footer (`src/components/Footer.jsx`)

- Add a short, truthful "Areas We Serve" line under the existing "Rental Info" list (or replacing the plain "Metro Manila only" bullet) naming the same handful of cities used in the structured data, e.g. "Quezon City, Manila, Makati, Taguig, Pasig & the rest of Metro Manila." Don't invent coverage outside Metro Manila.

## `llms.txt`

- Update `src/app/llms.txt/route.js`'s opening line to use the phrase "board game rental service in Metro Manila" so AI agents summarizing or citing the site pick up that framing directly, matching the reworked meta description.

## Out of Scope

- New pages or routes (no `/faq`, no `/areas`, no city landing pages).
- Any visible brand/logo change — `alternateName` is structured-data only.
- Booking flow, pricing, or games-catalog changes.
- Off-site SEO (backlinks, Google Business Profile, citations) — outside this codebase.
- Claims of being "the best," "#1," or "top-rated" — unverifiable and reads as spammy to both search engines and AI answer engines.
- `/games`'s existing `ItemList`/`Product` JSON-LD — unchanged.

## Acceptance Criteria

- [ ] `/games` metadata title/description updated to explicitly reference "Rent Board Games" and "Metro Manila".
- [ ] Homepage meta description reworked to read as a rental-service description.
- [ ] Homepage hero copy naturally includes the phrase "board game rental service" once.
- [ ] `faqs` array in `src/app/page.jsx` has 3 new Q&As covering "where to rent," "party/event rentals," and "delivery near me," rendered in the visible accordion.
- [ ] `faqJsonLd` picks up the 3 new entries automatically (same array, no drift).
- [ ] `localBusinessJsonLd` has `alternateName: "Unboxed Board Game Rentals"` and `areaServed` as an array of named Metro Manila cities (plus "Metro Manila" itself).
- [ ] Footer has a truthful "Areas We Serve" line naming a few real Metro Manila cities.
- [ ] `llms.txt` opens with a line using "board game rental service in Metro Manila".
- [ ] No changes to booking flow, pricing, or `/games`'s existing `ItemList`/`Product` JSON-LD.
- [ ] Production build passes.
- [ ] Dev-server check confirms the updated metadata/JSON-LD/FAQ/footer render correctly on `/` and `/games`.
