# Step 0: document-decisions

## 읽어야 할 파일
- /AGENT.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /docs/UI_GUIDE.md
- /context/1-ux-analytics-refactor.json
- /phases/1-ux-analytics-refactor/index.json

## 테스트 먼저 작성할 항목
- 문서 결정과 실제 테스트 대상 사이의 불일치 체크리스트
- 캘린더 미니 차트, 기간 설정, 부족 부위, 운동 랭킹 차트 요구를 검증할 테스트 목록

## 작업
- ADR에 달력 시각화, 월 탐색, 기간 설정, 부족 부위, 부위 색상 공유 결정을 추가한다.
- ARCHITECTURE에 새 view-model과 상태 구조를 반영한다.
- UI_GUIDE와 context에 화면 방향성과 해석 기준을 반영한다.

## Acceptance Criteria
```bash
npm run test:unit
npm run test:ui
npm run build
```

## 검증 절차
1. 새 리팩토링 요구가 문서에 빠짐없이 반영되었는지 확인한다.
2. 구현 전에 필요한 테스트 목록이 step별로 나뉘어 있는지 확인한다.
3. phase와 context의 목표, 범위, 위험 요소가 일치하는지 확인한다.

## 금지사항
- 문서 없이 바로 UI 구현으로 넘어가지 말 것
- 차트 색상과 부족 부위 규칙을 구현 중 임의로 바꾸지 말 것
