# Step 4: exercise-ranking-chart

## 읽어야 할 파일
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/1-ux-analytics-refactor.json

## 테스트 먼저 작성할 항목
- 운동별 총 볼륨 집계 테스트
- 볼륨 내림차순 정렬 테스트
- 부위 색상 매핑 테스트

## 작업
- 통계 화면에 운동별 총 볼륨 랭킹 차트를 추가한다.
- 차트는 볼륨이 높은 순서대로 정렬한다.
- 같은 부위 운동은 같은 색, 다른 부위 운동은 다른 색을 사용한다.

## Acceptance Criteria
```bash
npm run test:unit
npm run test:ui
npm run build
```

## 검증 절차
1. 운동 랭킹 차트가 부위 통계와 같은 데이터 기준을 쓰는지 확인한다.
2. 정렬 순서가 총 볼륨 기준으로 일관적인지 확인한다.
3. 색상과 라벨만 봐도 운동과 부위를 구분할 수 있는지 확인한다.

## 금지사항
- 운동별 임의 색상을 새로 만들지 말 것
- 정렬 기준을 화면마다 다르게 두지 말 것
