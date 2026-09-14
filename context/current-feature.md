# Current Feature: Convert to Next.js

## Goals

- Convert the existing static Bootstrap + Sass site to Next.js while preserving current design, content, and behavior.
- Keep Bootstrap as the UI framework and keep Sass with existing Bootstrap variable overrides.
- Preserve current visual design, layout, content, images, links, and interactions as closely as possible.
- Convert existing pages (`index.html`, `games.html`) into appropriate Next.js routes.
- Convert reusable page sections (navbar, footer, cards, buttons, common sections) into shared React components.
- Move static assets to the appropriate Next.js public asset structure.
- Replace static HTML-specific patterns with Next.js equivalents (routing, layouts, metadata, images, assets).
- Project must run as a Next.js app, build successfully for production, and work correctly on desktop and mobile with no broken imports, missing assets, console errors, or build errors.

## Notes

- Source spec: `context/features/convert-to-nextjs-spec.md`.
- Do not redesign the site during migration; use existing structure/styling as source of truth.
- Do not introduce a new UI framework or CSS library; avoid unnecessary dependencies.
- Keep Bootstrap utility/component classes where they already work well; preserve existing Sass organization and overrides where practical.
- Keep implementation simple and suitable for future feature development (this is the first step toward the roadmap's Next.js + MongoDB + Web3Forms + AWS Amplify plan noted in `CLAUDE.md`).
- `css/` and `js/` are currently gitignored build output from the Sass/Bootstrap-copy scripts — migration will need to rethink this pipeline under Next.js (e.g. Sass compiled via Next's built-in Sass support instead of the current npm scripts).
- Existing games.html booking flow JS (date selector, availability, booking summary, GCash, submit) is front-end-only (no backend yet) and must keep working after conversion to React/Next.js.

## History

- Built the homepage per `context/features/homepage-spec.md`: Navbar, Hero, Featured Games, How It Works, Why Rent From Unboxed, Pricing/Rental Highlights, Rental Policies Preview, Final CTA, and Footer, with theme variable overrides for a fun, trustworthy, board-game-friendly look. Responsive on desktop and mobile.
- Optimized and integrated the provided game box photos and logo per `context/features/image-opt-spec.md`. Cropped the 4 available game photos (Monopoly, Exploding Kittens, Monopoly Deal, Herd Mentality) to a consistent square aspect ratio, resized, and compressed to web-friendly JPEGs (~344KB total, down from ~4.1MB of raw source photos), replacing the icon placeholders on the homepage's featured game cards. Cropped a transparent navbar-mark PNG from the full logo artwork and wired it into the navbar brand. Source images were actually at root `img/` rather than the `context/img/` path the spec referenced. Game of Life, Piles, RC Plane, and Jackstones still have no source photos and are still pending.
- Built the Game Listing Page (`games.html`) per `context/features/game-listing-page-spec.md`: rental date selector, game filters, game grid for all 8 games, game details modal, sticky booking summary, customer details, GCash payment, rental agreement, submit booking, and a front-end-only booking confirmation state, all wired together with JS since no backend exists yet. Iterated on the initial layout post-build: dropped the page header and hero image in favor of a visually-hidden `<h1>`, trimmed section padding throughout, replaced each card's "View Details" button with a clickable image/heading (data-bs-toggle triggers), stacked card CTAs, dropped the age line from cards, and widened the largest container breakpoints (xl/xxl) site-wide for more room on desktop. Game of Life, Piles, RC Plane, and Jackstones still use placeholder art, and the GCash section still needs a real QR code.
