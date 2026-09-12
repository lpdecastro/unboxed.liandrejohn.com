# Current Feature

## Goals

<!-- Goals for the active feature go here -->

## Notes

<!-- Additional context, constraints, or details from spec go here -->

## History

### Homepage

Built the homepage per `context/features/homepage-spec.md`: Navbar, Hero, Featured Games, How It Works, Why Rent From Unboxed, Pricing/Rental Highlights, Rental Policies Preview, Final CTA, and Footer, with theme variable overrides for a fun, trustworthy, board-game-friendly look. Responsive on desktop and mobile.

### Image Optimization

Optimized and integrated the provided game box photos and logo per `context/features/image-opt-spec.md`. Cropped the 4 available game photos (Monopoly, Exploding Kittens, Monopoly Deal, Herd Mentality) to a consistent square aspect ratio, resized, and compressed to web-friendly JPEGs (~344KB total, down from ~4.1MB of raw source photos), replacing the icon placeholders on the homepage's featured game cards. Cropped a transparent navbar-mark PNG from the full logo artwork and wired it into the navbar brand. Source images were actually at root `img/` rather than the `context/img/` path the spec referenced. Game of Life, Piles, RC Plane, and Jackstones still have no source photos and are still pending.
