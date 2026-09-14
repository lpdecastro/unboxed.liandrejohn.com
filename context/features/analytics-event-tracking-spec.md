# Analytics Event Tracking Spec

## Task

Instrument the site with custom Google Analytics 4 events — link/CTA clicks, filters, game selection, and the full booking funnel — building on the page-view tracking already wired up in `context/features/google-analytics-spec.md`.

## Setup

- Add `src/lib/analytics.js` exporting `trackEvent(eventName, params = {})`, a thin wrapper around `sendGAEvent` from `@next/third-parties/google` (already a dependency, already used for page views in `src/app/layout.jsx`). `sendGAEvent` pushes to `window.dataLayer` directly rather than requiring `window.gtag` to exist, so calling it is safe even when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is unset and `<GoogleAnalytics>` never rendered — no conditional/env check needed inside `trackEvent` itself, matching the existing degrade-gracefully pattern.
- Event names: `snake_case`, one flat namespace, no GA-reserved prefixes (`google_`, `ga_`, `firebase_`). Params stay small and primitive (strings/numbers) — no nested objects, matching GA4's flat custom-parameter model.
- No new env vars. No Server Actions changes — every event fires from the browser after a user action; no Measurement Protocol / server-side events (unchanged from the GA spec's out-of-scope list).

## Tracking Wrapper Components

`Navbar.jsx` and `GamesPageClient.jsx` are already `"use client"`, so their existing handlers can call `trackEvent` directly. `Footer.jsx`, `RentalPoliciesModal.jsx`, and `src/app/page.jsx` are server components with no JS handlers today (plain `<Link>`/`<a>` with `href`, or Bootstrap `data-bs-toggle` attributes) — rather than converting them entirely to client components, add two small client components under `src/components/analytics/` and use them only where a click needs tracking:

- `TrackedLink.jsx` — wraps `next/link`, accepts `eventName`/`eventParams` props, fires `trackEvent` in `onClick` before letting navigation proceed as normal. Drop-in replacement for the specific `<Link>`s listed below.
- `TrackedElement.jsx` — generic wrapper for non-`Link` interactive elements (`as="button"` or `as="a"`, default `"button"`), forwards all props including `data-bs-toggle`/`data-bs-target`/`href`, fires `trackEvent` in `onClick` alongside Bootstrap's own declarative handling (the two don't conflict — Bootstrap listens for the native click event separately).

## Event Taxonomy

**Navigation / CTAs** — event `cta_click`, params `{ label, location }` (`location` identifies where the CTA lives, e.g. `navbar`, `footer`, `hero`, `homepage_featured`, `homepage_how_it_works`, `homepage_final_cta`, `booking_confirmation`):
- Navbar: Home, How It Works, Browse Games (`Navbar.jsx`)
- Footer: Home, Browse Games (`Footer.jsx` → `TrackedLink`)
- Homepage: Hero "Browse Games", "View All 8 Games", "Check Prices & Availability", How It Works "Check Game Availability", Final CTA "Check Game Availability" (`page.jsx` → `TrackedLink`)
- Booking confirmation: "Back to Home" (`GamesPageClient.jsx`, already client)

**Mobile menu** — `mobile_menu_toggle`, params `{ state: "open" | "close" }`, hooked into `Navbar.jsx`'s existing `show.bs.collapse`/`hidden.bs.collapse` listeners on `#mainNav`.

**Rental policies** — `open_rental_policies`, params `{ location: "footer" | "homepage" | "games_page" }`, on each `data-bs-toggle="modal"` trigger for `#rentalPoliciesModal` (`Footer.jsx` and `page.jsx` via `TrackedElement`; `GamesPageClient.jsx` triggers already client, add `onClick` directly).

**Homepage accordions**:
- `policy_preview_expand`, params `{ policy_id }` — the 6-item rental policies preview accordion (`page.jsx`, ids `policy1`–`policy6`, via `TrackedElement`).
- `faq_expand`, params `{ faq_id }` — the FAQ accordion (`page.jsx`, ids `faq0`–`faq5`, via `TrackedElement`).

**Game discovery** (`GamesPageClient.jsx`, already client):
- `apply_filter`, params `{ filter }` — the All/Available/Booked filter `<select>`.
- `view_game_details`, params `{ game_slug, game_name }` — `openGameDetails`, covers both the game-grid card trigger and reuses the same path for the modal.
- `homepage_quick_add_click`, params `{ game_slug, game_name }` — the featured-card "Add to Booking" link on the homepage (`page.jsx` → `TrackedLink`, since the actual add happens after navigating to `/games?add=slug`).
- `quick_add_from_url`, params `{ game_slug }` — the `?add=` auto-add `useEffect`, fired once when a valid slug pre-selects a game on load (distinct from a manual click).

**Booking funnel** (`GamesPageClient.jsx`, already client):
- `check_availability`, params `{ start_date, end_date, rental_days }` — on a successful `checkAvailability` call from `handleDateFormSubmit`.
- `add_to_booking`, params `{ game_slug, game_name, price_per_day }` — `toggleGame`, on the add transition.
- `remove_from_booking`, params `{ game_slug, game_name }` — `toggleGame`, on the remove transition.
- `mobile_booking_summary_open` — the mobile "View Booking" offcanvas trigger button.
- `booking_summary_next`, params `{ num_games, grand_total }` — `handleSummaryNext`, only when it advances to step 2 (not on the initial-check branch, which already fires `check_availability`).
- `gcash_step_next`, params `{ grand_total }` — `handleGcashNext`.
- `submit_booking_attempt`, params `{ num_games, rental_days, grand_total }` — start of `handleBookingSubmit`, before calling `createBooking`.
- `booking_success`, params `{ booking_number, grand_total, num_games }` — on `createBooking` returning `{ success: true }`.
- `booking_error`, params `{ error_message }` — on `createBooking` returning `{ success: false }` or a thrown error.

## Out of Scope

- Server-side / Measurement Protocol events.
- GA4 Enhanced Ecommerce schema (`items[]`, `currency`, `value`) — plain custom events with flat params instead, since this isn't an ecommerce catalog.
- Cookie consent banner/gating (still not implemented, per the GA spec).
- GA4-auto-collected events (scroll depth, outbound clicks, session start) — Enhanced Measurement already covers these when enabled in the GA4 property; not re-implemented here.
- Any analytics provider other than GA4.
- GA4 property-side configuration (marking events as conversions, building funnel exploration reports) — that happens in the GA4 UI, not in code.

## Acceptance Criteria

- [ ] `src/lib/analytics.js` exports `trackEvent(eventName, params)`, wrapping `sendGAEvent`.
- [ ] `src/components/analytics/TrackedLink.jsx` and `TrackedElement.jsx` exist and are used for every server-component click target listed above.
- [ ] Every event in the taxonomy fires with the documented params, verified via the browser network tab (`google-analytics.com/g/collect` requests) or `window.dataLayer` inspection in dev.
- [ ] With `NEXT_PUBLIC_GA_MEASUREMENT_ID` unset, every tracked interaction still works with no console errors (events silently accumulate in `dataLayer`, nothing is sent).
- [ ] No visible UI/behavior change to any interaction — tracking is additive only.
- [ ] Production build passes.
