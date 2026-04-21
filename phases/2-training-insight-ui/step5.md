# Step 5: polish-and-review

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/2-training-insight-ui.json

## Test First
- Run the full validation suite after polish changes.

## Work
- Review mobile layout for dense analytics sections.
- Verify long exercise names do not break cards.
- Verify empty and insufficient-data states.
- Sync phase and context status files after validation.

## Acceptance Criteria
```bash
npm run lint
npm run test:unit
npm run test:ui
npm run build
```

## Notes
- Final validation order: lint, unit tests, UI tests, build.
