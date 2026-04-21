# Phase State

## Files

- `phases/{task}/index.json`
  Source of truth for step status.
- `phases/index.json`
  Top-level summary index for phases and steps.
- `context/{task}.json`
  Carry-over notes such as title, done, next, decisions, and risks.
- `context/index.json`
  Active phase pointer and context file registry.

## Update Rules

- Update the phase index when a step status changes.
- Synchronize the same change into the top-level phase index.
- Update context `done`, `next`, `status`, and `updated_at` after meaningful progress.
- Do not store full duplicated step state in context.
