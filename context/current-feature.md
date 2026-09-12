# Current Feature: Image Optimization

## Goals

- Optimize and integrate the provided source images so they display consistently across game cards and the navbar logo.
- Preserve original aspect ratios; crop only when necessary, keeping the main subject visible and well-positioned.
- Use consistent aspect ratios across all game-card images, and appropriate `object-fit`/positioning where cropping is handled by the UI.
- Optimize file size while maintaining good visual quality; avoid dimensions much larger than rendered size; prefer modern web-friendly formats where appropriate.
- Reuse the same optimized asset where an image appears multiple times.
- Add the correct optimized images to each game card and the correct logo asset to the navbar.
- Use meaningful `alt` text for content images and empty `alt` text for purely decorative images.
- Preserve existing layout/component behavior unless an adjustment is required for proper image presentation.
- No broken image paths; correct display on both desktop and mobile.

## Notes

- Spec: `context/features/image-opt-spec.md`.
- Spec references source images at `@context/img/`, but that path doesn't exist. The actual untracked source images are at `img/` in the repo root: `Monopoly.JPG`, `Monopoly_Deal.JPG`, `Exploding_Kittens.JPG`, `Herd_Mentality.JPG`, `Logo.png`. Use this location unless told otherwise.
- Only 5 of the 8 games have source images so far (missing: Game of Life, Piles, RC Plane, Jackstones) — those game cards will keep their current placeholder/fallback treatment until images are provided.
- Follow `context/coding-standards.md`: Bootstrap/Bootstrap Icons only, no custom CSS unless unsupported by Bootstrap.

## History

### Homepage

Built the homepage per `context/features/homepage-spec.md`: Navbar, Hero, Featured Games, How It Works, Why Rent From Unboxed, Pricing/Rental Highlights, Rental Policies Preview, Final CTA, and Footer, with theme variable overrides for a fun, trustworthy, board-game-friendly look. Responsive on desktop and mobile.
