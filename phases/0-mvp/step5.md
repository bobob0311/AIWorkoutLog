# Step 5: polish-and-review

## 읽어야 할 파일
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /docs/UI_GUIDE.md
- /context/0-mvp.json
- /phases/0-mvp/index.json

## 테스트 먼저 작성할 항목
- 핵심 사용자 흐름 회귀 테스트
- 모바일 레이아웃 검증 테스트
- 잘못된 로그인 및 보호 페이지 접근 회귀 테스트

## 작업
- 주요 화면의 모바일 사용성을 정리한다.
- 누락된 회귀 테스트를 보강한다.
- 문서와 context, phase 상태를 최종 정리한다.
- 리뷰 기준으로 위험 요소를 다시 점검한다.

## Acceptance Criteria
```bash
npm run test:unit
npm run test:ui
npm run build
```

## 검증 절차
1. 회귀 테스트를 먼저 보강한다.
2. 테스트가 실패하는지 확인한 뒤 필요한 수정을 한다.
3. 위 명령을 실행한다.
4. 문서, context, phase 상태가 실제 구현과 일치하는지 확인한다.

## 금지사항
- 검증 없이 스타일만 손보고 끝내지 마라.
- 문서와 상태 파일 갱신을 생략하지 마라.

