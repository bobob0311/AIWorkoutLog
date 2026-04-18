# Step 1: test-foundation-and-auth-gate

## 읽어야 할 파일
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /docs/UI_GUIDE.md
- /phases/0-mvp/index.json
- /context/0-mvp.json

## 테스트 먼저 작성할 항목
- 테스트 러너와 테스트 명령이 정상 동작하는지 검증하는 기본 테스트
- 프로필 선택 UI 렌더링 실패 테스트
- 비밀번호 입력 후 성공 진입 실패 테스트
- 잘못된 비밀번호 입력 시 실패 메시지 테스트
- 로그인하지 않으면 보호 페이지 접근이 막히는 테스트

## 작업
- Vitest, Testing Library, Playwright 기준의 테스트 러너 구조를 잡는다.
- 프로필 선택 + 비밀번호 로그인 흐름을 구현한다.
- 보호 페이지 접근 제어의 최소 구조를 만든다.

## Acceptance Criteria
```bash
npm run test:unit
npm run test:ui
npm run build
```

## 검증 절차
1. 로그인 관련 실패 테스트를 먼저 작성한다.
2. 테스트가 실패하는지 확인한다.
3. 최소 구현으로 테스트를 통과시킨다.
4. 위 명령을 실행한다.
5. 보호 페이지 접근과 로그인 흐름이 문서와 일치하는지 확인한다.

## 금지사항
- 테스트를 작성하지 않고 로그인 UI부터 만들지 마라.
- 이메일 기반 인증 흐름으로 범위를 키우지 마라.
