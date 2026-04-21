# Step 4: analytics-dashboard-insight-ui

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/2-training-insight-ui.json

## Test First
- Add or update UI tests for the analytics insight sections before styling details.

## Work
- Add a next-workout recommendation section at the top of analytics.
- Add weekly volume trend summary and body-part trend rows.
- Add exercise progress cards.
- Keep existing comparison, ranking, and body-part volume sections below the new insight sections.
- Add mobile-safe layouts and empty states.

## Acceptance Criteria
```bash
npm run lint
npm run test:unit
npm run test:ui
npm run build
```

## Notes
- Keep cards compact and evidence-forward; avoid adding a separate coach route.
