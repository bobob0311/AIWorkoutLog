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

# C:\Users\samsung\Desktop\harness
# 최상위를 잡아서 나머지 파일을 접근할 수 있는 기준이 될 수 있도록
ROOT = Path(__file__).resolve().parent.parent
print("실행실행실행실행")


class StepExecutor:
    TZ = timezone(timedelta(hours=9))
    STEP_STATUSES = {"pending", "in_progress", "completed", "blocked", "error"}
    PHASE_STATUSES = {"pending", "in_progress", "completed", "blocked", "error"}
    
    # *뒤에 인자들은 다 이름으로 전달하게 만드는것

    def __init__(self, phase_dir_name: str, *, auto_push: bool = False):
        # 아래는 ROOT를 기준으로 읽어야하는 파일들을 변수명으로 받아두기 
        self._root = ROOT
        self._phase_dir_name = phase_dir_name

        self._phases_dir = ROOT / "phases"
        self._context_dir = ROOT / "context"
        self._phase_dir = self._phases_dir / phase_dir_name
        self._index_file = self._phase_dir / "index.json"

        self._top_index_file = self._phases_dir / "index.json"
        self._context_file = self._context_dir / f"{phase_dir_name}.json"
        
        # 쓰는 부분이 없는거같은데요
        self._auto_push = auto_push

        # 실행 전에 필수 상태가 있는지 확인하는 과정 dir, file등 읽어서 context를 구성할 수 있는가?
        # 잘못된 상태로 추측해서 일을 할 수 없게 만드는 과정
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

        print("[harness] codex 실행 시작")
        result = subprocess.run(
            ["codex.cmd", "exec", "-"],
            cwd=self._root,
            input=payload["prompt"],
            text=True,
            encoding="utf-8",
        )

        print("[harness] codex 실행 종료")
        print(f"[harness] returncode={result.returncode}")

        if result.returncode != 0:
            print(result.stderr, file=sys.stderr)
            sys.exit(result.returncode)

        print(result.stdout)

    def complete_current_step(self, *, summary: str, next_items: list[str] | None = None):
        self._validate_structure()
        index = self._read_json(self._index_file)
        context = self._read_json(self._context_file)
        current = self._find_current_step(index)

        if not current:
            print("ERROR: no pending or in-progress step found", file=sys.stderr)
            sys.exit(1)

        now = self._stamp()
        next_items = next_items or []

        for step in index.get("steps", []):
            if step.get("step") == current["step"]:
                step["status"] = "completed"
                step["summary"] = summary
                step["completed_at"] = now
            elif step.get("step") == current["step"] + 1 and step.get("status") == "pending":
                step["status"] = "in_progress"

        remaining = [step for step in index.get("steps", []) if step.get("status") != "completed"]
        phase_completed = len(remaining) == 0
        if phase_completed:
            context["status"] = "completed"
        else:
            context["status"] = "in_progress"

        done_items = context.get("done", [])
        if summary not in done_items:
            done_items.append(summary)
        context["done"] = done_items
        context["next"] = next_items
        context["updated_at"] = now

        self._write_json(self._index_file, index)
        self._write_json(self._context_file, context)
        self._sync_top_index_from_phase(index)
        self._sync_context_index(status=context["status"], set_active=not phase_completed)

        print(f"completed step {current['step']} in {self._phase_dir_name}")
        if phase_completed:
            print(f"phase completed: {self._phase_dir_name}")

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

    # 파일 구조 장애나 상태 데이터 장애를 방지하여 원하는 파일에 내용을 넣고 상태를 갱신할 수 있는지
    def _validate_structure(self):
        # 필수로 필요하다고 생각하는 파일 넣어서 없을 때 확인할 수 있도록
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
        # 캐싱해서 사용할 수 있는 구조로 만들자.
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

    def _sync_top_index_from_phase(self, phase_index: dict):
        top = self._read_json(self._top_index_file)
        phase_steps = phase_index.get("steps", [])
        phase_status = self._derive_phase_status(phase_steps)
        phase_dir = self._phase_dir_name

        for phase in top.get("phases", []):
            if phase.get("dir") != phase_dir:
                continue
            phase["status"] = phase_status
            phase["steps"] = [
                {
                    "step": step["step"],
                    "name": step["name"],
                    "status": step["status"],
                }
                for step in phase_steps
            ]
            self._write_json(self._top_index_file, top)
            return

        print(f"ERROR: phase {phase_dir} not found in top index", file=sys.stderr)
        sys.exit(1)

    def _sync_context_index(self, *, status: str, set_active: bool):
        context_index_path = self._context_dir / "index.json"
        data = self._read_json(context_index_path)
        found = False
        for item in data.get("items", []):
            if item.get("phase") == self._phase_dir_name:
                item["status"] = status
                found = True
                break
        if not found:
            print(f"ERROR: phase {self._phase_dir_name} not found in context index", file=sys.stderr)
            sys.exit(1)

        if set_active:
            data["active"] = self._phase_dir_name
        elif data.get("active") == self._phase_dir_name:
            data["active"] = None

        self._write_json(context_index_path, data)

    @staticmethod
    def _derive_phase_status(steps: list[dict]) -> str:
        statuses = [step.get("status") for step in steps]
        if statuses and all(status == "completed" for status in statuses):
            return "completed"
        if any(status == "error" for status in statuses):
            return "error"
        if any(status == "blocked" for status in statuses):
            return "blocked"
        if any(status == "in_progress" for status in statuses):
            return "in_progress"
        return "pending"

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
    # 인자들을 받아서 그에 따른 분기 처리하는 핵심 메인 로직이네 
    # CLI 인자 받기
    parser = argparse.ArgumentParser(description="Codex Harness Step Executor")
    # 
    parser.add_argument("phase_dir", help="Phase directory name (e.g. 0-mvp)")
    parser.add_argument("--push", action="store_true", help="Reserved for future push support")
    parser.add_argument("--dry-run", action="store_true", help="Validate structure only")
    # 진짜 실행은 하지 말고, 실행 가능한지만 검사해봐라
    parser.add_argument("--complete", action="store_true", help="Mark the current step as completed")
    parser.add_argument("--summary", help="Completion summary for the current step")
    parser.add_argument("--next", action="append", default=[], help="Next item to store in context; repeatable")
    
    # 사용자가 터미널에 입력한 내용을 읽어서 정리
    args = parser.parse_args()

    executor = StepExecutor(args.phase_dir, auto_push=args.push)
    if args.complete:
        if not args.summary:
            parser.error("--summary is required when using --complete")
        executor.complete_current_step(summary=args.summary, next_items=args.next)
        return
    executor.run(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
