# Step 2: context-tracking

## 읽어야 할 파일
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/UI_GUIDE.md
- /context/0-mvp.json
- /phases/0-mvp/index.json
- /docs/ADR.md

## 테스트 먼저 작성할 항목
- 월간 달력 렌더링 테스트
- 날짜 클릭 시 상세 페이지 이동 테스트
- 기록 있는 날짜 강조 표시 테스트
- 날짜 셀에 총 볼륨과 부위별 볼륨 숫자가 보이는 테스트
- 이번 달 요약 정보가 보이는 테스트

## 작업
- 달력 메인 화면의 기본 구조를 만든다.
- 날짜 셀에 총 볼륨과 부위별 볼륨 숫자를 표시한다.
- 날짜 클릭 시 상세 페이지로 이동하는 흐름을 만든다.
- 현재 step 결과와 다음 작업 메모가 context에 이어지도록 유지한다.

## Acceptance Criteria
```bash
npm run test:unit
npm run test:ui
npm run build
```

## 검증 절차
1. 달력 관련 실패 테스트를 먼저 작성한다.
2. 테스트가 실패하는지 확인한다.
3. 최소 구현으로 테스트를 통과시킨다.
4. 위 명령을 실행한다.
5. 날짜 셀 정보 밀도와 모바일 가독성을 함께 확인한다.

## 금지사항
- phases와 같은 역할의 데이터를 context에 중복 저장하지 마라.
- 부위별 볼륨을 색상만으로 표현하지 마라. 숫자와 라벨이 우선이어야 한다.
