# Harness Audit

작성일: 2026-04-18

## 한줄 결론

현재 하네스는 "문서 기반 작업 규칙 + phase/context 상태 추적 + 실행 전 검증" 구조로는 꽤 잘 잡혀 있다. 다만 아직 `scripts/execute.py`가 상태를 "읽고 출력"하는 수준에 머물러 있고, `.codex`와 `prompts/` 일부는 Codex 세션 보조용이지 프로젝트 런타임과 직접 연결되지는 않는다.

검증 결과:

- `npm run lint`: 통과
- `npm run test:unit`: 통과
- `npm run test:ui`: 통과
- `npm run build`: 통과

즉, 코드베이스 자체는 현재 기준으로 정상 상태라고 봐도 된다.

## 지금 하네스가 어떤 순서로 이어지는가

실제 의도된 흐름은 아래 순서다.

1. Codex가 저장소에 들어오면 [`AGENT.md`](../AGENT.md)와 `docs/*.md`, `phases/`, `context/`를 먼저 읽는다.
2. 현재 활성 phase와 step을 `phases/index.json`, `phases/{phase}/index.json`, `context/{phase}.json`에서 파악한다.
3. 현재 step 문서 `phases/{phase}/stepN.md`를 읽고 TDD 순서로 구현한다.
4. 구현이 끝나면 `phases/{phase}/index.json`, 상위 요약인 `phases/index.json`, 그리고 `context/{phase}.json`을 같이 갱신한다.
5. 작업 종료 시 Codex hook이 `lint -> test:unit -> test:ui -> build`를 돌린다.

이 흐름의 핵심 source of truth는 [`phases/{task}/index.json`](../phases/0-mvp/index.json)이고, [`phases/index.json`](../phases/index.json)은 상위 요약 인덱스다.

## 각 폴더가 실제로 어디서 쓰이는가

### `AGENT.md`

- 프로젝트 전체 작업 규칙의 최상위 문서다.
- `scripts/execute.py`가 guardrail 문서를 만들 때 직접 읽는다.
- Codex 세션에서도 사람 규칙 문서처럼 먼저 읽히는 전제다.

근거:

- [`AGENT.md:25`](../AGENT.md)
- [`scripts/execute.py:78`](../scripts/execute.py)
- [`scripts/execute.py:153`](../scripts/execute.py)

### `docs/`

- PRD, ARCHITECTURE, ADR, UI_GUIDE는 하네스 기준 문서다.
- `scripts/execute.py`가 prompt 조합 시 전부 읽는다.
- 앱 런타임에서 직접 import 하지는 않는다.

근거:

- [`scripts/execute.py:78`](../scripts/execute.py)
- [`scripts/execute.py:158`](../scripts/execute.py)

### `phases/`

- 실제 작업 단계 상태 저장소다.
- `scripts/execute.py`가 현재 phase 디렉터리, step index, 상위 index를 읽는다.
- `step*.md`는 현재 작업 지시서 역할이다.

근거:

- [`scripts/execute.py:30`](../scripts/execute.py)
- [`scripts/execute.py:33`](../scripts/execute.py)
- [`scripts/execute.py:34`](../scripts/execute.py)
- [`scripts/execute.py:176`](../scripts/execute.py)

### `context/`

- 각 phase의 목적, done, next, decision, risk를 기록하는 이어받기 메모다.
- `scripts/execute.py`가 현재 context를 읽어 prompt와 next 목록을 만든다.

근거:

- [`scripts/execute.py:31`](../scripts/execute.py)
- [`scripts/execute.py:35`](../scripts/execute.py)
- [`scripts/execute.py:63`](../scripts/execute.py)

### `.codex/`

이 폴더는 앱 코드가 쓰는 폴더가 아니다. Codex 작업 환경이 쓰는 폴더다.

