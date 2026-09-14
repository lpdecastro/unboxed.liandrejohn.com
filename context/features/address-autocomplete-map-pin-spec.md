# Address Autocomplete & Map Pin Spec

## Task

Replace the free-text delivery address field on the games page with a Google Places autocomplete input that shows suggestions as the customer types and drops a pin on an embedded map when they select one.

## Background

`Complete Delivery Address` is currently a plain `<textarea>` (`src/app/games/GamesPageClient.jsx`, `customerAddress` state, ~line 930-947) with no structure or validation beyond "non-empty" (`src/app/actions/bookings.js` line 80-83). Deliveries are Metro Manila only (`project-overview.md` → Business Rules, MVP Constraints), and the site currently has no map/geocoding integration or Google Maps API key.

## Provider

Google Maps Platform: **Places Autocomplete** (new `PlaceAutocompleteElement`, or the classic `Autocomplete` widget if the new element isn't available in the pinned `@googlemaps/js-api-loader` version) for suggestions, **Maps JavaScript API** for the pin map. Both load from a single browser API key.

## Requirements

### Setup

- Add `@googlemaps/js-api-loader` as a dependency to load the Maps JS SDK (Places + Maps libraries) client-side, matching the existing pattern of loading browser-only SDKs inside `useEffect` (see `BootstrapClient`).
- Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to `.env.example` (blank) and read it via `process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Must be `NEXT_PUBLIC_*` since it's used in the browser; document in the spec/README that the key should be restricted (HTTP referrer + Places API/Maps JavaScript API only) in Google Cloud Console.
- If the env var is missing, fall back to the current plain `<textarea>` behavior instead of throwing, so local dev without a key still works.

### Address Input Component

- New client component, e.g. `src/components/games/AddressAutocomplete.jsx` (`"use client"`), replacing the textarea's markup in `GamesPageClient.jsx`'s customer-details step. Props: `value`, `onChange(addressText)`, `id`, `required`.
- Renders a Bootstrap-styled text `<input>` (`form-control`, same label/required/invalid-feedback structure as today) wired to the Places Autocomplete widget for suggestions-as-you-type.
- Bias/restrict suggestions to the Philippines (`componentRestrictions: { country: "ph" }`) and bias results toward Metro Manila via a lat/lng bounds hint, without hard-filtering results server-side.
- On selecting a suggestion, set the input's value to the place's formatted address and call `onChange` with that text — this is what continues to populate `customerAddress` state exactly as the textarea does today, so `handleBookingSubmit` → `createBooking` needs no changes.
- Manual typing without selecting a suggestion still updates `customerAddress` on blur/change (same as now) so the field doesn't force a Places selection to be usable — Places is an enhancement, not a hard gate.

### Map Pin

- Below the address input, render a small embedded map (Bootstrap-sized container, e.g. `rounded border` div ~200-250px tall) that stays hidden until a place is selected.
- On selecting a suggestion, center the map on the place's coordinates and drop a single marker there. Re-selecting a new suggestion moves the existing marker rather than adding another.
- Marker is **not** draggable and the map is not manually pinnable by clicking — selection only comes from the autocomplete suggestion, per the requested flow (type → suggestions → select → pin appears). Keep this simple; manual pin adjustment is out of scope.

### Metro Manila Soft Validation

- After a place is selected, check its address components for a Metro Manila city/municipality (e.g. against a small allow-list of the 16 NCR cities + Pateros). If it doesn't match, show a non-blocking inline note near the field (in the existing `text-body-secondary`/warning style) reminding the customer rentals are Metro Manila-only — do not block form submission on this check, since it's a heuristic, not authoritative (matches `project-overview.md`: "flag addresses outside the supported area **where practical**").

### Booking Data

- No changes to the `Booking` data model or `createBooking` — the field submitted and stored remains the plain formatted address string (`customer.address`), same as today. Coordinates are not persisted.

## Out of Scope

- Persisting latitude/longitude on the `Booking` document or `Game`/anywhere else.
- Manual pin placement/dragging, or reverse geocoding from a dragged pin.
- Server-side Metro Manila validation/rejection — this stays a client-side heuristic hint.
- An admin-facing map view (Phase 2 territory).
- Any changes to the GCash, rental agreement, or submit-booking steps.

## Acceptance Criteria

- [ ] `@googlemaps/js-api-loader` added; `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` documented in `.env.example`.
- [ ] Typing in the delivery address field shows live Places suggestions restricted/biased to the Philippines and Metro Manila.
- [ ] Selecting a suggestion fills the input with the formatted address and drops/moves a single marker on a map centered at that location.
- [ ] The map is hidden until a place has been selected at least once.
- [ ] Manual free-text typing (no suggestion picked) still updates `customerAddress` and remains submittable, unchanged from current behavior.
- [ ] Selecting an address outside the Metro Manila city allow-list shows a non-blocking inline reminder; submission is not blocked by it.
- [ ] Missing/invalid API key degrades gracefully to the current plain textarea, no runtime crash.
- [ ] `createBooking` and the `Booking` schema are unchanged; the stored `customer.address` is still a plain string.
- [ ] Production build passes; manual check in a real browser (Places suggestions require a live key/network, can't be fully verified via automated script).
