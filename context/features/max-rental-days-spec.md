# Max Rental Days Spec

## Task

Cap the games page rental date range at 7 days (inclusive) so customers can't book beyond a week, validated both client- and server-side.

## Requirements

- `validateDates(start, end)` in `src/app/games/GamesPageClient.jsx` gains a `rangeInvalid` check: `end` more than 6 days after `start` (i.e. rental days > 7, inclusive counting per the existing `rentalDays` formula) is invalid.
- Wire `rangeInvalid` everywhere `startInvalid`/`endInvalid` currently gate behavior:
  - `datesAreValid` (line ~140-144) also requires `!rangeInvalid`.
  - `recheckWithDates`, `handleDateFormSubmit`, and `handleSummaryNext` treat a range error the same as the existing invalid-date case: skip the availability check and surface `summaryDateError`.
  - The end date `<input>` gets `is-invalid` when `rangeInvalid` is true (alongside the existing `endInvalid` condition), with its own `invalid-feedback` message, e.g. "Rentals are limited to 7 days — choose an end date within a week of the start date."
- Mirror the same cap in `createBooking` (`src/app/actions/bookings.js`): after the existing start/end checks, reject when `rentalDaysBetween(startDate, endDate) > 7` with `{ success: false, error: "Rentals are limited to a maximum of 7 days." }`, so a request that bypasses the client (or a stale client) still can't create a booking beyond the cap.
- No change to the pricing/discount math or the `Booking` schema — this is a range validation only.

## Out of Scope

- Changing the 7-day figure to a configurable/admin-editable setting.
- Any change to the minimum rental length (already enforced via `end >= start`).
- The `?add={slug}` auto-fill flow (`home-add-to-booking-spec.md`) — it always sets both dates to today, which is a 1-day range and unaffected by this cap.

## Acceptance Criteria

- [ ] Selecting a start/end date pair spanning more than 7 days shows an inline validation error on the end date field and blocks **Check Availability**.
- [ ] Changing either date back to a ≤7-day range clears the error and allows the check to proceed as before.
- [ ] `handleSummaryNext` refuses to advance past the date/game step while the range exceeds 7 days.
- [ ] `createBooking` rejects a submission with a >7-day range with a clear error message, even if the client-side check is bypassed.
- [ ] Existing date validations (past start date, end before start date) continue to work unchanged.
- [ ] Production build passes.
