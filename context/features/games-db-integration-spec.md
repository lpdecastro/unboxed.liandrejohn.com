# Games DB Integration Spec

## Task

Replace `src/data/games.js` as the game catalog source with MongoDB, fetched through Next.js Server Actions instead of a static import or an API route.

## Schema Updates

* Extend the `Game` model (`src/models/Game.js`) with the fields `games.js` currently has that it's missing: `shortDescription`, `howToPlay`, `icon`, `placeholderBg` (optional), `age`.
* Update `src/data/games.json` to match the extended schema, migrating the real content currently in `src/data/games.js` (not placeholder data).
* Re-seed local MongoDB (`npm run seed`) against the updated schema and confirm no validation errors.

## Server Actions

* Add a server actions module (e.g. `src/app/actions/games.js`, `'use server'`) with:
  * `getGames()` — returns all active games from MongoDB, shaped like the current `games.js` export.
  * `checkAvailability(startDate, endDate)` — returns per-game availability by querying `Booking` for overlapping `confirmed` / `out-for-delivery` / `rented` / `return-pending` bookings (per the overlap rule in `project-overview.md` → Business Rules), replacing the hardcoded `bookedRanges` object.
* No API routes for this feature — reads go through Server Actions per `context/coding-standards.md`.

## Integration

* `src/app/page.js` (homepage): become an async server component, call `getGames()` directly, replace the static `games` import for the featured-games section.
* `src/app/games/page.js`: become an async server component, call `getGames()`, pass the result into `GamesPageClient` as a prop.
* `src/app/games/GamesPageClient.jsx`: drop the `import { games, bookedRanges } from "@/data/games"`; accept `games` as a prop; replace the client-side `bookedRanges` lookup with a call to the `checkAvailability` server action when the user clicks **Check Availability**, storing the result in state and using it for the existing "Available" / "Unavailable for selected dates" rendering.
* `GameCard` / `GameDetailsModal` need no shape changes — the extended `Game` schema preserves the same fields they already consume.
* Delete `src/data/games.js` once nothing imports it.

## Out of Scope

* Booking submission stays a client-side fake (`setTimeout`, random booking number) — creating a real `Booking` document is a separate future spec.
* No admin dashboard, auth, or payment integration.

## Documentation

* Update `README.md`'s Status and Project Structure sections to drop the `games.js`-is-the-live-source note.
* Update `CLAUDE.md`'s architecture section (the `src/data/games.js` bullet, and the "no API routes reading/writing the database yet" bullet).

## Acceptance Criteria

* Homepage featured games and `/games` game grid render from MongoDB, not `src/data/games.js`.
* `src/data/games.js` no longer exists and nothing imports it.
* The `Game` model and seed data include all fields the UI needs (no missing `shortDescription`, `howToPlay`, `icon`, `age`, etc.).
* Clicking **Check Availability** on `/games` reflects real `Booking` data from MongoDB, not a hardcoded object.
* All game reads go through Server Actions — no new API routes are introduced.
* The project builds successfully and `/` and `/games` work with a locally seeded database.
* `README.md` and `CLAUDE.md` reflect the new data flow.
