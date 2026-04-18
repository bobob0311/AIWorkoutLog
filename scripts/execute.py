#!/usr/bin/env python3
"""
Harness Step Executor - Codex 포팅 버전

원형 harness_framework의 phase 실행기 구조를 유지하되,
v1에서는 자동 에이전트 호출보다 상태 검증과 프롬프트 조립에 집중한다.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).resolve().parent.parent


class StepExecutor:
    TZ = timezone(timedelta(hours=9))
    STEP_STATUSES = {"pending", "in_progress", "completed", "blocked", "error"}
    PHASE_STATUSES = {"pending", "in_progress", "completed", "blocked", "error"}

    def __init__(self, phase_dir_name: str, *, auto_push: bool = False):
        self._root = ROOT
        self._phase_dir_name = phase_dir_name
        self._phases_dir = ROOT / "phases"
        self._context_dir = ROOT / "context"
        self._phase_dir = self._phases_dir / phase_dir_name
        self._index_file = self._phase_dir / "index.json"
        self._top_index_file = self._phases_dir / "index.json"
        self._context_file = self._context_dir / f"{phase_dir_name}.json"
        self._auto_push = auto_push

        if not self._phase_dir.is_dir():
            print(f"ERROR: {self._phase_dir} not found")
            sys.exit(1)
        if not self._index_file.exists():
            print(f"ERROR: {self._index_file} not found")
            sys.exit(1)
        if not self._context_file.exists():
            print(f"ERROR: {self._context_file} not found")
            sys.exit(1)

        index = self._read_json(self._index_file)
        self._project = index.get("project", "project")
        self._phase_name = index.get("phase", phase_dir_name)
        self._total = len(index.get("steps", []))

    def run(self, *, dry_run: bool = False):
        self._validate_structure()
        if dry_run:
            print(f"구조 검증 완료: {self._phase_dir_name}")
            return
        payload = self.build_execution_payload()
        self._print_payload(payload)

    def build_execution_payload(self) -> dict:
        index = self._read_json(self._index_file)
        context = self._read_json(self._context_file)
        current = self._find_current_step(index)
        step_context = self._build_step_context(index)
        prompt = self._build_prompt(index, context, current, step_context)

        return {
            "phase": self._phase_name,
            "project": self._project,
            "context_title": context.get("title", ""),
            "current_step": current,
            "step_context": step_context,
            "prompt": prompt,
            "next": context.get("next", []),
        }

    def _validate_structure(self):
        required = [
            ROOT / "AGENT.md",
            ROOT / "docs" / "PRD.md",
            ROOT / "docs" / "ARCHITECTURE.md",
            ROOT / "docs" / "ADR.md",
            ROOT / "docs" / "UI_GUIDE.md",
            ROOT / "phases" / "index.json",
            ROOT / "context" / "index.json",
            self._index_file,
            self._context_file,
        ]
        missing = [str(path.relative_to(ROOT)) for path in required if not path.exists()]
        if missing:
            print("ERROR: required files are missing", file=sys.stderr)
            for item in missing:
                print(f"- {item}", file=sys.stderr)
            sys.exit(1)

        top = self._read_json(self._top_index_file)
        for phase in top.get("phases", []):
            status = phase.get("status")
            if status not in self.PHASE_STATUSES:
                print(f"ERROR: invalid phase status: {status}", file=sys.stderr)
                sys.exit(1)

        index = self._read_json(self._index_file)
        for step in index.get("steps", []):
            status = step.get("status")
            if status not in self.STEP_STATUSES:
                print(f"ERROR: invalid step status: {status}", file=sys.stderr)
                sys.exit(1)

    def _print_payload(self, payload: dict):
        current = payload["current_step"]
        print(f"[project] {payload['project']}")
        print(f"[phase] {payload['phase']}")
        print(f"[context] {payload['context_title']}")
        print()
        if current:
            print("[current-step]")
            print(f"- step: {current['step']}")
            print(f"- name: {current['name']}")
            print(f"- status: {current['status']}")
            print(f"- file: {self._phase_dir / f'step{current['step']}.md'}")
        else:
            print("[current-step]")
            print("- 모든 step이 완료되었습니다.")
        print()
        print("[next]")
        for item in payload["next"]:
            print(f"- {item}")

    def _build_prompt(self, index: dict, context: dict, current: Optional[dict], step_context: str) -> str:
        step_file = ""
        step_body = ""
        if current:
            step_file = str(self._phase_dir / f"step{current['step']}.md")
            step_body = (self._phase_dir / f"step{current['step']}.md").read_text(encoding="utf-8")

        return (
            f"당신은 {self._project} 프로젝트를 진행하는 Codex다.\n\n"
            f"{self._load_guardrails()}\n\n"
            f"## 작업 컨텍스트\n"
            f"- title: {context.get('title', '')}\n"
            f"- as-is: {context.get('as_is', [])}\n"
            f"- to-be: {context.get('to_be', [])}\n"
            f"- done: {context.get('done', [])}\n"
            f"- next: {context.get('next', [])}\n\n"
            f"{step_context}"
            f"## 현재 step 파일\n"
            f"{step_file}\n\n"
            f"{step_body}"
        )

    def _load_guardrails(self) -> str:
        sections = []
        agent_md = ROOT / "AGENT.md"
        if agent_md.exists():
            sections.append(f"## 프로젝트 규칙 (AGENT.md)\n\n{agent_md.read_text(encoding='utf-8')}")
        docs_dir = ROOT / "docs"
        if docs_dir.is_dir():
            for doc in sorted(docs_dir.glob("*.md")):
                sections.append(f"## {doc.stem}\n\n{doc.read_text(encoding='utf-8')}")
        return "\n\n---\n\n".join(sections)

    @staticmethod
    def _build_step_context(index: dict) -> str:
        lines = [
            f"- Step {step['step']} ({step['name']}): {step['summary']}"
            for step in index.get("steps", [])
            if step.get("status") == "completed" and step.get("summary")
        ]
        if not lines:
            return ""
        return "## 이전 Step 산출물\n\n" + "\n".join(lines) + "\n\n"

    @staticmethod
    def _find_current_step(index: dict) -> Optional[dict]:
        for step in index.get("steps", []):
            if step.get("status") == "in_progress":
                return step
        for step in index.get("steps", []):
            if step.get("status") == "pending":
                return step
        return None

    @staticmethod
    def _read_json(path: Path) -> dict:
        return json.loads(path.read_text(encoding="utf-8"))

    @staticmethod
    def _write_json(path: Path, data: dict):
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

    @classmethod
    def _stamp(cls) -> str:
        return datetime.now(cls.TZ).strftime("%Y-%m-%dT%H:%M:%S%z")

    def _run_git(self, *args) -> subprocess.CompletedProcess:
        return subprocess.run(["git", *args], cwd=self._root, capture_output=True, text=True)


def main():
    parser = argparse.ArgumentParser(description="Codex Harness Step Executor")
    parser.add_argument("phase_dir", help="Phase directory name (e.g. 0-mvp)")
    parser.add_argument("--push", action="store_true", help="Reserved for future push support")
    parser.add_argument("--dry-run", action="store_true", help="Validate structure only")
    args = parser.parse_args()

    StepExecutor(args.phase_dir, auto_push=args.push).run(dry_run=args.dry_run)


if __name__ == "__main__":
    main()

