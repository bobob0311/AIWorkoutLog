# Step 3: analytics-range-and-undertrained

## 읽어야 할 파일
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/1-ux-analytics-refactor.json

## 테스트 먼저 작성할 항목
- custom range 집계 테스트
- 부족 부위 계산 테스트
- preset과 custom range 간 결과 전환 테스트

## 작업
- 통계에 일 / 주 / 월 preset 유지 + 직접 기간 설정을 추가한다.
- 선택 기간 기준으로 총 볼륨, 부위별 볼륨, 부족 부위를 계산한다.
- 직전 동일 길이 기간과 비교하는 부족 부위 규칙을 구현한다.

## Acceptance Criteria
```bash
npm run test:unit
npm run test:ui
npm run build
```

## 검증 절차
1. 같은 데이터로 preset과 custom range가 일관되게 계산되는지 확인한다.
2. 직전 기간 데이터가 부족한 경우 fallback이 정상 적용되는지 확인한다.
3. 부족 부위 설명 문구가 계산 기준과 맞는지 확인한다.

## 금지사항
- UI 컴포넌트 안에서 부족 부위 계산을 직접 하지 말 것
- fallback 규칙 없이 부족 부위를 빈 상태로 두지 말 것
