# Submit Booking Spec

## Task

Replace the client-side fake booking submission on `/games` with a Server Action that revalidates everything server-side and persists a real `Booking` document in MongoDB.

## Current State

`GamesPageClient.jsx`'s `handleBookingSubmit` only runs client-side `checkValidity()`/regex checks, then fakes success with a `setTimeout` and a `Math.random()`-generated `BG-####` number — nothing is written to the database and pricing/dates are trusted from client state (`src/app/games/GamesPageClient.jsx:259-304`).

## Server Action

- Add `src/app/actions/bookings.js` (`'use server'`) exporting `createBooking(input)`, where `input` is `{ slugs, startDate, endDate, customer: { name, mobile, address }, gcashReferenceNumber }`.
- Look up the selected games from MongoDB by slug (`active: true`); reject if any slug doesn't resolve to an active game.
- Recheck availability using the same overlap logic as `checkAvailability` (`src/app/actions/games.js`) against the `confirmed`/`out-for-delivery`/`rented`/`return-pending` statuses; reject the booking if any selected game is no longer available for the given dates.
- Compute pricing entirely server-side from each game's DB record — never trust client-submitted totals:
  - `rentalDays` = inclusive day count between `startDate` and `endDate`.
  - `rentalSubtotal` = sum of `pricePerDay * rentalDays` per game.
  - `discountAmount` = 10% of `rentalSubtotal` when 2+ games are selected, else 0.
  - `depositTotal` = sum of each game's `deposit`.
  - `grandTotal` = `rentalSubtotal - discountAmount + depositTotal`.
- Generate `bookingNumber` server-side in the `BG-####` format, checking uniqueness against existing `Booking` documents before saving (retry on collision).
- Create the `Booking` document with `status: "pending"` using the `Booking` model (`src/models/Booking.js`) — no schema changes needed, all required fields are already present.
- Return a plain object shaped for the confirmation UI: `{ bookingNumber, gamesText, datesText, rentalDays, amountText, addressText }`, or a validation error result the client can render.

## Validation

Reuse the same rules already enforced client-side, but authoritative on the server:

- At least one game selected.
- `startDate` not in the past; `endDate` on or after `startDate`.
- Full name, PH mobile number (`^(09|\+639)\d{9}$` after stripping spaces/dashes), and complete address are present.
- GCash reference number is present.
- All selected games are still available for the requested dates (recheck, not reused from the client's earlier `checkAvailability` call).

## GamesPageClient Integration

- Replace the `setTimeout` fake in `handleBookingSubmit` (`src/app/games/GamesPageClient.jsx:259-304`) with an `await createBooking(...)` call, keeping the existing client-side checks as first-line UX feedback (fast, no round trip) but treating the server's response as the source of truth.
- On a validation error from the server (e.g. a game became unavailable between check and submit, per the existing `setTimeout` comment's intent), surface it through the existing `formError` state/UI rather than adding new error UI.
- On success, populate the existing `submitted` state from the server action's returned fields instead of client-computed `grandTotal`/`selectedGames`/random booking number.
- Keep `isSubmitting` gating the button during the request (already prevents duplicate submits while pending).

## Out of Scope

- Email notification to `liandrejohn88@gmail.com` — requires Web3Forms, which isn't set up yet (separate roadmap item).
- GCash payment verification, SMS confirmation, and booking status changes past `pending` — manual per MVP constraints.
- Admin dashboard or any booking-management UI.
- Idempotency keys / duplicate-submission protection beyond the existing `isSubmitting` button guard.

## Acceptance Criteria

- [ ] `src/app/actions/bookings.js` exports `createBooking` as a Server Action.
- [ ] Server rechecks game availability for the requested dates before creating the booking and rejects it if any selected game is no longer available.
- [ ] Server validates games, dates, customer fields, and GCash reference independently of client-side checks.
- [ ] Rental subtotal, 10% multi-game discount, deposit total, and grand total are computed server-side from each game's DB record.
- [ ] Booking number is generated server-side in `BG-####` format and guaranteed unique before saving.
- [ ] A `Booking` document is created in MongoDB with `status: "pending"` and all data-model fields populated.
- [ ] `handleBookingSubmit` in `GamesPageClient.jsx` calls `createBooking` instead of the `setTimeout` fake; no client-side random booking number generation remains.
- [ ] Server-side validation errors surface through the existing `formError` UI.
- [ ] The booking confirmation state renders from the server action's response.
- [ ] Production build passes; a booking submitted through the running dev server actually appears in MongoDB.
