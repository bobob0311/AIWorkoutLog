# Step 3: exercise-progress-model

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/2-training-insight-ui.json

## Test First
- Use the tests from step 1 for exercise progress behavior.

## Work
- Group logs by exercise name.
- Compare the latest two session dates for each exercise.
- Calculate volume, max weight, set count, and average reps for each session.
- Return a compact progress status and supporting note.

## Acceptance Criteria
```bash
npm run lint
npm run test:unit
npm run test:ui
npm run build
```

## Notes
- Exercise-name matching is the first version; do not add alias management in this phase.
