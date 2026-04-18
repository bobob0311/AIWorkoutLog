# 프로젝트: 헬스 기록 웹사이트

이 파일은 Codex가 가장 먼저 읽는 최우선 규칙 문서다.

## 기술 스택
- Next.js App Router
- TypeScript
- Emotion
- Supabase
- Feature-Sliced Design

## 아키텍처 규칙
- CRITICAL: 모든 기능은 TDD로 진행하고, 실패하는 테스트를 먼저 작성한 뒤 구현한다.
- CRITICAL: 테스트 없이 UI나 데이터 로직을 먼저 만들지 않는다.
- CRITICAL: 버그 수정도 재현 테스트를 먼저 만든 뒤 수정한다.
- CRITICAL: 모든 사용자 데이터는 선택한 프로필 기준으로만 조회하고 수정한다.
- CRITICAL: 달력, 날짜 상세, 통계 화면은 같은 세트 데이터와 같은 볼륨 계산 규칙을 사용한다.
- FSD 레이어를 넘는 직접 참조를 하지 않는다.
- 운동 사전은 기본 운동 목록과 사용자 개인 운동 목록을 구분한다.
- 날짜 경계와 통계 집계는 한국 시간 기준으로 처리한다.

## 개발 프로세스
- CRITICAL: 구현 전 `docs/`, `phases/`, `context/`를 먼저 읽고 작업 맥락을 확인한다.
- CRITICAL: 각 step은 `테스트 작성 -> 실패 확인 -> 구현 -> 통과 확인 -> 리팩터링` 순서로 진행한다.
- CRITICAL: step 완료 시 `phases/{task}/index.json`과 `context/{task}.json`을 반드시 갱신한다.
- CRITICAL: `phases/{task}/index.json`이 source of truth이고, `phases/index.json`은 사람이 빠르게 보는 상위 요약 인덱스다.
- CRITICAL: 하위 phase step 상태가 바뀌면 `phases/index.json`의 해당 phase `steps[].status`도 함께 동기화한다.
- 커밋 메시지는 conventional commits 형식을 따른다.

## 명령어
```bash
npm run lint
npm run build
npm run test:unit
npm run test:ui
npm run test:e2e
npm run test
```
