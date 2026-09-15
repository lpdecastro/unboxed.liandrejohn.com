# Reliable Booking Notification Spec

## Task

Make the admin booking-notification email reliable by sending it server-side (via Resend) from inside `createBooking`, instead of a fire-and-forget client-side Web3Forms call.

## Background / Problem

- Today, `src/lib/notifications.js`'s `sendBookingNotificationEmail` posts to Web3Forms **from the browser**, called (not awaited) from `GamesPageClient.jsx`'s `handleBookingSubmit` right after the booking-confirmation UI is already shown. Failures are only `console.error`'d — invisible to both the customer and the admin.
- It was built this way because Web3Forms' free plan hard-rejects server-to-server calls (403 "Use our API in client side ... Pro plan is required") — see the `email-notification-spec.md` history entry in `current-feature.md`.
- Confirmed failure: a real booking on a friend's device saved correctly to MongoDB, but the admin email never arrived — consistent with this design's core weakness, since delivery depends entirely on that customer's browser/network/ad-blocker completing a third-party POST after their job is already "done".
- The booking record itself is not at risk (it's written server-side, first); only the notification is fragile.

## Requirements

- Add the `resend` package as a dependency.
- Add a server-only `RESEND_API_KEY` env var (no `NEXT_PUBLIC_` prefix) to `.env.example`, with a short comment explaining it's used server-side only.
- Rewrite `src/lib/notifications.js`'s `sendBookingNotificationEmail` to send via Resend's Node SDK instead of `fetch`-ing Web3Forms. This makes the module server-only (no browser API usage).
- Call it from `createBooking` (`src/app/actions/bookings.js`), awaited, immediately after `Booking.create(...)` succeeds — wrapped in try/catch so an email failure (bad key, Resend outage) never fails the booking response; log the error server-side instead.
- Sender: Resend's shared `onboarding@resend.dev` address (no custom domain verification needed, since the only recipient is the account owner's own address in test mode). Recipient: `liandrejohn88@gmail.com`.
- Email content: same fields currently sent to Web3Forms — booking number, customer name/mobile/delivery address, games, rental dates, grand total, GCash reference number.
- Remove the client-side call and the `sendBookingNotificationEmail` import from `GamesPageClient.jsx`; `handleBookingSubmit` no longer needs to pass notification data after `setSubmitted(...)`.
- Remove `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` from `.env.example`.

## Documentation

- Update `README.md`'s "Email Notification" section (and the one-line tech-stack description near the top) to describe Resend + server-side sending instead of Web3Forms + client-side.

## Out of Scope

- Retry queues, background jobs, or any guaranteed-delivery mechanism beyond a single server-side send attempt per booking.
- An admin dashboard or in-app booking list as a notification fallback.
- SMS notifications.
- Verifying a custom sending domain in Resend (not needed since the only recipient is the account owner).

## Acceptance Criteria

- [ ] `resend` added as a dependency.
- [ ] `RESEND_API_KEY` documented in `.env.example`; `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` removed.
- [ ] `sendBookingNotificationEmail` sends via Resend, runs entirely server-side, no browser/`NEXT_PUBLIC_` dependency.
- [ ] Called from `createBooking`, awaited, wrapped so a send failure never breaks the booking's success response.
- [ ] Client-side call and import removed from `GamesPageClient.jsx`.
- [ ] `README.md` updated to describe the new Resend-based flow.
- [ ] Production build passes.
- [ ] Verified as far as possible without a live key: booking still succeeds and persists correctly when the email send throws/fails.
