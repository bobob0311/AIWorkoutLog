# Step 0: document-training-insight-decisions

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/2-training-insight-ui.json

## Test First
- Documentation-only step. Validate by reading the changed docs and running the phase dry-run.

## Work
- Add ADRs for training insight placement, evidence-backed recommendation, separated growth concepts, and comparable period rules.
- Update architecture with analytics view-model additions and service-owned comparison logic.
- Update UI guide with recommendation, weekly trend, and exercise progress display rules.
- Update this phase context with as-is, to-be, decisions, risks, and next work.

## Acceptance Criteria
```bash
npm run lint
npm run test:unit
npm run test:ui
npm run build
```

## Notes
- Keep this step focused on decisions and docs before implementation.
