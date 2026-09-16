# Document Action

Produces a plain-language explainer of a feature for a non-technical reader (e.g. a marketing person or the business owner) — not a spec, not a changelog.

1. Check $ARGUMENTS (after "document") — the feature spec filename.

    - If empty: Error - "document requires a feature spec filename, e.g. `/feature document hubspot-booking-sync-spec`"
    - Normalize the argument: strip a trailing `.md` if present. Try, in order: `context/features/{arg}.md`, then `context/features/{arg}-spec.md` (in case the user dropped the `-spec` suffix).
    - If neither exists: Error and list the closest filename matches under `context/features/` so the user can correct it.

2. Read the resolved spec file in full — this is the primary source of what the feature does and why.

3. Check `context/current-feature.md`'s H1 heading, `## Goals`, and `## Notes` sections — but only if its H1 names this same feature (i.e. it's the currently active/loaded feature). If so, pull any developer context there that isn't already in the spec (deviations, caveats, manual setup steps, things called out as not-yet-done). Do **not** read the `## History` section — it's an append-only log going back to the start of the project and reading it wastes a large amount of context for little gain. If the H1 doesn't match this feature, skip this step entirely and rely on the spec alone.

4. Also check this session's persistent memory (if the memory system is available) for `feedback` or `project` type entries relevant to this feature's subject matter that add context not already covered by the spec. Don't force it — skip silently if nothing relevant turns up.

5. Write the explainer for someone with zero technical background. Hard rules:

    - No code, file paths, variable/property names, function names, env var names, or framework/library names.
    - No git/branch/deploy mechanics.
    - Every capability described in terms of "where you'd go and what you'd see" (e.g. "Open HubSpot, click Contacts in the left sidebar, search the customer's name or phone number") rather than "the system calls the Contacts Search API."
    - Be explicit and honest about limitations, manual steps still required, and anything that does NOT happen automatically — pull these from the spec's (and, per step 3, the active feature's Notes) own caveats rather than glossing over them. A marketer acting on an incomplete picture (e.g. assuming a CRM field auto-updates when it doesn't) is the failure mode this document exists to prevent.

    Suggested structure (skip sections that don't apply, don't force all of them):

    - A short, human title (not the spec's technical name)
    - **What this is** — 2-4 plain sentences: what changed and why it matters to the business.
    - **Where to see it** — concrete navigation steps to the actual place a non-technical person would look.
    - **What happens automatically**
    - **What you still have to do manually** (if anything)
    - **What this does NOT do (yet)** — limitations, honestly stated.

6. Derive a filename in plain language, not a mechanical copy of the spec's kebab-case name — name it after what the feature *is* to a non-technical reader (e.g. `hubspot-booking-sync-spec.md` → `docs/hubspot-crm-guide.md`, not `docs/hubspot-booking-sync-guide.md`). Create `docs/` if it doesn't exist. If a file at that path already exists, ask the user whether to overwrite or pick a different name instead of silently clobbering it.

7. Write the file to `docs/{name}.md`.

8. Show the user the file path and a short summary of what's in it.
