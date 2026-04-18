# Step 0: project-definition

## 읽어야 할 파일
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /docs/UI_GUIDE.md
- /context/0-mvp.json

## 테스트 먼저 작성할 항목
- 하네스 문서에 TDD 원칙이 명시되었는지 검증하는 체크리스트
- 제품 문서에 로그인, 달력, 날짜 기록, 통계 요구사항이 빠짐없이 반영되었는지 검증하는 체크리스트

## 작업
- 헬스 기록 웹사이트의 실제 요구사항을 AGENT, PRD, ARCHITECTURE, ADR, UI_GUIDE에 반영한다.
- 모든 문서가 TDD를 전제로 작성되도록 정리한다.

## Acceptance Criteria
```bash
python scripts/execute.py 0-mvp --dry-run
```

## 검증 절차
1. 문서 변경 전 체크리스트 기준으로 누락 항목을 찾는다.
2. 문서를 갱신한다.
3. 위 명령을 실행한다.
4. 변경된 문서가 제품 요구사항과 TDD 원칙을 반영하는지 확인한다.

## 금지사항
- 구현 세부 코드를 먼저 만들지 마라. 이 step은 문서와 규칙 고정이 목적이다.
