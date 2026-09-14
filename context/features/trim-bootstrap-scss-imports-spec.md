# Trim Bootstrap SCSS Imports Spec

## Task

Shrink the compiled Bootstrap CSS bundle (currently 320KB, the dominant render-blocking request flagged by PageSpeed Insights on both `/` and `/games`) by importing only the Bootstrap component partials this site actually uses, instead of the single `@import "bootstrap/scss/bootstrap"` that pulls in every component.

## Background

`src/scss/main.scss` currently does:

```scss
@import "variables";
@import "bootstrap/scss/bootstrap";
@import "bootstrap-icons/font/bootstrap-icons";
```

`bootstrap/scss/bootstrap.scss` imports every partial Bootstrap ships (config/mixins, then ~30 layout/component partials, then helpers and the utilities API). A component audit of the actual codebase (every `.jsx`/`.js` file under `src/`, every `data-bs-*` attribute, every Bootstrap component class) found real usage of only a subset. This is Bootstrap's own documented customization pattern (their docs show commenting out unused lines from this exact import stack) — safer than hand-rolling a custom subset, since partial ordering and config/mixin dependencies stay exactly as Bootstrap intends.

## Requirements

Replace the single `@import "bootstrap/scss/bootstrap"` in `src/scss/main.scss` with Bootstrap's own import stack, keeping every partial in its original order, commenting out (not deleting — keeps the diff reviewable and easy to re-enable one at a time) the ones confirmed unused:

**Keep (config/foundation — always required):**
`functions`, `variables`, `variables-dark`, `maps`, `mixins`, `utilities`, `root`, `reboot`, `type`, `images`, `containers`, `grid`, `helpers`, `utilities/api`

**Keep (component confirmed in use):**
- `forms` — `form-control`, `form-label`, `form-select`, `invalid-feedback`/`valid-feedback`, `was-validated` (booking form, filter select)
- `buttons` — `btn`, `btn-outline-*`, etc., throughout
- `transitions` — backs the fade/collapse animations modal, accordion, and collapse all rely on
- `nav` — `nav-link` (inside navbar)
- `navbar` — site header
- `card` — game cards, summary panels, most section content
- `accordion` — homepage FAQ + rental policies preview
- `badge` — availability badges (`GameCard.jsx`), step-summary badges
- `alert` — form/validation error messages, out-of-area warning (`AddressAutocomplete.jsx`)
- `close` — `btn-close` (modal, offcanvas, navbar)
- `modal` — game details modal, rental policies modal
- `carousel` — homepage mobile featured-games carousel
- `offcanvas` — mobile booking summary

**Drop (no usage found anywhere in `src/`):**
- `tables` — no `<table>` or Bootstrap table classes
- `dropdown` — no dropdown menus
- `button-group` — no `btn-group`
- `breadcrumb` — not used
- `pagination` — not used
- `progress` — no progress bars
- `list-group` — not used
- `toasts` — the site uses `react-toastify` (its own separate CSS import) for toasts, not Bootstrap's `.toast` component
- `tooltip` — not used
- `popover` — not used
- `spinners` — no loading spinners
- `placeholders` — no placeholder/skeleton loading state

## Verification

No automated visual regression tooling exists in this repo, so verification is manual against both pages, checking every component in the "keep" list actually still renders/behaves correctly:

- `/`: navbar (incl. mobile collapse + auto-hide), hero, featured game cards (carousel on mobile, grid on desktop), accordions (rental policies preview, FAQ), badges, footer (dark theme via `data-bs-theme="dark"`)
- `/games`: game grid + cards (badges, availability states), filter `form-select`, game details modal, rental policies modal, mobile booking offcanvas, sticky desktop summary, all booking-flow form inputs + validation states (`invalid-feedback`, `alert-danger`), GCash step, customer-details step, `AddressAutocomplete`'s out-of-area alert, submit/confirmation state
- Confirm no unstyled/broken elements anywhere on either page (a dropped partial silently breaking something would show as missing styling, not a build error — Sass won't fail to compile just because a component's classes have no matching rules)
- `npm run build` passes with no new warnings
- Compare the compiled CSS file size before/after (baseline: 320KB) to confirm a meaningful reduction

## Out of Scope

- Trimming `bootstrap.bundle.min.js` (Bootstrap's JS, loaded via `BootstrapClient.jsx`) — that's a separate bundle/concern from the CSS this spec targets, and Popper/JS components aren't part of the render-blocking CSS request PSI flagged.
- Any change to `react-toastify`'s CSS import or Bootstrap Icons.
- Critical-CSS inlining or any other delivery-mechanism change (already investigated separately — Next's `experimental.optimizeCss`/critters was tried and found to have no effect on this app's App Router output).
- Any visible layout, copy, or booking-flow behavior change — this is a byte-size reduction only.
- Re-adding a dropped component later if a future feature needs it (e.g. a future spinner or tooltip) — that's a one-line uncomment when the need arises, not a reason to keep it now.

## Acceptance Criteria

- [ ] `src/scss/main.scss` imports Bootstrap via its individual partials (per the keep list above) instead of the single `bootstrap/scss/bootstrap` import.
- [ ] All twelve unused partials listed above are commented out (not deleted).
- [ ] `npm run build` passes with no new warnings.
- [ ] Compiled CSS bundle size is meaningfully smaller than the 320KB baseline.
- [ ] Every component in the "keep" list is manually verified working on both `/` and `/games`, including interactive states (modal open/close, offcanvas open/close, accordion expand/collapse, carousel swipe, navbar mobile collapse + auto-hide, form validation styling, alerts, badges) and the dark footer theme.
- [ ] No visible layout, spacing, or styling regressions anywhere on either page.
- [ ] `current-feature.md` updated per the standard workflow once implemented.
