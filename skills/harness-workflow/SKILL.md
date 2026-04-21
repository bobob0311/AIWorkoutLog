---
name: harness-workflow
description: Use when Codex needs to operate this repository's harness workflow, including reading AGENT.md, docs, phases, and context files, finding the active step, updating phase status, and keeping context in sync after implementation work.
---

# Harness Workflow

## Start

Read the repository state in this order:

1. `AGENT.md`
2. `docs/PRD.md`
3. `docs/ARCHITECTURE.md`
4. `docs/ADR.md`
5. `docs/UI_GUIDE.md`
6. `phases/index.json`
7. `context/index.json`
8. `phases/{active-phase}/index.json`
9. `context/{active-phase}.json`
10. `phases/{active-phase}/stepN.md`

## Execute

- Treat `phases/{task}/index.json` as the source of truth.
- Keep `phases/index.json` synchronized with the phase index.
- Treat `context/{task}.json` as carry-over notes, not duplicate phase state.
- Follow TDD when implementing step work.

## Commands

- Use `python scripts/execute.py <phase>` to inspect the current phase payload.
- Use `python scripts/execute.py <phase> --complete --summary "<summary>" --next "<next item>"` to complete the current step and sync state files.
- Use `python scripts/create_phase.py <phase> --project "<project>" --goal "<goal>" --title "<title>" --step "<step>"` to create a new phase.

## References

- Read `references/phase-state.md` when you need the exact role of each harness file.
- Read `references/commands.md` when you need concrete command examples.