- `.codex/commands/harness.md`
  - `/harness` 같은 커스텀 명령의 설명 문서 역할
  - Codex 세션에서 slash command를 호출할 때 의미가 있다
  - `scripts/execute.py`나 Next.js 앱은 이 파일을 읽지 않는다
- `.codex/commands/review.md`
  - 리뷰용 커스텀 명령 문서
  - 역시 Codex 세션용
- `.codex/settings.json`
  - Codex hook 설정
  - 작업 종료 시 검증 명령 실행
  - 위험 명령 패턴 차단

근거:

- [`README.md:7`](../README.md)
- [`docs/HARNESS_LOOP.md`](./HARNESS_LOOP.md)
- [`/.codex/settings.json:3`](../.codex/settings.json)
- [`/.codex/settings.json:14`](../.codex/settings.json)

정리하면, `.codex`는 "개발 하네스 운영 설정"이고 "프로덕트 코드 런타임 의존성"은 아니다.

### `prompts/`

- 현재 저장소 안에서는 자동 사용 경로가 없다.
- 검색 기준으로 `prompts/2026-04-17-session-retrospective.prompt.md`는 다른 코드에서 참조되지 않는다.
- 즉 이 폴더는 회고나 다음 세션 부트스트랩용 참고 문서에 가깝다.

판정:

- 지금은 사실상 수동 참고 자료
- 자동 실행 경로에는 미연결

### `scripts/execute.py`

- 하네스의 중심 실행기다.
- phase/context/docs를 읽어 현재 step payload와 prompt를 만든다.
- 하지만 아직 상태 파일을 자동 갱신하거나 다음 step을 실제로 진행시키지는 않는다.

근거:

- [`scripts/execute.py:61`](../scripts/execute.py)
- [`scripts/execute.py:131`](../scripts/execute.py)
- [`scripts/execute.py:197`](../scripts/execute.py)
- [`scripts/execute.py:204`](../scripts/execute.py)

## 현재 상태에서 실제로 안 쓰이거나 약하게만 쓰이는 것

### 1. `prompts/`

현재 코드 경로에서 사용되지 않는다. 참고 문서 성격은 있지만 하네스 자동 흐름에는 들어가 있지 않다.

### 2. `scripts/execute.py`의 `--push`

CLI 옵션은 있지만 `Reserved for future push support` 상태다.

근거:

- [`scripts/execute.py:204`](../scripts/execute.py)

### 3. `StepExecutor._auto_push`

생성자에서 저장하지만 이후 사용되지 않는다.

근거:

- [`scripts/execute.py:27`](../scripts/execute.py)
- [`scripts/execute.py:36`](../scripts/execute.py)

### 4. `StepExecutor._run_git()`

정의만 있고 현재 실행 흐름에서 호출되지 않는다.

근거:

- [`scripts/execute.py:197`](../scripts/execute.py)

### 5. `StepExecutor._write_json()` / `_stamp()`

테스트나 향후 확장을 위한 준비는 되어 있지만 현재 main 실행 경로에서 쓰이지 않는다.

근거:

- [`scripts/execute.py:189`](../scripts/execute.py)
- [`scripts/execute.py:193`](../scripts/execute.py)

### 6. `context/index.json`의 `active`

현재 active phase가 [`1-ux-analytics-refactor`](../context/index.json)로 남아 있는데, 해당 phase도 이미 `completed` 상태다. 즉 "다음 작업으로 자연스럽게 이어지는 활성 상태"는 비어 있는 셈이다.

근거:

- [`context/index.json:2`](../context/index.json)
- [`context/index.json:10`](../context/index.json)
- [`phases/index.json:41`](../phases/index.json)

## 잘 구현된 점

### 1. 문서-상태-코드의 역할 분리가 명확하다

- `docs/`는 규칙
- `phases/`는 작업 단계
- `context/`는 세션 메모
- `.codex/`는 Codex 운영 설정

이 경계는 상당히 분명하다.

### 2. source of truth 설계가 있다

`phases/{task}/index.json`을 기준으로 보고, `phases/index.json`은 요약만 갖도록 잡아둔 건 맞는 방향이다.

