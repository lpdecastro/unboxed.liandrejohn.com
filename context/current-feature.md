# Current Feature: Game Listing Page

## Goals

- Build the Game Listing Page combining: page header, rental date selector, game filters, game grid (all 8 games), game details modal, sticky booking summary, customer details, GCash payment, rental agreement, submit booking, and booking confirmation state — all on one page.
- All content sourced from `context/contents/game-listing-page.md` in the given section order; don't invent new sections unless solving a clear UX problem.
- Design: fun, modern, friendly, trustworthy, slightly playful board-game feel — avoid childish/toy-store styling, excessive decoration, overly saturated colors, cluttered layouts.
- UX priorities: easy scanning of games, clear pricing/availability/actions, strong card vs. control distinction, simple filtering, consistent card structure, generous spacing.
- Responsive: desktop and mobile (grid 3–4 cols desktop, 2 tablet, 1 mobile; sticky summary moves below content on mobile).
- Handle empty (no games added), loading/before-date-selection, and no-results states.
- Prefer existing Bootstrap patterns/components over custom ones.

## Notes

- Spec file: `context/features/game-listing-page-spec.md`; content source: `context/contents/game-listing-page.md`.
- No backend exists yet (per `CLAUDE.md`) — availability checking, booking submission, and the confirmation state should be built as front-end/UI states (e.g. toggled via JS) rather than wired to a real API or database.
- Game metadata (players, play time, ages) in the content file is draft/placeholder and flagged as unverified against the actual owned copies — do not "fix" it, just use as given.
- Games needing details modal + card content: Monopoly, Exploding Kittens, Monopoly Deal, Game of Life, Herd Mentality, Piles, RC Plane, Jackstones.
- Only 4 games currently have real photos (Monopoly, Exploding Kittens, Monopoly Deal, Herd Mentality) per image-opt-spec history; Game of Life, Piles, RC Plane, Jackstones still need placeholders.
- GCash section needs a QR code image/placeholder; none currently exists in the repo — flag if a real QR isn't available.
- Rental Agreement's full policy text should open in a modal/accordion, kept out of the main booking flow (mirrors homepage's Rental Policies Preview pattern).
- 10% multi-game discount applies only to rental subtotal, not deposits (per business rules in `context/project-overview.md`).

## History

- Built the homepage per `context/features/homepage-spec.md`: Navbar, Hero, Featured Games, How It Works, Why Rent From Unboxed, Pricing/Rental Highlights, Rental Policies Preview, Final CTA, and Footer, with theme variable overrides for a fun, trustworthy, board-game-friendly look. Responsive on desktop and mobile.
- Optimized and integrated the provided game box photos and logo per `context/features/image-opt-spec.md`. Cropped the 4 available game photos (Monopoly, Exploding Kittens, Monopoly Deal, Herd Mentality) to a consistent square aspect ratio, resized, and compressed to web-friendly JPEGs (~344KB total, down from ~4.1MB of raw source photos), replacing the icon placeholders on the homepage's featured game cards. Cropped a transparent navbar-mark PNG from the full logo artwork and wired it into the navbar brand. Source images were actually at root `img/` rather than the `context/img/` path the spec referenced. Game of Life, Piles, RC Plane, and Jackstones still have no source photos and are still pending.
