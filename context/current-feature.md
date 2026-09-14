# Current Feature

## Goals

<!-- Goals for the active feature go here -->

## Notes

<!-- Additional context, constraints, or details from spec go here -->

## History

- Built the homepage per `context/features/homepage-spec.md`: Navbar, Hero, Featured Games, How It Works, Why Rent From Unboxed, Pricing/Rental Highlights, Rental Policies Preview, Final CTA, and Footer, with theme variable overrides for a fun, trustworthy, board-game-friendly look. Responsive on desktop and mobile.
- Optimized and integrated the provided game box photos and logo per `context/features/image-opt-spec.md`. Cropped the 4 available game photos (Monopoly, Exploding Kittens, Monopoly Deal, Herd Mentality) to a consistent square aspect ratio, resized, and compressed to web-friendly JPEGs (~344KB total, down from ~4.1MB of raw source photos), replacing the icon placeholders on the homepage's featured game cards. Cropped a transparent navbar-mark PNG from the full logo artwork and wired it into the navbar brand. Source images were actually at root `img/` rather than the `context/img/` path the spec referenced. Game of Life, Piles, RC Plane, and Jackstones still have no source photos and are still pending.
- Built the Game Listing Page (`games.html`) per `context/features/game-listing-page-spec.md`: rental date selector, game filters, game grid for all 8 games, game details modal, sticky booking summary, customer details, GCash payment, rental agreement, submit booking, and a front-end-only booking confirmation state, all wired together with JS since no backend exists yet. Iterated on the initial layout post-build: dropped the page header and hero image in favor of a visually-hidden `<h1>`, trimmed section padding throughout, replaced each card's "View Details" button with a clickable image/heading (data-bs-toggle triggers), stacked card CTAs, dropped the age line from cards, and widened the largest container breakpoints (xl/xxl) site-wide for more room on desktop. Game of Life, Piles, RC Plane, and Jackstones still use placeholder art, and the GCash section still needs a real QR code.
- Converted the static site to Next.js (App Router) per `context/features/convert-to-nextjs-spec.md`: home (`/`) and games (`/games`) became routes, navbar/footer/rental-policies-modal became shared components, the 8-game catalog was consolidated into a single `src/data/games.js` source of truth, and the games page's vanilla-JS booking flow (dates, availability, multi-game selection, pricing, GCash step, customer details, confirmation) was rewritten with React state/hooks. Bootstrap's JS now loads client-side only via a `BootstrapClient` component to avoid SSR errors, with the game details modal driven programmatically via a ref. Static assets moved into `public/`; Bootstrap Icons fonts now sync automatically before `dev`/`build`. Verified with a clean production build and a `next start` smoke test.
