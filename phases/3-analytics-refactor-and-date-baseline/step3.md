# Step 3: split-analytics-dashboard-components

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/3-analytics-refactor-and-date-baseline.json

## Test First
- 기존 analytics UI 테스트가 통과하는 상태를 유지하면서 분리한다.

## Work
- `AnalyticsRangeFilter`, `AnalyticsStatsView`, `AnalyticsComparisonView`로 렌더링 책임을 분리한다.
- 반복 UI는 `SummaryCards`, `BodyPartVolumeList`, `ExerciseRankingList`, `WeeklyTrendPanel`, `ExerciseProgressList` 같은 작은 컴포넌트로 나눈다.
- `AnalyticsDashboard`는 상태와 view model 생성, view 선택만 담당한다.

## Acceptance Criteria
```bash
npm run lint
npm run test:unit
npm run test:ui
npm run build
```

## Notes
- 분석 계산은 analytics-service에 남긴다.
