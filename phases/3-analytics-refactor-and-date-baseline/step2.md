# Step 2: remove-hardcoded-reference-date

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/3-analytics-refactor-and-date-baseline.json

## Test First
- step 1의 날짜 helper 테스트를 기준으로 구현한다.

## Work
- shared/lib에 오늘 날짜 helper를 추가한다.
- `/analytics`와 `/analytics/compare`의 `referenceDate="2026-04-14"` 하드코딩을 제거한다.
- 필요하면 client page props로 기준 날짜를 주입 가능하게 한다.

## Acceptance Criteria
```bash
npm run lint
npm run test:unit
npm run test:ui
npm run build
```

## Notes
- 날짜 계산은 UI 컴포넌트 내부에 직접 작성하지 않는다.
