# Google Analytics Spec

## Task

Wire up Google Analytics (GA4) page view tracking across the site.

## Setup

- Add `@next/third-parties` as a dependency and use its `GoogleAnalytics` component (the standard Next.js App Router integration for GA4 — avoids hand-rolling `gtag.js` `<script>` tags).
- Render `<GoogleAnalytics gaId={...} />` once in the root layout (`src/app/layout.jsx`), which wraps every route. There are currently only two pages — `/` (homepage) and `/games` — and both render through this single root layout, so wiring it there covers both without per-page code.
- Read the GA4 measurement ID from a new `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var (must be `NEXT_PUBLIC_`-prefixed to reach the client, matching the existing `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` convention). Add it to `.env.example` with an empty value.
- If the env var is unset or empty, skip rendering `GoogleAnalytics` entirely (no script injected) — same degrade-gracefully pattern already used for the Maps key in `AddressAutocomplete.jsx`, so local dev without a `.env` value doesn't send traffic to GA and doesn't crash.

## Documentation

- Document the new env var in `README.md` alongside the existing `.env.example` / `MONGODB_URI` / Maps key setup notes.

## Out of Scope

- Custom event tracking (booking funnel steps, button clicks, form submissions) — page views only.
- Cookie consent banner or any consent-gating of the script.
- Any analytics provider other than Google Analytics.
- Server-side/Measurement Protocol events.

## Acceptance Criteria

- [ ] `@next/third-parties` added to `package.json` dependencies.
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` added to `.env.example`.
- [ ] `GoogleAnalytics` renders once from `src/app/layout.jsx`, conditional on the env var being set.
- [ ] With the env var unset, no GA script is injected and the app builds/runs with no errors.
- [ ] With the env var set to a real GA4 measurement ID, navigating between `/` and `/games` fires page view events (verify via the browser network tab or GA4 Realtime report).
- [ ] `README.md` documents the new env var.
- [ ] Production build passes.
