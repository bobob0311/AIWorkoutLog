# Codex Harness Framework Port

이 저장소는 `jha0313/harness_framework`의 구조와 운영 방식을 Codex에서 사용하기 좋게 포팅한 템플릿입니다.

## 포함된 구조
- `AGENT.md`: 원형의 `CLAUDE.md` 역할을 Codex용으로 치환한 규칙 문서
- `.codex/commands`: `/harness`, `/review` 명령 문서
- `docs/`: PRD, ARCHITECTURE, ADR, UI_GUIDE
- `phases/`: step 실행 상태 저장소
- `context/`: 작업 추적과 이어받기 메모 저장소
- `scripts/execute.py`: phase 상태와 step 컨텍스트를 조합하는 실행기

## 기본 원칙
1. 원형 프레임워크의 문서와 phase 규칙을 최대한 유지합니다.
2. Claude 전용 이름과 흐름만 Codex 기준으로 바꿉니다.
3. `context/`는 원형에 없는 확장 기능으로, 작업 의도를 이어받기 위한 저장소입니다.

