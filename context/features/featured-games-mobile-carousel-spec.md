# Featured Games Mobile Carousel Spec

## Task

Show the homepage's Featured Games section as a swipeable Bootstrap carousel on mobile, keeping the existing grid layout unchanged from `sm`/`lg` and up.

## Requirements

- Scope is the "Featured Games" section in [src/app/page.jsx](../../src/app/page.jsx) only — the `id="games"` section rendering `featuredGames` (currently `monopoly`, `exploding-kittens`, `monopoly-deal`, `herd-mentality`). The full game grid on `/games` (`GamesPageClient.jsx`) is untouched.
- Below `sm` (< 576px): render a Bootstrap carousel (`.carousel.slide`), one game per slide, using the same per-game card markup that's on desktop today (image, name, short description, price/day, players, play time, "Add to Booking" button) so content doesn't regress on mobile.
  - Include prev/next controls (`carousel-control-prev`/`-next`) and slide indicators.
  - No autoplay (`data-bs-ride` omitted) — this is a manual browse carousel, not a rotating banner; autoplaying would fight with the "Add to Booking" tap target and the description-clamp reading time.
  - Bootstrap's carousel JS is already loaded globally via `BootstrapClient` (self-wires any `data-bs-*` element), so no new JS is required beyond the markup.
- At `sm` and up (≥ 576px): keep the current `row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4` grid exactly as it renders today, gated `d-none d-sm-block` (or equivalent) so it doesn't also render on mobile.
- Both the mobile carousel and the desktop/tablet grid render from the same `featuredGames` array and the same per-card JSX — extract the existing card body (image, title, description, price, meta list, CTA) into a small local helper (e.g. a `renderGameCard(game)` function inside `HomePage`, mirroring the shared-render pattern already used for the booking summary in `GamesPageClient.jsx`) so the two layouts can't drift apart when a game's fields change.
- Carousel slide height will vary by game description length — use a fixed-height or `d-flex`/`h-100` wrapper on the card inside each `carousel-item` so slides don't jump height as the user swipes (same fix already applied via `card-desc-clamp` on desktop).
- Per `coding-standards.md`, use Bootstrap classes/components only (`.carousel`, `.carousel-item`, `.carousel-control-*`, `.carousel-indicators`) — no custom carousel CSS beyond what's unsupported by Bootstrap out of the box (e.g. reusing the existing `card-desc-clamp` class for the clamp, scoped in `main.scss` the same way `.game-card` is today).

## Out of Scope

- The `/games` listing page grid (`GameCard.jsx`) — no carousel there.
- Autoplay, swipe-gesture libraries, or lazy-loading beyond what `next/image` already does.
- Changing which 4 games are featured or the "View All 8 Games" / "also available" copy below the grid.

## Acceptance Criteria

- [ ] Below 576px, Featured Games renders as a single-column Bootstrap carousel (one game per slide) with working prev/next controls and indicators, no autoplay.
- [ ] At 576px and up, Featured Games renders exactly as today's grid — no visual change on tablet/desktop.
- [ ] Both layouts render the same 4 games with identical card content (image, name, description, price, players, play time, Add to Booking) from one shared render helper.
- [ ] Carousel slides hold a consistent height while swiping between games with different description lengths.
- [ ] "Add to Booking" links inside carousel slides still navigate to `/games?add={slug}` and behave identically to the grid version.
- [ ] Production build passes.
- [ ] Manually verified (or Playwright-verified) at a mobile viewport width and at `sm`/`lg` breakpoints that the correct layout renders and the carousel is swipeable/clickable.
