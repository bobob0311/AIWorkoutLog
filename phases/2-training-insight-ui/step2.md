# Step 2: recommendation-and-weekly-trend-model

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/2-training-insight-ui.json

## Test First
- Use the tests from step 1 for recommendation and weekly trend behavior.

## Work
- Extend analytics types with recommendation and weekly trend view-model fields.
- Implement comparable week-to-date bounds.
- Build undertrained body-part recommendations with explicit evidence.
- Build current week, previous comparable week, recent week buckets, and body-part trend summaries.

## Acceptance Criteria
```bash
npm run lint
npm run test:unit
npm run test:ui
npm run build
```

## Notes
- Keep threshold labels in the service layer so UI only renders them.
