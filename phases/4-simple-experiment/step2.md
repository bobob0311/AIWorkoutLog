# Step 2: review-result

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/4-simple-experiment.json

## Test First
- Run the smallest verification set that covers the prototype.

## Work
- Record whether the experiment should be abandoned, kept as a prototype, or promoted into a future phase.
- Update phase and context status with the result.
- Remove throwaway code if the result is abandon.

## Acceptance Criteria
```bash
npm run lint
npm run test:unit
npm run build
```

## Notes
- Update phase/context status files when this step is done.