### 3. TDD 압박이 실제 코드 상태와 어느 정도 맞는다

테스트 세트가 실제로 있고, 현재 `unit/ui/build`가 모두 통과한다.

### 4. 제품 코드도 문서와 크게 어긋나지 않는다

- 인증은 쿠키 기반 간단 세션
- 데이터는 mock storage 기반
- 달력/통계 계산은 service 계층으로 분리

즉 하네스 문서가 말하는 MVP 구조와 실제 구현이 대체로 일치한다.

## 고쳐야 할 점

### 우선순위 1. `execute.py`를 읽기 전용에서 동기화 도구로 올리기

지금 가장 큰 빈 곳이다. 현재 실행기는 구조 검증과 prompt 생성은 하지만, 하네스 운영에서 제일 귀찮고 실수 나기 쉬운 "상태 동기화"를 자동화하지 않는다.

추천:

- `mark-step-complete` 같은 명령 추가
- `phases/{task}/index.json` 갱신
- `phases/index.json` 동기화
- `context/{task}.json`의 `done`, `next`, `updated_at` 갱신 보조

### 우선순위 2. 새 phase 시작 규칙 정리

지금은 모든 phase가 완료됐는데 `context/index.json.active`는 마지막 완료 phase를 그대로 가리킨다. 다음 작업을 시작할 때 어떤 값을 어떻게 바꾸는지가 자동화돼 있지 않다.

추천:

- 새 phase 생성 스크립트 추가
- active phase가 completed면 경고 출력
- `context/index.json`과 `phases/index.json`을 함께 갱신

### 우선순위 3. `prompts/`의 역할을 결정

이 폴더는 지금 애매하다. 유지할 거면 "세션 부트스트랩 기록 보관소"로 명확히 정의하고, 아니면 `docs/retros/` 같은 더 설명적인 위치로 옮기는 편이 낫다.

### 우선순위 4. `.codex`와 런타임 개념 분리 문서화

현재 사용자가 헷갈릴 수 있는 지점은 `.codex`가 앱 기능의 일부처럼 보인다는 점이다. 실제로는 Codex 작업 보조 폴더다. README 첫 부분에 이 차이를 더 명확히 적는 게 좋다.

### 우선순위 5. 인코딩 표시 점검

파일 자체는 UTF-8로 저장된 것으로 보이지만, 일부 PowerShell 출력에서 한글이 깨져 보였다. 저장은 문제 없어 보이지만 터미널/코드페이지 차이 때문에 유지보수 시 혼란이 생길 수 있다.

추천:

- UTF-8 고정 원칙을 README에 한 줄 명시
- PowerShell에서 UTF-8 출력 설정 여부 점검

## 지금 기준으로 잘 구현됐는가

판정은 아래와 같다.

- 하네스 구조 설계: 좋음
- 하네스 자동화 완성도: 보통
- 문서와 코드 일치도: 좋음
- 다음 작업으로 이어지는 운영성: 보통 이하

즉, "설계는 잘 됐고 실제 앱도 안정적이지만, 하네스 자동화는 아직 반쯤 수동"이라고 보는 게 정확하다.

## 바로 다음 추천 작업

1. `scripts/execute.py`에 상태 갱신 명령 추가
2. 새 phase 생성 스크립트 추가
3. `README.md`에 `.codex`와 `prompts/`의 역할을 명확히 설명
4. 필요 없으면 `prompts/` 정리, 유지할 거면 목적 재정의

## 참고 파일

- [`AGENT.md`](../AGENT.md)
- [`scripts/execute.py`](../scripts/execute.py)
- [`scripts/test_execute.py`](../scripts/test_execute.py)
- [`phases/index.json`](../phases/index.json)
- [`context/index.json`](../context/index.json)
- [`docs/HARNESS_LOOP.md`](./HARNESS_LOOP.md)
- [`README.md`](../README.md)
