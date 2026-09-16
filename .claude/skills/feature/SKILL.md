---
name: feature
description: Manage current feature workflow - draft, load, start, document, or complete
argument-hint: draft|load|start|document|complete
---

# Feature Workflow

Manages the full lifecycle of a feature from spec to merge.

## Working File

@context/current-feature.md

### File Structure

current-feature.md has these sections:

- `# Current Feature` - H1 heading with feature name when active
- `## Goals` - Bullet points of what success looks like
- `## Notes` - Additional context, constraints, or details from spec

## Task

Execute the requested actions: $ARGUMENTS

| Action     | Description                                                  |
| ---------- | -------------------------------------------------------------|
| `draft`    | Draft a new feature spec into context/features/              |
| `load`     | Load a feature spec or inline description                    |
| `start`    | Begin implementation, create branch                          |
| `document` | Write a non-technical explainer of a feature spec into docs/ |
| `complete` | Log, commit, push, merge, reset                              |

See [actions/](actions/) for detailed instructions.

If no action provided, explain the available options.