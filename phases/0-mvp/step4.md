# Step 4: analytics

## 읽어야 할 파일
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /docs/UI_GUIDE.md
- /context/0-mvp.json
- /phases/0-mvp/index.json

## 테스트 먼저 작성할 항목
- 일/주/월 기간 전환 테스트
- 부위별 볼륨 집계 함수 테스트
- 요약 카드 수치 테스트
- 막대 차트 데이터 매핑 테스트

## 작업
- 통계 화면의 기본 구조를 만든다.
- 일/주/월 전환 UI를 구현한다.
- 부위별 볼륨 집계 로직과 요약 카드를 구현한다.
- 부위별 막대 차트를 구현한다.

## Acceptance Criteria
```bash
npm run test:unit
npm run test:ui
npm run build
```

## 검증 절차
1. 집계와 통계 UI 관련 실패 테스트를 먼저 작성한다.
2. 테스트가 실패하는지 확인한다.
3. 최소 구현으로 테스트를 통과시킨다.
4. 위 명령을 실행한다.
5. 통계 수치가 달력과 날짜 상세의 볼륨 계산 기준과 일치하는지 확인한다.

## 금지사항
- 통계 화면에서 임의의 별도 계산 규칙을 만들지 마라.
- 차트 시각 효과를 위해 핵심 숫자 가독성을 희생하지 마라.

