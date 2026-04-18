# Step 5: polish-and-review

## 읽어야 할 파일
- /AGENT.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /docs/UI_GUIDE.md
- /context/1-ux-analytics-refactor.json
- /phases/1-ux-analytics-refactor/index.json

## 테스트 먼저 작성할 항목
- 모바일 날짜 셀 가독성 보강 테스트
- 색 대비와 차트 범례 일관성 테스트
- 기간 설정과 월 이동 회귀 테스트

## 작업
- 주요 화면의 모바일 사용성을 정리한다.
- 차트 색상, 범례, 빈 상태 표현을 다듬는다.
- 문서, context, phase 상태를 최종 정리한다.

## Acceptance Criteria
```bash
npm run test:unit
npm run test:ui
npm run build
```

## 검증 절차
1. 회귀 테스트를 먼저 보강한다.
2. 리팩토링 결과가 기존 운동 기록/통계 흐름을 깨지 않는지 확인한다.
3. 문서와 실제 구현 결과가 일치하는지 확인한다.

## 금지사항
- 시각 효과를 위해 숫자 가독성을 해치지 말 것
- phase와 context 갱신을 생략하지 말 것
