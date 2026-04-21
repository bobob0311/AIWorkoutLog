# 아키텍처

## 디렉터리 구조
```text
src/
├─ app/                     # App Router 루트 레이아웃, 페이지
├─ shared/                  # 공통 UI, 설정, supabase client, 유틸
├─ entities/
│  ├─ profile/
│  ├─ body-part/
│  ├─ exercise/
│  ├─ exercise-log/
│  ├─ exercise-set/
│  └─ calendar-day/
├─ features/
│  ├─ select-profile/
│  ├─ unlock-with-password/
│  ├─ view-calendar/
│  ├─ view-day-records/
│  ├─ add-exercise-log/
│  ├─ edit-exercise-log/
│  ├─ delete-exercise-log/
│  ├─ search-exercise/
│  ├─ add-custom-exercise/
│  └─ view-volume-analytics/
├─ widgets/
│  ├─ login-panel/
│  ├─ calendar-grid/
│  ├─ day-summary/
│  ├─ exercise-form/
│  ├─ exercise-list/
│  ├─ volume-cards/
│  └─ body-part-bar-chart/
└─ processes/               # 현재 단계에서는 최소 사용
```

## 원칙
- App Router 기반으로 페이지를 구성한다.
- FSD 레이어 규칙을 지키고 `app -> widgets -> features -> entities -> shared` 방향으로만 참조한다.
- 스타일링은 Emotion을 사용하고, 스타일은 컴포넌트와 가까운 위치에 둔다.
- 모든 도메인 로직과 집계 로직은 테스트 가능한 service/model 함수로 분리한다.
- TDD를 전제로 설계하고, 구현보다 테스트 케이스를 먼저 만든다.

## 데이터 흐름
```text
프로필 선택 + 비밀번호 입력
-> 인증 검증
-> 로그인 사용자 컨텍스트 확정
-> 달력 화면에서 현재 보이는 월 조회
-> 날짜 셀별 총 볼륨 + 부위별 집계 + 미니 차트 표시
-> 날짜 선택
-> 기록 모달에서 운동 기록 CRUD
-> 세트 데이터 저장
-> 같은 데이터 기준으로 달력 / 통계 / 운동 랭킹 갱신
```

## 상태 관리
- 서버 상태와 영속 데이터는 최종적으로 Supabase를 기준으로 관리한다.
- 현재 단계에서는 mock 저장소를 사용하지만, 조회/저장은 단일 storage 경로로 통일한다.
- 달력은 `visibleMonth`, `selectedDate`, `isRecordModalOpen` 상태를 가진다.
- 통계는 `rangePreset`, `customRange`, `referenceDate` 상태를 가진다.
- 모달과 통계가 읽는 집계 값은 모두 동일한 exercise log source에서 파생된다.

## 캘린더 리팩토링 기준
- 날짜 셀 view-model에는 아래 정보가 들어간다.
  - `totalVolume`
  - `bodyPartVolumes`
  - `bodyPartChartSegments`
- 날짜 셀 텍스트 목록은 축소하고, `총 볼륨 badge + 부위별 미니 차트`를 우선 표시한다.
- 달력은 이전 월 / 다음 월 / 이번 달 이동을 지원한다.

## 통계 리팩토링 기준
- analytics view-model에는 아래 정보가 들어간다.
  - `rangePreset`
  - `customRange`
  - `previousRange`
  - `undertrainedBodyParts`
  - `exerciseRanking`
- 부족 부위 계산, 운동 랭킹 정렬, 차트 색상 매핑은 UI가 아니라 service/model 계층에서 계산한다.
- 부위 색상은 공통 팔레트로 관리하고, 운동 랭킹 차트도 해당 운동의 부위 색을 따른다.
## 훈련 인사이트 분석 구조

추천과 비교 계산은 analytics model이 담당한다. UI 컴포넌트는 준비된 view model을 렌더링하고, 훈련 판단 로직을 다시 계산하지 않는다.

`AnalyticsViewModel`에는 다음 정보가 포함된다.

- `recommendedBodyParts`: 부족 근거를 기준으로 정렬한 다음 운동 추천 부위
- `weeklyVolumeTrend`: 이번 주 같은 요일까지의 볼륨, 지난주 같은 요일까지의 볼륨, 최근 주간 버킷, 부위별 추세
- `exerciseProgressChanges`: 운동별 최근 세션과 직전 세션 비교

비교 규칙:

- 이번 주 비교는 기준일이 속한 주의 시작일부터 기준일까지를 사용한다.
- 지난주 비교는 지난주 시작일부터 같은 요일까지를 사용한다.
- 최근 4주 추세는 완료된 주 단위 버킷을 사용한다.
- 운동별 수행 변화는 같은 `exerciseName`의 최근 2개 세션을 비교한다.
- 상태 라벨은 UI가 아니라 service/model 출력값을 사용한다.

데이터 흐름:

```text
exercise logs
-> analytics-service
-> AnalyticsViewModel
-> AnalyticsDashboard
-> 통계 화면 / 비교 화면
```

`/analytics`는 통계 화면이고 `/analytics/compare`는 비교 화면이다. 달력은 기록 진입점으로 유지한다.
## 분석 화면 리팩토링 구조

분석 화면은 계산 로직과 렌더링 책임을 분리한다.

- `AnalyticsDashboard`: 기간 상태, 기준일, `AnalyticsViewModel` 생성, 통계/비교 view 선택
- `AnalyticsRangeFilter`: 일간/주간/월간/직접 기간 선택
- `AnalyticsStatsView`: 통계 화면 본문
- `AnalyticsComparisonView`: 비교 화면 본문
- `SummaryCards`, `BodyPartVolumeList`, `ExerciseRankingList`, `WeeklyTrendPanel`, `ExerciseProgressList`: 반복 UI 조각

날짜 기준:

- 운영 화면의 기본 기준일은 실제 오늘 날짜다.
- 오늘 날짜 문자열은 shared/lib의 공용 helper에서 `YYYY-MM-DD`로 만든다.
- 테스트나 스토리처럼 고정 기준일이 필요한 곳은 props로 명시적으로 주입한다.

계층 규칙:

- 분석 계산은 `entities/analytics/model/analytics-service.ts`에서 수행한다.
- 날짜 문자열 생성처럼 여러 화면에서 재사용되는 순수 helper는 `shared/lib`에 둔다.
- UI 컴포넌트는 추천 점수, 주간 비교 범위, 운동별 수행 변화 상태를 직접 계산하지 않는다.
