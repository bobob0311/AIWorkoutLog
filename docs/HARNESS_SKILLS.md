# Harness Skills

## 목적

이 문서는 이 저장소에서 Codex용 `SKILL.md`를 어떻게 관리할지 정리한다.

핵심 원칙:

- 스킬 원본은 저장소 안의 `skills/` 아래에서 관리한다.
- 각 스킬은 독립 폴더를 가진다.
- 실제 Codex 자동 발견은 `$CODEX_HOME/skills` 또는 `~/.codex/skills` 기준이다.
- 이 저장소의 `skills/`는 소스 오브 트루스로 쓰고, 필요하면 전역 skills 디렉터리로 복사하거나 링크한다.

## 추천 폴더 구조

```text
harness/
├─ skills/
│  ├─ harness-workflow/
│  │  ├─ SKILL.md
│  │  ├─ agents/
│  │  │  └─ openai.yaml
│  │  ├─ references/
│  │  │  ├─ phase-state.md
│  │  │  └─ commands.md
│  │  └─ scripts/
│  │     └─ sync_example.py
│  └─ harness-review/
│     ├─ SKILL.md
│     └─ agents/
│        └─ openai.yaml
├─ docs/
├─ phases/
├─ context/
└─ .codex/
```

## 왜 `skills/` 루트로 두는가

- `.codex/`는 Codex workspace 설정과 slash command 성격이 강하다.
- `skills/`는 재사용 가능한 작업 능력 묶음이므로 repo 최상단의 별도 개념으로 두는 편이 더 명확하다.
- 하네스 문서, phase, context와 나란히 보이기 때문에 유지보수가 쉽다.

## 스킬 폴더 규칙

### 필수

- `SKILL.md`

### 권장

- `agents/openai.yaml`

### 필요할 때만 추가

- `references/`
- `scripts/`
- `assets/`

불필요한 `README.md`, `CHANGELOG.md`, `INSTALLATION_GUIDE.md`는 스킬 폴더 안에 만들지 않는다.

## `SKILL.md` 형식

반드시 아래 구조를 따른다.

```md
---
name: harness-workflow
description: Use when Codex needs to operate this repository's harness workflow, including reading AGENT.md, docs, phases, and context files, deciding the current step, updating phase status, and keeping context in sync across implementation work.
---

# Harness Workflow

## Start

Read `AGENT.md`, `docs/*.md`, `phases/index.json`, `context/index.json`, and the active phase files.

## Execute

- Treat `phases/{task}/index.json` as the source of truth.
- Use `context/{task}.json` for carry-over notes only.
- Keep `phases/index.json` synchronized with the phase index.

## References

- For file roles and repository policy, read `references/phase-state.md`.
- For command usage, read `references/commands.md`.
```

## frontmatter 규칙

- `name`
  - 소문자, 숫자, 하이픈만 사용
  - 폴더명과 동일하게 맞춘다
- `description`
  - 이 스킬이 무엇을 하는지
  - 언제 트리거되어야 하는지
  - 어떤 작업에 써야 하는지
  - 이 정보를 body가 아니라 frontmatter에 넣는다

## body 작성 규칙

- 설명보다 절차를 쓴다
- 가능하면 imperative form으로 쓴다
- 길어지면 세부 내용은 `references/`로 분리한다
- SKILL.md에는 핵심 workflow만 넣는다

## 이 저장소에서 추천하는 스킬 분리 기준

### 1. `harness-workflow`

용도:

- phase/context 기반 작업 루프
- 현재 active phase 확인
- step 완료 후 상태 파일 동기화

### 2. `harness-review`

용도:

- 이 저장소 규칙 기준 코드 리뷰
- 문서와 구현 불일치 검토
- phase/context 누락 점검

### 3. `harness-phase-planning`

용도:

- 새 phase 설계
- step 분해
- `phases/index.json`, `context/index.json` 반영 기준 정리

## auto-discovery 운영 방식

Codex가 자동으로 찾게 하려면 최종적으로 스킬 폴더를 아래 위치 중 하나에 둔다.

- `$CODEX_HOME/skills/<skill-name>`
- `~/.codex/skills/<skill-name>`

이 저장소를 소스 오브 트루스로 쓸 경우 운영 방식은 보통 둘 중 하나다.

1. repo의 `skills/`를 유지하고 필요할 때 전역 skills로 복사
2. 전역 skills 위치로 심볼릭 링크 연결

## 이 저장소 권장안

가장 실용적인 기준은 아래다.

1. repo 안에는 `skills/` 폴더를 둔다
2. 하네스 관련 스킬은 repo에서 버전 관리한다
3. 실제 Codex 자동 발견이 필요하면 나중에 `~/.codex/skills`로 복사 또는 링크한다

이렇게 하면 하네스 문서, phase 구조, 스킬 규칙을 한 저장소에서 같이 진화시킬 수 있다.
