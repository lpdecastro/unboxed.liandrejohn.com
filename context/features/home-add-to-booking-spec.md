# Home Add to Booking Spec

## Task

Clicking **Add to Booking** on a featured game on the homepage should land on `/games` with that game selected, rental dates defaulted to today, and availability already checked — instead of the current plain link to `/games`.

## Behavior

1. On the homepage, each featured game's **Add to Booking** button links to `/games?add={slug}` instead of a plain `/games` link.
2. On `/games`, if a valid `add` slug is present on load:
   - Set both `startDate` and `endDate` to today's local date (`YYYY-MM-DD`), same as the existing `validateDates` "start date cannot be in the past" baseline.
   - Run the same availability check the **Check Availability** button runs (`checkAvailability(startDate, endDate)`), so `availabilityChecked` becomes true and the game grid shows real status instead of "Select dates to check".
   - If the game is available for today, add its slug to `selectedSlugs` (same as clicking **Add to Booking** on its `GameCard`), so it appears in the sticky booking summary already.
   - If the game is unavailable for today (blocked by an overlapping `confirmed`/`out-for-delivery`/`rented`/`return-pending` booking), add the `Unavailable` tag and disable the Next button.
   - Smooth-scroll to the sticky booking summary (or the game grid on mobile, where the summary isn't visible) so the result of the auto-add is visible without the user hunting for it.
3. This only runs once per page load. Changing dates or games afterward behaves exactly as it does today — no special-casing beyond the initial pre-fill.
4. An `add` value that doesn't match any known game slug is ignored (page behaves as if the param weren't there).

## Implementation Notes

- Homepage (`src/app/page.jsx`) is a server component — no state needed, just change the `Link href` on the featured game card from `/games` to `` `/games?add=${game.slug}` ``.
- `src/app/games/page.jsx` is an async server component; read the `add` param from its `searchParams` prop and pass it to `GamesPageClient` as a prop (e.g. `initialAddSlug`), validating it against the fetched `games` list server-side before passing it down (or just pass the raw value and let the client validate against `games`).
- `GamesPageClient.jsx` already owns `startDate`/`endDate`/`selectedSlugs`/`availabilityChecked` state and a `recheckWithDates(start, end)` helper — reuse it in a mount-only `useEffect` rather than duplicating the availability-check logic.
- Today's date must match the format `validateDates` already expects (`new Date().toISOString().slice(0, 10)`), for consistency with the existing past-date check.

## Out of Scope

- Deep-linking with custom (non-today) dates via the URL.
- Auto-adding more than one game via the URL.
- Any change to `GameCard`'s own **Add to Booking** behavior on the games page itself.

## Acceptance Criteria

- [ ] Each featured game card on the homepage links to `/games?add={slug}` with the correct slug.
- [ ] Visiting `/games?add={validSlug}` sets both dates to today, runs availability check automatically, and shows the game grid with real availability statuses (not "Select dates to check").
- [ ] If the linked game is available today, it appears pre-selected in the sticky booking summary on load.
- [ ] If the linked game is unavailable today, it is still added to the booking, tagged `Unavailable`, and the Next button is disabled (via the existing `hasUnavailableSelected` check) until the user picks different dates or removes it.
- [ ] Visiting `/games` with no `add` param, or an unrecognized slug, behaves exactly as today (no dates pre-filled, nothing pre-selected).
- [ ] Manually changing dates or toggling games after the auto-add still works normally, with no leftover special behavior tied to the initial `add` param.
- [ ] Production build passes.
