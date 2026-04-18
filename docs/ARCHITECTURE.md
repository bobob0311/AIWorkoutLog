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
