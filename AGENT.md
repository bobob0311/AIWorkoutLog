# 프로젝트: 헬스 기록 웹사이트

이 문서는 Codex가 작업 전에 가장 먼저 읽는 최우선 규칙 문서다.
다른 문서와 충돌하면 이 문서를 우선한다.

## 목표
- 사용자가 선택한 프로필 기준으로 운동 기록을 정확하게 조회, 입력, 수정할 수 있어야 한다.
- 달력, 날짜 상세, 통계 화면은 동일한 데이터 기준과 동일한 볼륨 계산 규칙을 사용해야 한다.
- 날짜 경계와 통계 집계는 한국 시간 기준으로 일관되게 처리해야 한다.

## 기술 스택
- Next.js App Router
- TypeScript
- Emotion
- Supabase
- Feature-Sliced Design

## 핵심 규칙
- CRITICAL: 모든 기능 개발은 TDD로 진행한다.
- CRITICAL: `테스트 작성 -> 실패 확인 -> 구현 -> 통과 확인 -> 리팩터링` 순서를 반드시 지킨다.
- CRITICAL: 테스트 없이 UI나 데이터 로직을 먼저 만들지 않는다.
- CRITICAL: 버그 수정도 재현 테스트를 먼저 만든 뒤 수정한다.
- CRITICAL: 모든 사용자 데이터 조회와 수정은 반드시 현재 선택된 프로필 기준으로만 처리한다.
- CRITICAL: 달력, 날짜 상세, 통계 화면은 같은 세트 데이터와 같은 계산 규칙을 공유해야 한다.
- CRITICAL: 작업 전에 `docs/`, `phases/`, `context/`를 읽고 현재 맥락과 진행 상태를 확인한다.
- CRITICAL: step 완료 시 `phases/{task}/index.json`과 `context/{task}.json`을 반드시 갱신한다.
- CRITICAL: `phases/{task}/index.json`을 source of truth로 사용한다.
- CRITICAL: 하위 step 상태가 바뀌면 `phases/index.json`의 해당 phase 요약 상태도 함께 동기화한다.

## 아키텍처 규칙
- FSD 레이어 경계를 넘는 직접 참조를 하지 않는다.
- 공용 로직은 중복 구현하지 말고 재사용 가능한 계층으로 올린다.
- 운동 사전은 기본 운동 목록과 사용자 개인 운동 목록을 명확히 구분한다.
- 시간, 날짜, 볼륨 계산 규칙은 화면별로 따로 만들지 않는다.

## 작업 종료 기준
- 관련 테스트가 모두 통과해야 한다.
- 문서와 컨텍스트 파일이 현재 구현 상태와 맞아야 한다.
- 새 규칙이나 예외가 생기면 해당 내용을 `docs/` 또는 관련 컨텍스트에 반영해야 한다.
- 커밋 메시지는 Conventional Commits 형식을 따른다.

## 기본 명령어
```bash
npm run lint
npm run build
npm run test:unit
npm run test:ui
npm run test:e2e
npm run test
```
