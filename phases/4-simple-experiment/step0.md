# Step 0: define-experiment

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/4-simple-experiment.json

## Test First
- This is a planning step. No implementation test is required unless the experiment changes executable behavior.

## Work
- Write the experiment hypothesis in `/context/4-simple-experiment.json`.
- Decide the smallest user-visible or developer-visible prototype that can validate it.
- Record what is explicitly out of scope for this phase.

## Acceptance Criteria
- The context file has a clear hypothesis, prototype scope, and rollback/promotion note.
- Step 1 can start without needing additional product discovery.

## Notes
- Update phase/context status files when this step is done.
