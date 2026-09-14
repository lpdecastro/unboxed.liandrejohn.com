# Unboxed Board Game Rental

A personal board game rental site for Metro Manila. Browse games, check availability for a date range, book, and pay via GCash — delivery and returns are handled through Lalamove.

## Status

Early build. A [Next.js](https://nextjs.org/) (App Router) site styled with Bootstrap, compiled from Sass so the design can be customized beyond Bootstrap's defaults. No backend, database, or payment integration yet.

Pages:

- **Home** (`/`) — introduces Unboxed, highlights featured games, explains how renting works
- **Games** (`/games`) — full game catalog, availability checker, booking summary, and checkout in one page

## Tech Stack

Current:

- [Next.js](https://nextjs.org/) (App Router, JavaScript)
- [React](https://react.dev/)
- [Bootstrap](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Sass](https://sass-lang.com/) (Dart Sass)

Planned (later phases):

- MongoDB & Mongoose
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
├── src/
│   ├── app/                 # Next.js App Router pages (home `/`, games `/games`)
│   ├── components/          # Shared UI (Navbar, Footer, modals, game card)
│   ├── data/                 # Game catalog data shared across pages
│   ├── lib/                  # Small formatting helpers
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
