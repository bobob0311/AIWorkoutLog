# Step 4: korean-copy-and-test-cleanup

## Read Before Work
- /AGENT.md
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/ADR.md
- /context/3-analytics-refactor-and-date-baseline.json

## Test First
- 테스트 설명과 사용자 문구가 한글 기준으로 검증되도록 확인한다.

## Work
- 새로 추가하거나 수정한 문서, 테스트 설명, 사용자 노출 문구를 한글로 정리한다.
- 코드 식별자와 타입명은 영어를 유지한다.
- 깨진 문구가 새로 생기지 않았는지 검색한다.

## Acceptance Criteria
```bash
npm run lint
npm run test:unit
npm run test:ui
npm run build
```

## Notes
- 기존 대규모 문서 전체 정리는 별도 phase로 남긴다.
