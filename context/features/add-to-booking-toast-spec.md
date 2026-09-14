# Add to Booking Toast Spec

## Task

Show a toast notification confirming a game was added to the booking, on both the games page grid and the game details modal, using the `react-toastify` library.

## Coding Standards Exception

- `context/coding-standards.md` specifies Bootstrap CSS/Icons only, with no custom CSS unless a need isn't covered by Bootstrap. `react-toastify` is a new third-party dependency with its own CSS, which is a deliberate, explicitly-requested exception for this feature only — not a precedent for future UI work. Keep the exception scoped to this one notification; don't introduce other non-Bootstrap UI libraries as a side effect.

## Requirements

- A game is only ever added via `toggleGame` in `src/app/games/GamesPageClient.jsx` (called from `GameCard`'s "Add to Booking" button and `GameDetailsModal`'s toggle button). Fire the toast only on the add transition (slug going from not-selected to selected) — not on remove, and not on the pre-fill add from `?add={slug}` (`context/features/home-add-to-booking-spec.md`) since that flow already auto-scrolls to the summary as its own confirmation.
- Toast content: the game name and a short confirmation, e.g. "{Game Name} added to your booking." Include a `bi-check-circle` icon (Bootstrap Icons, `<i className="bi bi-check-circle">`) consistent with the "Added" button state in `GameCard`.
- Add `react-toastify` as a dependency. Render a single `<ToastContainer />` once in `GamesPageClient.jsx` (it's already `"use client"`), and call `toast(...)` from the `toggleGame` add branch.
- Import `react-toastify/dist/ReactToastify.css` once (e.g. in `GamesPageClient.jsx` or `src/app/layout.js`) — the one sanctioned non-Bootstrap stylesheet for this feature; do not hand-write additional CSS on top of it beyond `ToastContainer`/`toast()` options (position, autoClose, theme, etc.).
- Position/behavior: bottom-end (or bottom-center on mobile) via `ToastContainer`'s `position` prop, short `autoClose` duration, and default `toastId` per game slug (`toast(..., { toastId: game.slug })`) so re-adding the same game while its toast is still visible updates it instead of stacking a duplicate.
- Removing a game does not show a toast (matches existing silent "Remove" link behavior in the sticky summary).

## Integration

- `npm install react-toastify`.
- `toggleGame(slug)` needs to know whether the slug is being added or removed to decide whether to trigger the toast — check `prev.has(slug)` before mutating, and only call `toast(...)` when it was not previously present. Look up the game's name from `games` (already a prop) for the message.
- No Bootstrap `Modal`-style instance/ref plumbing needed — `react-toastify`'s `toast()` function call replaces that pattern entirely for this notification.

## Out of Scope

- Toasts for other actions (removing a game, submitting a booking, availability check results, form errors) — those keep their existing inline alert/badge treatment.
- The `?add=` pre-fill flow's own toast (explicitly excluded above).
- Migrating any other UI (modals, alerts, badges) off Bootstrap onto `react-toastify` or another library.

## Acceptance Criteria

- [ ] `react-toastify` added to `package.json` dependencies.
- [ ] Clicking "Add to Booking" on a `GameCard` shows a toast naming that game.
- [ ] Toggling "Add to Booking" inside `GameDetailsModal` shows the same toast.
- [ ] Removing a game (card toggle-off, or the sticky summary's "Remove" link) does not show a toast.
- [ ] Landing on `/games?add={slug}` does not show the toast.
- [ ] Adding a second game while a toast is already visible does not stack duplicate toasts.
- [ ] `ReactToastify.css` is the only non-Bootstrap stylesheet introduced; no additional custom CSS added.
- [ ] Production build passes.
