# Current Feature: Homepage

## Goals

- Build the homepage per `context/features/homepage-spec.md`, using `context/contents/homepage.md` as the source of truth for content, section order, and recommended presentation.
- Follow the standard section order: Navbar, Hero, Featured Games, How It Works, Why Rent From Unboxed, Pricing/Rental Highlights, Rental Policies Preview, Final CTA, Footer.
- Deliver a page that reads as fun, modern, friendly, trustworthy, and slightly playful with a board-game feel — without tipping into childish/toy-store styling, excessive decoration, oversaturated colors, or clutter.
- Prioritize strong visual hierarchy, easy scanning, clear primary CTAs, generous spacing, consistent section rhythm, and a clear distinction between interactive and non-interactive elements.
- Ensure the page works well on both desktop and mobile.

## Notes

- Do not invent new sections beyond the reference content unless solving a clear UX problem.
- Avoid unnecessary custom components when Bootstrap already provides a suitable pattern (per coding standards: Bootstrap/Bootstrap Icons only, no custom CSS unless unsupported).
- Calculate all prices/content directly from the reference files — no backend yet, this is still the static Bootstrap + Sass site.
- Acceptance criteria: all homepage content represented, section order consistent with reference, cohesive visual direction, primary actions immediately understandable, responsive on desktop/mobile.

## History