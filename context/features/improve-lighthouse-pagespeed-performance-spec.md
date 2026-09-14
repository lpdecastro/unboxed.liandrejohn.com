# Improve Lighthouse & PageSpeed Insights Performance (Mobile) Spec

## Task

Reduce render-blocking requests, unnecessary payload weight, and initial JS on `/` and `/games` to raise the mobile Lighthouse/PSI performance score, without changing any visible layout, copy, or booking-flow behavior.

## Findings (current state)

- **Google Fonts loaded via a render-blocking `<link>`** (`src/app/layout.jsx`): `preconnect` + a `fonts.googleapis.com/css2?...` stylesheet `<link>` in `<head>`. This costs an extra font-origin round trip (DNS/TLS/request) before text can render in the final webfont, on top of Next's own document request — a classic PSI "Eliminate render-blocking resources" / "Reduce unused CSS" flag.
- **`favicon.png` is 836KB and bypasses image optimization** (`public/img/favicon.png`, referenced directly via `metadata.icons` in `src/app/layout.jsx`). Unlike every other image on the site, favicon/apple-icon links are not routed through `next/image`, so the browser fetches the full, unresized file. This is an oversized, easily-cached-but-still-unnecessary request on every page load.
- **`logo.png` / `logo-dark.png` are 552–581KB source files** (`public/img/`) used at small navbar/footer sizes via `next/image` (`src/components/Navbar.jsx`, `src/components/Footer.jsx`). `next/image` resizes the *served* bytes correctly, but the oversized source still costs the optimizer real work per unique size/format requested (cold-cache latency) and is worth trimming at the source like the rest of `public/img/` already was per `context/features/image-opt-spec.md`.
- **`@googlemaps/js-api-loader` and `AddressAutocomplete` ship in `/games`'s initial JS bundle** even though the component only renders at `currentStep === 3` (`src/app/games/GamesPageClient.jsx`), i.e. after a customer has already picked dates, games, and reached the GCash/details step. It's a static top-level import, so its module code is parsed/executed as part of the initial client bundle regardless of whether that step is ever reached in a given session — this adds to mobile Total Blocking Time / INP on first load of `/games`.
- **`GameDetailsModal` (with its own `next/image`, larger markup) is statically imported and always mounted** on `/games`, even though it's only shown after a user clicks into a specific game's details. Same class of issue as above — unnecessary JS parsed/executed before first interaction.
- Everything else already follows current best practice and is **out of scope for changes**: `next/image` with correct `sizes`/`fill`/`priority` on the hero and all game images, `GoogleAnalytics` from `@next/third-parties` (already deferred/non-blocking by default), `BootstrapClient` (already a client-only dynamic import so Bootstrap's JS never touches SSR), and the Web3Forms call (already fired client-side, non-blocking, fire-and-forget).

## Requirements

### Font loading

- Replace the manual `<link rel="preconnect">` / `<link rel="stylesheet" href="fonts.googleapis.com/...">` pair in `src/app/layout.jsx` with `next/font/google` (`Inter`, weights 400/500/600/700; `Poppins`, weights 600/700 — matching the current families/weights exactly). Self-hosts the font files at build time (no third-party request at runtime), applies `display: swap` by default, and removes the render-blocking stylesheet fetch entirely.
- Wire the generated font CSS variables into `<html>`/`<body>` and reference them from `_variables.scss` (or wherever the current `font-family` overrides live) so rendered typography is unchanged.

### Icon/favicon optimization

- Replace `public/img/favicon.png` with a properly-sized favicon (e.g. 32×32 or 48×48 `.png`, plus a larger ~180×180 variant for `apple-icon` if not already distinct) generated from the same source art. Target combined weight in the low tens of KB, not hundreds.
- Keep `metadata.icons` in `src/app/layout.jsx` pointing at the new file(s); no path/behavior change beyond the file itself.

### Source image trim

- Re-export `logo.png` and `logo-dark.png` at a size appropriate for their largest actual rendered use (navbar brand mark / footer mark), following the same crop/compress approach already used for the other site images in `context/features/image-opt-spec.md`. Do not change the components that reference them — `next/image` continues to resize per breakpoint as it does today.

### Defer step-gated / interaction-gated client code on `/games`

- Convert the `AddressAutocomplete` import in `src/app/games/GamesPageClient.jsx` to a lazy (`next/dynamic`) import, so `@googlemaps/js-api-loader` and its component code are only fetched once the customer-details step is reached, not bundled into the page's initial JS.
- Convert the `GameDetailsModal` import to a lazy (`next/dynamic`) import as well, since it's only needed once a user opens a game's details.
- Preserve existing behavior exactly: same ref-driven `Modal` instance pattern for `GameDetailsModal`, same conditional `currentStep === 3` gating and Metro Manila validation for `AddressAutocomplete`. A brief loading state during the dynamic chunk fetch is acceptable as long as it doesn't shift layout (reserve the same space the component currently occupies).

## Out of Scope

- Rewriting Bootstrap SCSS imports to hand-pick only the components in use (`src/scss/main.scss` currently `@import`s the full `bootstrap/scss/bootstrap`) — a real CSS-weight win, but a larger, riskier change against the "Bootstrap CSS only" coding standard that deserves its own spec and visual regression pass.
- Any change to booking logic, availability checks, pricing, or server actions.
- Adding a CDN, edge caching, or hosting/infra changes (deployment is unchanged, still targeting AWS Amplify per the roadmap).
- Converting any currently-server component to client or vice versa.
- Lighthouse/PSI score targets or CI budget enforcement — this spec is about fixing the concrete issues found above, not setting up ongoing performance gating.

## Documentation

- Update `current-feature.md` history entry (per the standard workflow) noting the before/after favicon and logo file sizes, and confirming the dynamic-import behavior change was smoke-tested (modal open, address autocomplete at step 3) since no Lighthouse CI is configured in this repo — verification will be manual (`npm run build` + a Lighthouse/PSI run against a deployed or `next start` build).

## Acceptance Criteria

- [ ] `src/app/layout.jsx` uses `next/font/google` for Inter and Poppins (same weights); no `fonts.googleapis.com` `<link>` remains in the rendered `<head>`.
- [ ] Rendered typography on `/` and `/games` is visually unchanged from before the font change.
- [ ] `public/img/favicon.png` (and apple-icon variant if separate) is resized to an appropriately small favicon dimension; combined favicon asset weight drops from ~836KB to under ~50KB.
- [ ] `public/img/logo.png` and `logo-dark.png` are re-exported at a reasonable source size for their rendered use, with no visible quality loss in the navbar/footer.
- [ ] `AddressAutocomplete` is dynamically imported in `GamesPageClient.jsx`; the Google Maps loader is not present in `/games`'s initial JS chunk, and the address step still validates Metro Manila addresses and drops the map pin correctly.
- [ ] `GameDetailsModal` is dynamically imported in `GamesPageClient.jsx`; opening any game's details still works via the existing ref-driven `Modal` instance.
- [ ] `npm run build` passes with no new warnings.
- [ ] A Lighthouse/PSI mobile run (manual, against a production build) shows measurable improvement in performance score and reduced render-blocking/unused-JS flags versus a baseline run captured before these changes.
- [ ] `current-feature.md` updated per the standard workflow once implemented.
