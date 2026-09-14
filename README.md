# Unboxed Board Game Rental

A personal board game rental site for Metro Manila. Browse games, check availability for a date range, book, and pay via GCash — delivery and returns are handled through Lalamove.

## Status

Early build. A [Next.js](https://nextjs.org/) (App Router) site styled with Bootstrap, compiled from Sass so the design can be customized beyond Bootstrap's defaults. The game catalog and availability checks are read from MongoDB via Server Actions; booking submission, auth, and payment integration aren't wired up yet.

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

Planned (later phases):

- Web3Forms
- AWS Amplify

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
