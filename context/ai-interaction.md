# AI Interaction Guidelines

## Communication

- Be concise and direct

## Workflow

This is the common workflow that we will use for every single feature:

1. **Draft** - Draft the feature specs in a new .md inside `@context/features/`
2. **Load** - Load the feature in `@context/current-feature.md`
3. **Branch** - Create a new branch for feature
4. **Implement** - Implement the feature from `@context/current-feature.md`
5. **Document** - Document the feature for non-technical person (e.g. Marketer, Owner) in a new .md file inside `@docs/`
6. **Commit** - Only after build passes and everything works
7. **Merge** - Merge to main
8. **Delete Branch** - Delete branch after merge
9. **Log** - Add history in `@context/feature-history.md`