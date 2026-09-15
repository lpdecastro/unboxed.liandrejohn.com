# Unboxed Board Game Rental

A personal board game rental site for Metro Manila. Browse games, check availability for a date range, book, and pay via GCash — delivery and returns are handled through Lalamove.

## Status

A [Next.js](https://nextjs.org/) (App Router) site styled with Bootstrap, compiled from Sass so the design can be customized beyond Bootstrap's defaults. The game catalog, availability checks, and booking submission are all backed by MongoDB via Server Actions — a booking is validated and priced server-side, persisted with `pending` status, and notified by email server-side via Resend. Payment is GCash (QR code + reference number, manually verified) and delivery/returns are coordinated manually through Lalamove; there's no online payment gateway, customer accounts/auth, or admin dashboard yet — booking status changes are made directly in the database.

Pages:

- **Home** (`/`) — introduces Unboxed, highlights featured games, explains how renting works
- **Games** (`/games`) — full game catalog, availability checker, booking summary, and checkout in one page

## Tech Stack

Current:

- [Next.js](https://nextjs.org/) (App Router, JavaScript)
- [React](https://react.dev/)
- [Bootstrap](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Sass](https://sass-lang.com/) (Dart Sass)
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- [Resend](https://resend.com/) — booking notification email (server-side)
- [Google Maps Platform](https://developers.google.com/maps) (Places Autocomplete + Maps JavaScript API) — delivery address field, optional
- [Google Analytics](https://analytics.google.com/) (GA4, via `@next/third-parties`) — optional
- [react-toastify](https://fkhadra.github.io/react-toastify/) — add-to-booking confirmation toasts

Planned (later phases):

- AWS Amplify (deployment)

## Getting Started

Install dependencies:

```sh
npm install
```

Start the dev server:

```sh
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Build and run a production build:

```sh
npm run build
npm start
```

## MongoDB Setup

The app expects a local MongoDB instance. Install it (e.g. `brew install mongodb-community`) and start it, or run it via Docker:

```sh
docker run -d -p 27017:27017 --name unboxed-mongo mongo
```

By default the app connects to `mongodb://localhost:27017/unboxed`. To point at a different URI, copy `.env.example` to `.env` and set `MONGODB_URI`:

```sh
cp .env.example .env
```

Seed the database with the 8 games and 2 sample bookings from `src/data/games.json` / `src/data/bookings.json`:

```sh
npm run seed
```

This drops and repopulates the `games` and `bookings` collections. `connectDB` (`src/lib/mongodb.js`) caches the connection across hot reloads, and `Game`/`Booking` models live in `src/models/`.

## Google Maps Setup (optional)

The delivery address field on `/games` uses Google Places Autocomplete and an embedded map pin. Both are optional — without an API key, the field falls back to a plain text address input with no runtime error.

To enable it, create a browser API key in [Google Cloud Console](https://console.cloud.google.com/) restricted to the **Places API** and **Maps JavaScript API** (and to your site's HTTP referrers), then set it in `.env`:

```sh
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here
```

## SEO Setup

Metadata (Open Graph/Twitter cards, canonical URLs), the JSON-LD structured data, and `sitemap.xml`/`robots.txt` all resolve absolute URLs from `NEXT_PUBLIC_SITE_URL`. Set it in `.env` once a production domain exists (e.g. AWS Amplify):

```sh
NEXT_PUBLIC_SITE_URL=https://unboxed.example.com
```

Without it, everything falls back to `http://localhost:3000` for local dev.

## Google Analytics Setup (optional)

Page view tracking (GA4) is wired up via `@next/third-parties`'s `GoogleAnalytics` component, rendered once from the root layout so it covers both `/` and `/games`. It's optional — without a measurement ID, no GA script is loaded and nothing breaks.

To enable it, create a GA4 property and set its measurement ID in `.env`:

```sh
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Booking Email Notification Setup (optional)

When a booking is submitted, the `createBooking` Server Action sends the booking details (number, customer info, games, dates, total, GCash reference) server-side via [Resend](https://resend.com/) to the admin inbox, awaited right after the booking is saved and wrapped in try/catch so a send failure never affects the booking response. It's optional — without an API key, the booking still saves to MongoDB normally, just with no email sent.

To enable it, create a Resend account and API key, then set it in `.env`:

```sh
RESEND_API_KEY=your-api-key-here
```

The key is server-only (no `NEXT_PUBLIC_` prefix) and never reaches the client bundle. Emails send from Resend's shared `onboarding@resend.dev` address — no custom domain verification is needed since the only recipient is the account owner's own address.

## Project Structure

```
├── .claude/skills/feature/  # Feature workflow skill (load/start/complete a feature)
├── context/                 # Project context read by Claude Code (see CLAUDE.md)
│   ├── project-overview.md  # Product plan: pricing, policies, booking flow, data model
│   ├── ai-interaction.md    # AI workflow/communication guidelines
│   ├── coding-standards.md  # Bootstrap/Sass coding conventions
│   ├── current-feature.md   # Active feature spec + completed feature history
│   ├── contents/            # Page copy (Home, Game Listing)
│   └── features/            # Per-feature specs
├── scripts/
│   └── seed.mjs              # Seeds MongoDB from src/data/games.json + bookings.json
├── src/
│   ├── app/                 # Next.js App Router pages (home `/`, games `/games`) + actions/ (Server Actions)
│   ├── components/          # Shared UI (Navbar, Footer, modals, game card)
│   ├── data/                  # MongoDB seed JSON (games.json, bookings.json)
│   ├── lib/                  # connectDB (MongoDB) + small formatting helpers
│   ├── models/                # Mongoose models (Game, Booking)
│   └── scss/                 # Sass source (main.scss imports Bootstrap + overrides in _variables.scss)
├── public/
│   ├── img/                  # Site images (committed)
│   └── fonts/                # Bootstrap Icons fonts (generated, gitignored)
└── next.config.mjs
```

`public/fonts/` and `.next/` are build output, not committed — `npm run dev`/`npm run build` regenerate `public/fonts/` automatically, and Next.js regenerates `.next/`.

## npm Scripts

| Script                 | Description                                                |
| ---------------------- | ----------------------------------------------------------- |
| `npm run dev`          | Starts the Next.js dev server (syncs icon fonts first)       |
| `npm run build`        | Production build (syncs icon fonts first)                    |
| `npm start`            | Serves the production build                                  |
| `npm run assets:icons` | Re-syncs Bootstrap Icons fonts into `public/fonts/`           |
| `npm run seed`         | Seeds local MongoDB from `src/data/games.json` + `bookings.json` |
