# Email Notification Spec

## Task

Send an email to `liandrejohn88@gmail.com` via Web3Forms whenever a booking is created, so the admin knows to verify GCash payment without polling the database.

## Dependency

Requires `createBooking` in `src/app/actions/bookings.js` (per `context/features/submit-booking-spec.md`) to already exist and persist the `Booking` document — this feature hooks into it rather than replacing anything. If `submit-booking` hasn't been implemented yet, implement that first.

## Web3Forms Setup

- Add `WEB3FORMS_ACCESS_KEY` to `.env` (gitignored) and document it in `.env.example` — the key is tied to a Web3Forms account registered with `liandrejohn88@gmail.com`, which determines the delivery inbox (free plan doesn't support a per-request `to` override).
- No new dependency needed — Web3Forms is a plain HTTPS POST endpoint (`https://api.web3forms.com/submit`), called with the built-in `fetch`.

## Server Action

- Add `sendBookingNotificationEmail(booking)` to `src/app/actions/bookings.js` (or a new `src/app/actions/notifications.js` if that keeps `bookings.js` focused — pick whichever reads cleaner once `createBooking` exists).
- POST JSON to `https://api.web3forms.com/submit` with:
  - `access_key`: `process.env.WEB3FORMS_ACCESS_KEY`
  - `subject`: e.g. `New Booking BG-1024 - Pending Verification`
  - `from_name`: `Unboxed`
  - Body fields covering what the admin needs to verify and act on the booking: booking number, customer name, mobile, delivery address, game names, rental dates, rental days, grand total, GCash reference number.
- Call this from inside `createBooking`, after the `Booking` document is successfully saved.
- Treat email delivery as best-effort: wrap the call in `try/catch`, log failures server-side (`console.error`), and never let an email failure fail the booking or change the response returned to the client — the booking is already persisted and the customer's confirmation shouldn't depend on Web3Forms being up.

## Out of Scope

- SMS confirmation to the customer (manual per MVP constraints).
- Any email to the customer — only the admin notification exists per the spec.
- Retry queues or delivery-status tracking for failed emails.
- Emails for status transitions other than creation (`confirmed`, `out-for-delivery`, etc.) — those stay manual/off-website per MVP constraints.

## Acceptance Criteria

- [ ] `WEB3FORMS_ACCESS_KEY` is read from env and documented in `.env.example`.
- [ ] A new booking triggers a POST to Web3Forms containing booking number, customer name, mobile, address, games, dates, rental days, grand total, and GCash reference number.
- [ ] The email send happens only after the `Booking` document is successfully saved.
- [ ] A Web3Forms failure (bad key, network error, non-2xx response) is caught and logged, and does not affect the booking's success response to the client.
- [ ] Production build passes; a booking submitted through the running dev server results in an email arriving at `liandrejohn88@gmail.com`.
