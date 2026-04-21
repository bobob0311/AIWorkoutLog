# Step 1: build-small-prototype

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/4-simple-experiment.json

## Test First
- Add or update only the tests needed for the prototype behavior.
- If the prototype is documentation-only, state that explicitly in the step notes.

## Work
- Build the smallest prototype that validates the step 0 hypothesis.
- Prefer isolated files or feature-local changes over shared refactors.
- Keep production behavior unchanged unless the experiment requires a visible toggle or route.

## Acceptance Criteria
```bash
npm run lint
npm run test:unit
npm run build
```

## Notes
- Update phase/context status files when this step is done.
