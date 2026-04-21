# Step 5: polish-and-review

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/3-analytics-refactor-and-date-baseline.json

## Test First
- 최종 검증 명령을 모두 실행한다.

## Work
- 통계/비교 화면 회귀를 확인한다.
- 새 phase와 context 상태를 완료로 동기화한다.
- lint, unit, UI, build 검증 결과를 확인한다.

## Acceptance Criteria
```bash
npm run lint
npm run test:unit
npm run test:ui
npm run build
```

## Notes
- 검증 순서: lint, unit test, UI test, build.
