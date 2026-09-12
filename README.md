# Unboxed

A personal board game rental site for Metro Manila. Browse games, check availability for a date range, book, and pay via GCash — delivery and returns are handled through Lalamove.

## Status

Early build. Currently a static HTML site styled with Bootstrap, compiled from Sass so the design can be customized beyond Bootstrap's defaults. No backend, database, or payment integration yet.

Planned pages:

- **Home** — introduces Unboxed, highlights featured games, explains how renting works
- **Games** — full game catalog, availability checker, booking summary, and checkout in one page

## Tech Stack

Current:

- HTML
- [Bootstrap](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Sass](https://sass-lang.com/) (Dart Sass)

Planned (later phases):

- Next.js
- MongoDB & Mongoose
- Web3Forms
- AWS Amplify

## Getting Started

Install dependencies:

```sh
npm install
```

Build CSS/JS assets once:

```sh
npm run build
```

Rebuild Sass on save while developing:

```sh
npm run sass:watch
```

Then open `index.html` in a browser (or serve the folder with any static file server).

## Project Structure

```
├── src/scss/       # Sass source (main.scss imports Bootstrap + overrides in _variables.scss)
├── css/            # Compiled CSS (generated, gitignored)
├── js/             # Bootstrap's JS bundle (copied, gitignored)
├── img/            # Site images
└── index.html      # Static pages
```

`css/` and `js/` are build output, not committed — run `npm run build` to regenerate them. A CI/CD pipeline will run this build step before deployment once it's set up.

## npm Scripts

| Script                | Description                                              |
| ---------------------- | --------------------------------------------------------- |
| `npm run build`        | Copies Bootstrap Icons fonts + JS bundle, compiles Sass    |
| `npm run sass:watch`   | Recompiles CSS on file changes                             |
| `npm run sass:build`   | Compiles Sass to `css/main.css` once                       |
| `npm run assets`       | Re-syncs icon fonts and the JS bundle from `node_modules`  |
