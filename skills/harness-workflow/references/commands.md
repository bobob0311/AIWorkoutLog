# Commands

## Inspect Current Phase

```bash
python scripts/execute.py 1-ux-analytics-refactor
```

## Validate Structure Only

```bash
python scripts/execute.py 1-ux-analytics-refactor --dry-run
```

## Complete Current Step

```bash
python scripts/execute.py 1-ux-analytics-refactor --complete --summary "Implemented the current step" --next "Prepare the next task"
```

## Create New Phase

```bash
python scripts/create_phase.py 2-supabase-integration ^
  --project "Health Log Website" ^
  --goal "Replace mock storage with Supabase" ^
  --title "Supabase integration" ^
  --step "schema-and-client" ^
  --step "storage-adapter" ^
  --step "auth-and-migration"
```
