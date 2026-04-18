# Step 1: calendar-cell-visualization

## 읽어야 할 파일
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /docs/UI_GUIDE.md
- /context/1-ux-analytics-refactor.json

## 테스트 먼저 작성할 항목
- 날짜 셀의 총 볼륨 badge 표시 테스트
- 부위별 미니 차트 segment 계산 테스트
- 텍스트 나열 대신 차트 기반 표현이 유지되는지 확인하는 UI 테스트

## 작업
- 날짜 셀에서 총 볼륨과 부위별 집계를 분리해서 보이도록 바꾼다.
- 부위별 총 볼륨은 미니 차트 형식으로 표현한다.
- 가장 많이 한 부위 텍스트는 날짜 셀에서 제거한다.

## Acceptance Criteria
```bash
npm run test:unit
npm run test:ui
npm run build
```

## 검증 절차
1. 날짜 셀 정보가 한눈에 구분되는지 확인한다.
2. 같은 부위가 같은 색으로 표시되는지 확인한다.
3. 셀 크기 안에서 모바일 가독성이 유지되는지 확인한다.

## 금지사항
- 셀 안에 다시 긴 텍스트 목록을 넣지 말 것
- 차트 색상을 화면마다 다르게 정의하지 말 것
