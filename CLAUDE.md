# Unboxed Board Game Rentals

Unboxed — a personal board game rental site for Metro Manila (own 8 games, rent them out; GCash payment, Lalamove delivery/returns). Currently a static Bootstrap + Sass site, no backend yet. See `README.md` for tech stack and current status.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

```sh
npm install          # install dependencies
npm run build         # copy Bootstrap Icons fonts + JS bundle, compile Sass (one-off)
npm run sass:watch    # recompile css/main.css on save while developing
npm run sass:build    # compile Sass once, without touching copied assets
npm run assets        # re-sync icon fonts + JS bundle from node_modules (after a Bootstrap/icon version bump)
```

There is no test suite, linter, or dev server script configured. Preview by opening `index.html` directly or serving the repo root with any static file server.

## Architecture

- **Sass entry point is `src/scss/main.scss`.** It imports `_variables.scss` (Bootstrap variable overrides) *before* `@import "bootstrap/scss/bootstrap"`, so Bootstrap picks up the overrides — new variable overrides must go in `_variables.scss`, not after the Bootstrap import. Bootstrap Icons is imported last, with `$bootstrap-icons-font-dir` set to `"fonts"` so compiled CSS finds the font files at `css/fonts/`.
- **`css/` and `js/` are build output, not source** — both are gitignored (see `.gitignore`). `css/main.css` and `css/fonts/` come from the Sass build; `js/bootstrap.bundle.min.js` is copied verbatim from `node_modules/bootstrap/dist/js/`. Never hand-edit files in these directories — edit `src/scss/` instead and rerun `npm run build`. A future CI/CD pipeline is expected to run this build before deploy.
- **Roadmap**: the plan calls for converting this static site to Next.js later, adding MongoDB/Mongoose for bookings, Web3Forms, and deploying via AWS Amplify. None of that exists yet — don't assume a framework or backend beyond plain HTML/Bootstrap/Sass unless it's actually present in the repo.
