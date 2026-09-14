# Draft Action

1. Check $ARGUMENTS (after "draft") - the feature description.

    - If empty: Error - "draft" requires a short feature description, e.g. `/feature draft spec to submit booking`

2. Format: a title (`# {Name} Spec`), a `## Task` section stating the one-sentence goal, a small number of domain-specific sections relevant to *this* feature only (e.g. `## Requirements`, `## Server Actions`, `## Integration`, `## Out of Scope`, `## Documentation`, etc.) - don't include sections that don't apply. Close with a flat `## Acceptance Criteria` checklist - imperative, no-fluff tone.

3. Read `context/project-overview.md` for the business rules, data model, and booking flow relevant to the requested feature. Read other context files (`context/coding-standards.md`, related specs, relevant source files) as needed so the spec stays accurate to the real codebase rather than inventing behavior.

4. Keep the spec only as long as necessary. Don't invent scope beyond the description - if there's a natural adjacent feature to exclude, name it under `## Out of Scope`.

5. Derive a filename: kebab-case the feature description, ending in `-spec.md` (e.g. "spec to submit booking" -> `submit-booking-spec.md`). If a file with that name already exists under `context/features/`, ask the user how to proceed instead of overwriting it.

6. Write the new spec to `context/features/{name}-spec.md`.

7. Show the user the generated spec and its file path. Don't modify `current-feature.md` - loading the drafted spec into the active feature is a separate step (`/feature load {name}`).

Notes:

- Dont' forget error handling