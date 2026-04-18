# Step 3: exercise-catalog-and-daily-record

## 읽어야 할 파일
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /docs/UI_GUIDE.md
- /context/0-mvp.json
- /phases/0-mvp/index.json
- /src/app/calendar/[date]/page.tsx
- /src/app/calendar/page.tsx

## 테스트 먼저 작성할 항목
- 날짜 상세 페이지 렌더링 테스트
- 기본 운동 목록 검색 테스트
- 사용자 운동 추가 후 재검색 테스트
- 세트 추가/삭제 테스트
- 운동 총 볼륨 계산 테스트
- 운동 기록 생성/수정/삭제 테스트

## 작업
- 날짜 상세 페이지의 기본 구조를 만든다.
- 기본 운동 목록과 사용자 추가 운동 목록을 함께 검색하는 흐름을 만든다.
- 운동 기록 CRUD와 세트 단위 입력 흐름을 구현한다.
- 세트 데이터 기준의 운동 총 볼륨 계산을 UI에 반영한다.

## Acceptance Criteria
```bash
npm run test:unit
npm run test:ui
npm run build
```

## 검증 절차
1. 운동 검색, 세트 입력, CRUD 관련 실패 테스트를 먼저 작성한다.
2. 테스트가 실패하는지 확인한다.
3. 최소 구현으로 테스트를 통과시킨다.
4. 위 명령을 실행한다.
5. 날짜 상세 화면에서 운동 기록 흐름이 달력과 자연스럽게 이어지는지 확인한다.

## 금지사항
- 기본 운동 목록과 사용자 추가 운동 목록을 같은 데이터 소스로 뭉개지 마라.
- 세트 볼륨 계산을 화면마다 다르게 구현하지 마라.

