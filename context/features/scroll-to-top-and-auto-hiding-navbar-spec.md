# Scroll-to-Top and Auto-Hiding Navbar Spec

## Task

Add a "scroll to top" button that appears after scrolling down, and make the sticky navbar hide on scroll-down and reappear on scroll-up, on both `/` and `/games`.

## Behavior

**Auto-hiding navbar**

- `Navbar` (`src/components/Navbar.jsx`) becomes scroll-aware: while the user scrolls down past a small threshold (e.g. 80px, to ignore tiny/rubber-band scroll jitter near the top), the navbar slides out of view; scrolling up at any point slides it back in immediately.
- Always visible at the very top of the page (scrollY near 0), regardless of last scroll direction.
- Hide via a CSS `transform: translateY(-100%)` transition on the existing `sticky-top` header, not `display`/`visibility` — both call sites (`src/app/page.jsx`, `src/app/games/GamesPageClient.jsx`) read `document.getElementById("siteHeader"/"mainNav").offsetHeight` to offset scroll targets, and that must keep returning the real header height even while the header is translated off-screen.
- Navbar becomes a client component (`"use client"`) to own the scroll listener; it already renders identically from both a server component (`page.jsx`) and a client component (`GamesPageClient.jsx`), so this doesn't change its props/usage.
- Collapsed mobile menu: if the navbar starts hiding while the `#mainNav` collapse is open, close it first (or simply don't hide while it's open) so the menu can't slide off-screen while expanded.

**Scroll-to-top button**

- A small circular icon button (`bi-arrow-up`), fixed to the bottom-right of the viewport, appears once the user has scrolled down past a threshold (reuse the same threshold as the navbar, e.g. 80px) and is hidden at/near the top.
- Clicking it smooth-scrolls to the top of the page (`window.scrollTo({ top: 0, behavior: "smooth" })`).
- Rendered once per page alongside the existing shared components (same pattern as `RentalPoliciesModal`), so it needs to be added to both `src/app/page.jsx` and `src/app/games/GamesPageClient.jsx`.
- On `/games`, keep it clear of the mobile `fixed-bottom` booking bar (`GamesPageClient.jsx`, shown only on step 1 once a game is selected) — position it high enough (e.g. `bottom` offset accounting for the bar's height on mobile, or hide it while that bar is visible) so the two never overlap.

## Implementation Notes

- New scroll listener logic (direction tracking + threshold) is plain JS/React state — no Bootstrap component covers "hide navbar on scroll direction" or "scroll to top," so a small client-side hook is unavoidable, but keep all visual styling to Bootstrap utilities plus the transform/transition rule itself.
- The transform + transition and the fixed-position button both need a few lines of scoped custom CSS in `src/scss/main.scss` (Bootstrap has no scroll-hide-navbar or back-to-top utility) — follow the existing pattern of small, commented, scoped exceptions already in that file (e.g. `.border-dashed`, `.view-details-trigger`).
- Consider extracting the scroll-direction/threshold tracking into a small shared hook (e.g. `useScrollDirection` or inline in `Navbar.jsx` and reused for the button) so the two features don't duplicate scroll-listener logic — the button can live in its own small client component (e.g. `src/components/ScrollToTopButton.jsx`) that owns its own listener rather than threading state from `Navbar`.
- Use a passive scroll listener and avoid re-rendering on every scroll pixel (e.g. only update state on direction/threshold changes, not raw scrollY) to keep scrolling smooth.

## Out of Scope

- Auto-hiding or otherwise altering the mobile booking bottom bar or offcanvas on `/games` — only the top navbar and the new scroll-to-top button are in scope.
- Any change to navbar content, links, or the mobile collapse menu itself beyond the show/hide behavior.

## Acceptance Criteria

- [ ] Navbar hides (slides up) when scrolling down past the threshold, reappears immediately when scrolling up, and is always visible at the top of the page, on both `/` and `/games`.
- [ ] Navbar hide/show never breaks the existing `siteHeader`/`mainNav` `offsetHeight`-based scroll offset calculations in `page.jsx` and `GamesPageClient.jsx`.
- [ ] Mobile navbar collapse menu never gets hidden while open.
- [ ] Scroll-to-top button appears after scrolling past the threshold, is hidden near the top, and smooth-scrolls to top on click, on both `/` and `/games`.
- [ ] Scroll-to-top button never visually overlaps the mobile booking bottom bar on `/games`.
- [ ] No custom CSS beyond the small scoped exceptions needed for the transform/transition and fixed positioning (not supported by Bootstrap utilities).
- [ ] Production build passes.
