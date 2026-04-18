# Harness Loop 정리

## 목적
이 문서는 지금까지 설계한 Codex용 하네스 루프를 한 번에 이해할 수 있도록 정리한 문서다.
무엇을 먼저 읽고, 어떤 순서로 구현하고, 어떤 파일을 반드시 갱신해야 하는지와 함께 현재 구조의 문제점과 개선 방향도 같이 남긴다.

## 현재 하네스 구조
- `AGENT.md`: 프로젝트의 최상위 규칙 문서
- `.codex/commands/harness.md`: 작업 루프 규칙
- `.codex/commands/review.md`: 리뷰 루프 규칙
- `.codex/settings.json`: 위험 명령 차단, 작업 종료 시 검증 훅
- `docs/`: PRD, ARCHITECTURE, ADR, UI_GUIDE
- `phases/`: phase와 step 상태 관리
- `context/`: 사람이 읽고 다음 세션이 이어받는 작업 맥락
- `scripts/execute.py`: phase 구조와 현재 step을 읽어주는 실행기

## 실제 작업 루프
### 1. 시작
가장 먼저 아래 파일을 읽는다.

1. `AGENT.md`
2. `docs/PRD.md`
3. `docs/ARCHITECTURE.md`
4. `docs/ADR.md`
5. `docs/UI_GUIDE.md`
6. `phases/index.json`
7. `context/index.json`
8. 현재 active phase의 `phases/{task}/index.json`
9. 현재 active phase의 `context/{task}.json`
10. 현재 step의 `phases/{task}/stepN.md`

### 2. 계획 확인
- 현재 active phase와 pending step을 확인한다.
- `phases/{task}/index.json`이 source of truth다.
- `phases/index.json`은 상위 요약 인덱스다.
- 상태가 바뀌면 하위 index와 상위 index를 같이 동기화한다.

### 3. 구현 방식
각 step은 아래 순서를 반드시 따른다.

1. 테스트 작성
2. 실패 확인
3. 최소 구현
4. 테스트 통과 확인
5. 리팩터링

즉, 하네스의 핵심 구현 철학은 TDD다.

### 4. 구현 중 참고 기준
- 제품 목적은 `PRD.md`
- 기술 구조는 `ARCHITECTURE.md`
- 왜 그렇게 했는지는 `ADR.md`
- 화면 기준과 표현 원칙은 `UI_GUIDE.md`
- 현재 세션 맥락과 이어받기 메모는 `context/{task}.json`

### 5. 마감
step이 끝나면 반드시 아래를 갱신한다.

- `phases/{task}/index.json`
- `phases/index.json`
- `context/{task}.json`

갱신 내용:
- `status`
- `summary`
- `done`
- `next`
- `updated_at`

### 6. 검증
현재 프로젝트 기준 검증 루프는 아래다.

```bash
npm run lint
npm run test:unit
npm run test:ui
npm run build
```

`.codex/settings.json`의 `Stop` hook도 이 순서를 그대로 사용한다.

## 좋은 점
- `phase / step / context`가 분리돼 있어서 세션이 끊겨도 다시 이어가기 쉽다.
- TDD를 문서와 구현 양쪽에서 강제하고 있어서 회귀를 막기 좋다.
- `AGENT.md`와 `harness.md`가 있어 구현 규칙과 실행 루프가 분리돼 있다.
- `phases/index.json`까지 step 상태를 올려 보여주기 때문에 전체 진행 상황을 빠르게 훑기 좋다.

## 잘못되었거나 아쉬운 부분
### 1. 문서 인코딩 안정성이 약했다
- 중간에 몇몇 md/json/tsx 파일에서 한글이 깨졌다.
- 작업은 맞게 진행됐지만 읽기와 유지보수 비용이 올라갔다.

개선:
- UTF-8 고정 저장을 명시한다.
- 다음부터는 큰 문서 파일을 갱신할 때 깨진 문자열이 없는지 바로 점검한다.

### 2. 상위 상태 동기화 규칙이 늦게 문서화됐다
- 처음엔 `phases/{task}/index.json`만 관리하고 있었고,
- `phases/index.json` step 상태 동기화는 나중에 추가됐다.

개선:
- 지금은 `AGENT.md`와 `harness.md`에 반영되어 있으므로, 다음 phase부터는 시작 시점부터 이 규칙을 유지한다.

### 3. settings 훅이 placeholder 상태였다
- `.codex/settings.json`의 `Stop` hook이 실제 프로젝트 명령을 돌리지 않고 placeholder 메시지만 출력하고 있었다.

개선:
- 이번에 `lint -> test:unit -> test:ui -> build` 순서로 교체했다.
- `lint`는 현재 `tsc --noEmit` 기준으로 동작한다.

### 4. review 규칙과 실제 리뷰 출력 포맷이 덜 연결돼 있다
- `review.md`는 규칙은 있지만, 실제로 어떤 형식의 finding을 남길지 예시가 약하다.

개선:
- 다음 phase에서 `review template` 예시를 추가하면 더 좋다.
- 예: `severity / file / problem / why / fix direction`

### 5. execute.py가 상태 읽기 중심이고 자동 갱신은 하지 않는다
- 지금 `scripts/execute.py`는 구조 검증과 현재 step 요약에는 좋지만,
- step 완료 후 상태 파일을 자동으로 갱신하지는 않는다.

개선:
- 다음 버전에서는 phase 상태 동기화 helper를 넣어 자동화 범위를 늘릴 수 있다.
- 다만 지금처럼 수동 갱신 구조는 실수는 있지만 투명성은 높다.

## 추천 개선안
### 단기 개선
- `README.md`를 한글 기준으로 다시 정리
- `review.md` 한글 정리 및 출력 예시 추가
- `scripts/execute.py` 출력 한글 깨짐 정리

### 중기 개선
- `scripts/sync_phase_index.py` 같은 동기화 스크립트 추가
- `phases/{task}/index.json`을 읽어 상위 `phases/index.json`을 자동 갱신
- `context/{task}.json`의 `done/next` 템플릿 자동 보조

### 장기 개선
- mock 기반 하네스에서 실제 Supabase 연동 phase 분리
- review 자동화 수준 강화
- phase 종료 시 retrospection 템플릿 자동 생성

## 지금 기준 추천 운영 규칙
- 새 작업은 반드시 새 phase로 연다.
- phase를 열기 전 `PRD/ARCHITECTURE/ADR/context`를 먼저 갱신한다.
- step 완료 전 테스트 통과와 상태 파일 갱신을 같은 체크리스트로 묶는다.
- 상위 인덱스와 하위 인덱스가 어긋나면 하위 인덱스를 기준으로 바로 수정한다.
- mock으로 먼저 구현한 것은 `next`나 새 phase에 반드시 기술 부채로 남긴다.

## 다음에 바로 이어갈 때 쓸 요약
```text
이 저장소는 Codex용 harness 구조를 사용한다.
가장 먼저 AGENT.md, docs/*.md, phases/index.json, context/index.json, active phase의 index/context/step 문서를 읽는다.
구현은 항상 TDD로 진행한다.
step 완료 시 phases/{task}/index.json, phases/index.json, context/{task}.json을 함께 갱신한다.
검증은 npm run lint, npm run test:unit, npm run test:ui, npm run build 순서로 실행한다.
```
