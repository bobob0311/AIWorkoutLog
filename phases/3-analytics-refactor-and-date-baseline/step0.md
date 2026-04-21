# Step 0: document-refactor-decisions

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/3-analytics-refactor-and-date-baseline.json

## Test First
- 문서 정리 step이다. 구현 테스트 대신 phase dry-run으로 구조를 확인한다.

## Work
- PRD에 통계/비교 화면 역할과 오늘 날짜 기준 성공 조건을 반영한다.
- ADR에 컴포넌트 분리, 기준 날짜, 한글 작성 결정을 추가한다.
- ARCHITECTURE에 analytics widget 분리 구조와 날짜 helper 위치를 반영한다.
- UI_GUIDE에 통계/비교 화면별 UI 기준을 추가한다.
- context에 as-is, to-be, decisions, risks를 갱신한다.

## Acceptance Criteria
```bash
npm run lint
npm run test:unit
npm run test:ui
npm run build
```

## Notes
- 구현 전 문서 기준을 먼저 고정한다.
