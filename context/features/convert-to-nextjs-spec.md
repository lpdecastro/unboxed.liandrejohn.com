# Convert to Next.js Spec

## Task

Convert the existing project to Next.js while preserving the current design, content, and behavior.

## Migration Requirements

* Keep Bootstrap as the UI framework.
* Keep Sass and the existing Bootstrap variable overrides.
* Preserve the current visual design and layout as closely as possible.
* Preserve existing content, images, links, and interactions.
* Convert existing pages into appropriate Next.js routes.
* Convert reusable page sections into shared React components where appropriate.
* Move static assets to the appropriate Next.js public asset structure.
* Replace static HTML-specific patterns with their appropriate Next.js equivalents.

## Implementation Rules

* Use the existing project structure and styling as the source of truth.
* Do not redesign the website during the migration.
* Do not introduce a new UI framework or CSS library.
* Avoid unnecessary dependencies.
* Prefer reusable components for shared elements such as the navbar, footer, cards, buttons, and common sections.
* Keep Bootstrap utility and component classes where they already work well.
* Preserve existing Sass organization and Bootstrap customization where practical.
* Use Next.js conventions for routing, layouts, metadata, images, and assets where appropriate.
* Keep the implementation simple and suitable for future feature development.

<!-- Stuff missed from the spec after starting the feature -->
## Notes

* Update the README.md and CLAUDE.md where applicable.
* Use .jsx

## Acceptance Criteria

* The project runs successfully as a Next.js application.
* All existing pages are accessible through the expected routes.
* The visual appearance remains consistent with the original project.
* Bootstrap continues to work correctly.
* Existing Sass and Bootstrap variable overrides are preserved and loaded correctly.
* Shared UI elements are extracted into reusable components where appropriate.
* Images and other static assets load correctly.
* Existing links, buttons, forms, and interactions continue to work.
* The project works correctly on desktop and mobile.
* There are no broken imports, missing assets, console errors, or build errors.
* The project successfully completes the Next.js production build.
