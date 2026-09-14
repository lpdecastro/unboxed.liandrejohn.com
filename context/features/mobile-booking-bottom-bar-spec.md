# Mobile Booking Bottom Bar Spec

## Task

Give mobile visitors to `/games` a persistent, glanceable view of their selected games and running total while they scroll the game grid, without pinning the full-size booking card across the phone viewport.

## Background

The "Your Booking" sidebar (`GamesPageClient.jsx`, step 1) uses Bootstrap's `sticky-top` and sits `order-first` above the game grid on mobile, since `col-lg-4`/`col-lg-8` stack full-width below `lg`. It's a genuine `position: sticky` element, but on a phone that means the whole card — rental dates, selected-games list, pricing breakdown — would stay pinned across most of the viewport while the user scrolls a multi-row grid beneath it. In practice that's not a usable pattern at phone width, so the useful behavior (seeing your running total while browsing) doesn't happen today.

The fix is the standard mobile cart pattern: a slim fixed bottom bar with count + total that expands the full summary via a Bootstrap Offcanvas on tap, replacing the top inline card on mobile for step 1 only. Desktop is untouched — the `sticky-top` sidebar already works well at `lg+`, where the grid and sidebar sit side by side.

## Requirements

- **Step 1 only.** Steps 2 (customer details) and 3 (GCash payment) keep today's single inline card, unchanged, on both mobile and desktop — there's no grid to scroll past on those steps.
- **Shared summary content, not a duplicate.** Extract the existing step-1 card body (rental-dates row, selected-games list with remove buttons, pricing breakdown, Next/Check Availability button — currently inlined in the `sticky-top` block) into one local render function inside `GamesPageClient.jsx` that both the desktop sidebar and the new mobile offcanvas call, so date/game/pricing logic is never forked. Parameterize the two date-input `id`/`htmlFor` pairs (`summaryEditStartDate`/`summaryEditEndDate`) with a prefix so the function can render twice in the DOM (desktop + mobile) without id collisions.
- **Desktop unchanged.** The step-1 card keeps rendering inside the existing `sticky-top` sidebar at `lg+`, gated with a `d-none d-lg-*` style breakpoint class so it doesn't also render inline on mobile.
- **Mobile bottom bar.** A `fixed-bottom`, `d-lg-none` bar (Bootstrap utility classes only, per `context/coding-standards.md`) shown when `currentStep === 1 && hasGames`:
  - Left: selected game count + running total (e.g. "2 games · ₱850").
  - Right: a "View Booking" control with a chevron icon, `data-bs-toggle="offcanvas" data-bs-target="#mobileBookingOffcanvas"` — self-wired by the existing `BootstrapClient` (bundle already loaded; no new ref/instance plumbing needed, matching how the navbar collapse and `RentalPoliciesModal` already work).
  - Not shown before any game is selected — the separate "Rental Date Selector" section above the grid remains the entry point at that stage and is untouched by this feature.
  - Add bottom spacing/padding to the page while the bar is present so it never overlaps the last row of game cards.
- **Mobile offcanvas.** A `.offcanvas.offcanvas-bottom` (id `mobileBookingOffcanvas`) with a header (title + `data-bs-dismiss="offcanvas"` close button) and body rendering the shared summary render function. Editing dates or removing a game inside the offcanvas updates the same component state as the desktop sidebar. Tapping Next inside the offcanvas advances to step 2 exactly as it does today from the desktop sidebar.

## Out of Scope

- Any change to steps 2 or 3 (customer details, GCash payment) on either breakpoint.
- Any change to the desktop (`lg+`) layout or behavior.
- Any change to the top-of-page "Rental Date Selector" section or its availability-check flow.
- New CSS beyond Bootstrap utility classes — no custom stylesheet additions.
- Persisting bar/offcanvas open state, animations beyond Bootstrap's defaults, or a "mini cart" on any other page.

## Acceptance Criteria

- [ ] At `lg+` widths, the games page looks and behaves exactly as it does today (sticky sidebar, no bottom bar, no offcanvas).
- [ ] Below `lg`, on step 1 with zero games selected, no bottom bar and no top summary card render; the top-of-page date selector still works as today.
- [ ] Below `lg`, on step 1 after adding at least one game, a fixed bottom bar appears showing the correct game count and total, and stays fixed while the grid scrolls beneath it without being covered by it.
- [ ] Tapping "View Booking" opens a bottom offcanvas showing the same rental dates, selected games (with working Remove), and pricing breakdown as the desktop sidebar, with no duplicate-id console warnings.
- [ ] Editing dates or removing a game from inside the offcanvas updates the bottom bar's count/total and the underlying state identically to editing from the desktop sidebar.
- [ ] Tapping Next inside the offcanvas advances to step 2, and the bottom bar/offcanvas no longer render (step 2 shows the existing single inline card, unchanged).
- [ ] `npm run build` passes with no errors.
