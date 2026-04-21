# Step 1: analytics-view-model-tests

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/2-training-insight-ui.json

## Test First
- Add failing analytics service tests for the new insight view-model fields.

## Work
- Cover `recommendedBodyParts` with undertrained sorting and evidence.
- Cover `weeklyVolumeTrend` with current-week-to-date vs previous-week-same-weekday comparison.
- Cover recent week buckets.
- Cover `exerciseProgressChanges` for latest-vs-previous session comparison.
- Cover insufficient data fallbacks.

## Acceptance Criteria
```bash
npm run lint
npm run test:unit
npm run test:ui
npm run build
```

## Notes
- Tests should describe the expected behavior before model implementation.
