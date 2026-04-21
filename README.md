# Codex Harness Framework Port

This repository ports a document-driven Codex harness into a working Next.js project.

## Structure

- `AGENT.md`
  The top-level working rules for Codex in this repository.
- `.codex/`
  Codex-only workspace settings and slash-command docs.
  This is not part of the app runtime.
- `docs/`
  Product and engineering guardrails such as PRD, architecture, ADR, and UI guide.
- `phases/`
  Phase and step status files.
  `phases/{phase}/index.json` is the source of truth for step state.
- `context/`
  Human-readable carry-over notes for each phase.
- `skills/`
  Repository-managed Codex skills.
  Keep skill source folders here and copy or link them into `$CODEX_HOME/skills` or `~/.codex/skills` when auto-discovery is needed.
- `prompts/`
  Manual session notes and retrospective prompts.
  This folder is not automatically executed by the app or harness scripts.
- `scripts/execute.py`
  Reads the current phase state, assembles the working payload, and can now complete the current step while syncing status files.
- `scripts/create_phase.py`
  Creates a new phase directory, step files, phase index, context file, and updates the top-level indexes.

## Runtime vs Codex Harness

There are two different systems in this repository.

1. App runtime
   This is the Next.js app under `src/` and its tests.
2. Codex harness
   This is the working system made of `AGENT.md`, `.codex/`, `docs/`, `phases/`, `context/`, `skills/`, and `scripts/`.

Important:

- `.codex` is used by Codex as a workspace configuration area.
- `.codex` is not imported by the Next.js application.
- `skills/` is the repository source-of-truth for custom Codex skills.
- `prompts/` is currently reference material only.

## Harness Flow

1. Read `AGENT.md`, `docs/*.md`, `phases/index.json`, and `context/index.json`.
2. Open the active phase under `phases/{phase}/index.json` and `context/{phase}.json`.
3. Read the current step file `phases/{phase}/stepN.md`.
4. Implement the work in TDD order.
5. Sync `phases/{phase}/index.json`, `phases/index.json`, and `context/{phase}.json`.
6. Validate with lint, tests, and build.

## Commands

### Show current phase payload

```bash
python scripts/execute.py 1-ux-analytics-refactor
```

### Validate harness structure only

```bash
python scripts/execute.py 1-ux-analytics-refactor --dry-run
```

### Complete the current step and sync state files

```bash
python scripts/execute.py 1-ux-analytics-refactor --complete --summary "Implemented the current step" --next "Prepare the next task"
```

### Create a new phase

```bash
python scripts/create_phase.py 2-supabase-integration ^
  --project "Health Log Website" ^
  --goal "Replace mock storage with Supabase" ^
  --title "Supabase integration" ^
  --step "schema-and-client" ^
  --step "storage-adapter" ^
  --step "auth-and-migration"
```

## Project Validation

```bash
npm run lint
npm run test:unit
npm run test:ui
npm run build
```
