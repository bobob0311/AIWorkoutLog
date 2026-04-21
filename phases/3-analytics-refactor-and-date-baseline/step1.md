# Step 1: date-baseline-tests

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/3-analytics-refactor-and-date-baseline.json

## Test First
- 오늘 날짜 helper 단위 테스트를 먼저 추가한다.

## Work
- `YYYY-MM-DD` 형식의 오늘 날짜 문자열을 만드는 helper의 기대 동작을 테스트한다.
- analytics client page가 기준 날짜를 외부에서 받을 수 있는 구조를 테스트한다.
- 테스트에서는 고정 날짜를 주입해 결과가 흔들리지 않게 한다.

## Acceptance Criteria
```bash
npm run lint
npm run test:unit
npm run test:ui
npm run build
```

## Notes
- 운영 기본값은 오늘 날짜, 테스트 기본값은 명시적 주입을 사용한다.
