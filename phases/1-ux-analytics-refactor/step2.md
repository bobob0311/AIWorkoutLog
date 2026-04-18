# Step 2: month-navigation

## 읽어야 할 파일
- /docs/ARCHITECTURE.md
- /docs/UI_GUIDE.md
- /context/1-ux-analytics-refactor.json

## 테스트 먼저 작성할 항목
- 이전 월 / 다음 월 / 이번 달 이동 테스트
- 월 이동 시 달력 그리드와 월간 요약이 함께 갱신되는지 검증하는 테스트

## 작업
- 달력에 이전 월, 다음 월, 이번 달 이동을 추가한다.
- 현재 보이는 월 상태를 기준으로 날짜 셀과 요약을 다시 계산한다.
- 날짜 모달과 visible month 상태가 충돌하지 않도록 정리한다.

## Acceptance Criteria
```bash
npm run test:unit
npm run test:ui
npm run build
```

## 검증 절차
1. 여러 월 탐색이 자연스럽게 가능한지 확인한다.
2. 다른 달 기록도 올바르게 집계되는지 확인한다.
3. 오늘 기준 월 복귀가 정상 동작하는지 확인한다.

## 금지사항
- 월 이동 상태를 하드코딩하지 말 것
- 특정 월에만 맞는 계산 로직을 만들지 말 것
