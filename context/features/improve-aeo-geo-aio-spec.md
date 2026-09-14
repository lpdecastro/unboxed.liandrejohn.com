# Improve AEO/GEO/AIO Spec

## Task

Make Unboxed's existing content easier for answer engines and AI assistants (Google AI Overviews, ChatGPT, Perplexity, Claude, etc.) to find, quote, and cite correctly — via a visible FAQ section with matching structured data, richer/entity-focused JSON-LD, and an `llms.txt` file — without changing the booking flow or existing page copy.

## Background

`context/features/seo-homepage-games-page-spec.md` already covers traditional SEO (metadata, OG/Twitter, `LocalBusiness`/`ItemList` JSON-LD, sitemap/robots). This spec is additive on top of that work and focuses specifically on answer-engine/generative-engine visibility: content shaped as direct question-and-answer pairs, structured data that names Unboxed as a specific local rental entity (not a generic e-commerce catalog), and a plain-language machine-readable summary of the site.

## FAQ Section (Homepage)

- Add a new `## Frequently Asked Questions` section to `src/app/page.jsx`, placed after the existing "Rental Policies" section and before the "Final CTA" section. Use a Bootstrap `accordion` (same pattern as the existing `#policyAccordion`), so no new custom CSS is needed.
- This is distinct from the existing Rental Policies accordion: policies state the formal rules, FAQ answers the natural-language questions a customer (or an AI assistant summarizing the site) would actually ask. Keep each answer short (1–3 sentences) and self-contained — don't reference "see policies above."
- Draft questions grounded in `context/project-overview.md` (Business Rules, Rental Model, Policies) — for example:
  - "How much does it cost to rent a board game in Metro Manila?" → price range ₱50–₱150/day depending on the game, plus a refundable deposit.
  - "How do I pay for a rental?" → GCash only, full rental fee + deposit before the booking is confirmed.
  - "How are the games delivered and returned?" → Lalamove, customer pays delivery/return fees, Metro Manila only.
  - "Can I rent more than one game at a time?" → yes, and 2+ games get a 10% discount on rental fees (not on the deposit).
  - "Is the security deposit refundable?" → yes, returned after the games are inspected on return, minus any late/damage/missing-item fees.
  - "How far in advance do I need to book?" → bookings are confirmed manually after GCash payment is verified; availability depends on other bookings for the same dates.
  - Keep to 5–7 questions; don't pad with filler questions that don't map to real site behavior.
- Each question is an `h3` inside the accordion header (matching the existing policy accordion's heading pattern), so the section stays crawlable as real headings, not JS-only text.

## Structured Data

- Add `FAQPage` JSON-LD to `src/app/page.jsx` via the existing `JsonLd` component, built from the *same* question/answer array used to render the visible accordion (single source of truth — no drift between visible copy and schema, and no schema for content that isn't actually on the page).
- Enrich the existing `localBusinessJsonLd` in `src/app/page.jsx` with fields answer engines use to disambiguate a local service: `description` (one sentence, matches the hero copy), `priceRange` (`"₱50–₱150"`), `areaServed` upgraded from a bare string to `{ "@type": "City", "name": "Metro Manila" }`, and `paymentAccepted: "GCash"`. Don't invent fields that don't apply (no street address, no opening hours — bookings are online/manual, not a storefront).
- Add a `HowTo` JSON-LD node (also on the homepage, via `JsonLd`) mirroring the existing 3-step "How It Works" section (Pick your games → Pay through GCash → Receive via Lalamove) — `HowToStep` `name`/`text` pulled from the same copy already rendered, not reworded.
- `/games` keeps its existing `ItemList`/`Product` JSON-LD as-is (already covered by the prior SEO spec) — no changes needed there.

## `llms.txt`

- Add `src/app/llms.txt/route.js`, a Next.js Route Handler returning `text/plain` (the emerging `llms.txt` convention: a short, plain-language Markdown summary of the site for AI agents/crawlers that don't want to parse full HTML).
- Content: what Unboxed is (personal board game rental, Metro Manila only), the 8 games by name, how booking/payment/delivery works in a few bullet lines, and links to `/` and `/games` (absolute, via `NEXT_PUBLIC_SITE_URL`). Keep it under ~30 lines — a summary, not a copy of the whole site.
- Follow the same env-driven absolute-URL pattern already used in `src/app/sitemap.js`/`src/app/robots.js`.

## AI Crawler Access

- Confirm (don't change unless needed) that `src/app/robots.js`'s existing `userAgent: "*", allow: "/"` rule already permits answer-engine/AI crawlers (e.g. `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`) — the goal of this feature is visibility, so nothing should be blocking them. Add a brief code comment in `robots.js` noting this is intentional, so a future edit doesn't accidentally restrict it.

## Documentation

- Note the new `llms.txt` route and the FAQ/HowTo JSON-LD additions in `context/current-feature.md` history (per the standard workflow) and in `README.md` if it documents the route/page list.

## Out of Scope

- Any change to the booking flow, pricing logic, or existing page layout/copy outside the new FAQ section.
- FAQ content on `/games` (kept to the homepage to avoid disrupting the booking-focused layout there).
- A dedicated `/faq` page — this is a homepage section, not a new route.
- Schema.org `Review`/`AggregateRating` data (no real reviews exist yet — don't fabricate ratings).
- Analytics/tracking of AI-referrer traffic.
- Any change to `/games`'s existing `ItemList`/`Product` JSON-LD.

## Acceptance Criteria

- [ ] Homepage has a new, visible FAQ accordion section (5–7 real questions) between Rental Policies and Final CTA.
- [ ] `FAQPage` JSON-LD renders on `/`, generated from the same Q&A data used for the visible accordion.
- [ ] `localBusinessJsonLd` includes `description`, `priceRange`, `areaServed` as a `City` type, and `paymentAccepted`.
- [ ] `HowTo` JSON-LD renders on `/`, matching the existing 3-step "How It Works" copy.
- [ ] `src/app/llms.txt/route.js` serves a plain-text summary at `/llms.txt`, using `NEXT_PUBLIC_SITE_URL` for absolute links.
- [ ] `robots.js` unchanged in behavior (still allows all crawlers) with a comment documenting that this is intentional for AI-crawler visibility.
- [ ] No visible change to the booking flow, `/games`, or any existing homepage section other than the new FAQ addition.
- [ ] Production build passes.
- [ ] Dev-server check confirms `/llms.txt` responds with plain text and the rendered `<head>`/JSON-LD `<script>` blocks on `/` include the new `FAQPage` and `HowTo` nodes.
