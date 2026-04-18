이 프로젝트는 Harness 프레임워크를 Codex용으로 포팅한 구조를 사용한다. 아래 워크플로우에 따라 작업을 진행한다.

---

## 워크플로우
### A. 탐색

`/AGENT.md`, `/docs/`, `/phases/`, `/context/`를 읽고 프로젝트 규칙, 기획, 아키텍처, 단계 의도, 현재 작업 상태를 파악한다.

기본 읽기 순서:

1. `/AGENT.md`
2. `/docs/PRD.md`
3. `/docs/ARCHITECTURE.md`
4. `/docs/ADR.md`
5. `/docs/UI_GUIDE.md`
6. `/phases/index.json`
7. `/context/index.json`
8. active task의 `/phases/{task-name}/index.json`
9. active task의 `/context/{task-name}.json`

### B. 협의

구현을 위해 구체화하거나 기술적으로 결정해야 할 사항이 있으면 사용자에게 제시하고 협의한다.

### C. Step 설계

사용자가 구현 계획 작성을 지시하면 여러 step으로 나눈 초안을 작성하고 피드백을 요청한다.

설계 원칙:

1. Scope 최소화: 한 step에서는 하나의 레이어나 하나의 모듈만 다룬다.
2. 자기완결성: 각 step 파일은 독립된 Codex 세션에서도 이해 가능해야 한다.
3. 사전 준비 강제: 관련 문서 경로와 이전 step에서 생성 또는 수정된 파일 경로를 명시한다.
4. 추상 규칙 금지: 인터페이스나 전달 규칙만 제시하고 구현은 에이전트가 하도록 둔다.
5. AC는 실행 가능한 커맨드로 쓴다.
6. 주의사항은 `"X를 하지 말라. 이유: Y"` 형식으로 구체적으로 적는다.
7. step name은 kebab-case slug를 사용한다.
8. TDD 우선: 모든 step은 테스트를 먼저 작성하고 실패를 확인한 뒤 최소 구현으로 통과시키고 마지막에 리팩터링한다.

### D. 파일 생성

사용자가 확인하면 아래 파일들을 생성한다.

#### D-1. `phases/index.json`

```json
{
  "phases": [
    {
      "dir": "0-mvp",
      "status": "pending",
      "steps": [
        { "step": 0, "name": "project-definition", "status": "pending" }
      ]
    }
  ]
}
```

- `dir`: task 디렉터리명
- `status`: `"pending"` | `"in_progress"` | `"completed"` | `"error"` | `"blocked"`
- `steps`: 상위 인덱스에서 빠르게 상태를 보기 위한 요약 목록

규칙:
- `phases/{task-name}/index.json`이 source of truth다.
- `phases/index.json`은 사람이 빠르게 보는 상위 요약 인덱스다.
- 하위 phase의 step 상태가 바뀌면 상위 `phases/index.json`의 해당 phase `steps[].status`도 반드시 함께 동기화한다.

#### D-2. `phases/{task-name}/index.json`

```json
{
  "project": "<프로젝트명>",
  "phase": "<task-name>",
  "steps": [
    { "step": 0, "name": "project-setup", "status": "pending" },
    { "step": 1, "name": "core-types", "status": "pending" }
  ]
}
```

상태 메타데이터 기록 필드:

- `completed` -> `completed_at`, `summary`
- `error` -> `failed_at`, `error_message`
- `blocked` -> `blocked_at`, `blocked_reason`

#### D-3. `phases/{task-name}/step{N}.md`

```markdown
# Step {N}: {이름}

## 읽어야 할 파일
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/{task-name}.json
- {이전 step에서 생성/수정한 파일}

## 테스트 먼저 작성할 항목
{실패하는 테스트로 먼저 고정할 요구사항 목록}

## 작업
{구체적인 구현 지시}

## Acceptance Criteria
```bash
npm run test:unit
npm run test:ui
npm run build
npm run test
```

## 검증 절차
1. 테스트를 먼저 작성하고 실패를 확인한다.
2. 최소 구현으로 테스트를 통과시킨다.
3. AC 커맨드를 실행한다.
4. 결과에 따라 `phases/{task-name}/index.json`을 갱신한다.
5. 같은 결과를 `context/{task-name}.json`의 `done`, `next`, `updated_at`에도 반영한다.
6. step 상태가 바뀌면 `phases/index.json`의 해당 phase `steps[].status`도 함께 갱신한다.

## 금지사항
- {하지 말아야 할 것}
```

### E. 실행

```bash
python scripts/execute.py {task-name}
python scripts/execute.py {task-name} --push
python scripts/execute.py {task-name} --dry-run
```

`execute.py`가 하는 일:

- `AGENT.md + docs/*.md` 가드레일 수집
- 완료된 step의 `summary`를 다음 step 컨텍스트로 누적
- 현재 step과 `context/{task-name}.json` 요약
- phase 구조와 상태 검증
- step 문서가 TDD 순서를 따르는지 확인
