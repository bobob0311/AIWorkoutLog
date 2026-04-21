#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TZ = timezone(timedelta(hours=9))


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict):
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def stamp() -> str:
    return datetime.now(TZ).strftime("%Y-%m-%dT%H:%M:%S%z")


def build_step_markdown(step_number: int, name: str) -> str:
    return "\n".join(
        [
            f"# Step {step_number}: {name}",
            "",
            "## Read Before Work",
            "- /AGENT.md",
            "- /docs/PRD.md",
            "- /docs/ARCHITECTURE.md",
            "- /docs/ADR.md",
            f"- /context/{{phase}}.json",
            "",
            "## Test First",
            "- Add or update the failing tests for this step before implementation.",
            "",
            "## Work",
            "- Implement only the scope required for this step.",
            "",
            "## Acceptance Criteria",
            "```bash",
            "npm run lint",
            "npm run test:unit",
            "npm run test:ui",
            "npm run build",
            "```",
            "",
            "## Notes",
            "- Update phase/context status files when this step is done.",
            "",
        ]
    )


def create_phase(*, phase_dir: str, project: str, goal: str, title: str, step_names: list[str]):
    if not step_names:
        print("ERROR: at least one --step is required", file=sys.stderr)
        sys.exit(1)

    phase_root = ROOT / "phases" / phase_dir
    context_file = ROOT / "context" / f"{phase_dir}.json"
    top_index_file = ROOT / "phases" / "index.json"
    context_index_file = ROOT / "context" / "index.json"

    if phase_root.exists() or context_file.exists():
        print(f"ERROR: phase already exists: {phase_dir}", file=sys.stderr)
        sys.exit(1)

    top_index = read_json(top_index_file)
    context_index = read_json(context_index_file)
    if any(item.get("dir") == phase_dir for item in top_index.get("phases", [])):
        print(f"ERROR: phase already exists in phases/index.json: {phase_dir}", file=sys.stderr)
        sys.exit(1)
    if any(item.get("phase") == phase_dir for item in context_index.get("items", [])):
        print(f"ERROR: phase already exists in context/index.json: {phase_dir}", file=sys.stderr)
        sys.exit(1)

    phase_root.mkdir()
    steps = []
    for number, name in enumerate(step_names):
        step_status = "in_progress" if number == 0 else "pending"
        steps.append({"step": number, "name": name, "status": step_status})
        step_body = build_step_markdown(number, name).replace("{phase}", phase_dir)
        (phase_root / f"step{number}.md").write_text(step_body, encoding="utf-8")

    phase_index = {
        "project": project,
        "phase": phase_dir,
        "goal": goal,
        "steps": steps,
    }
    write_json(phase_root / "index.json", phase_index)

    context = {
        "phase": phase_dir,
        "title": title,
        "status": "in_progress",
        "as_is": [],
        "to_be": [],
        "done": [],
        "next": [f"Complete step 0: {step_names[0]}"],
        "decisions": [],
        "risks": [],
        "updated_at": stamp(),
    }
    write_json(context_file, context)

    top_index.setdefault("phases", []).append(
        {
            "dir": phase_dir,
            "status": "in_progress",
            "steps": [{"step": step["step"], "name": step["name"], "status": step["status"]} for step in steps],
        }
    )
    write_json(top_index_file, top_index)

    context_index["active"] = phase_dir
    context_index.setdefault("items", []).append(
        {
            "phase": phase_dir,
            "file": f"context/{phase_dir}.json",
            "status": "in_progress",
        }
    )
    write_json(context_index_file, context_index)

    print(f"created phase: {phase_dir}")


def main():
    parser = argparse.ArgumentParser(description="Create a new harness phase")
    parser.add_argument("phase_dir", help="Phase directory name, e.g. 2-supabase-integration")
    parser.add_argument("--project", required=True, help="Project name")
    parser.add_argument("--goal", required=True, help="High-level goal for the phase")
    parser.add_argument("--title", required=True, help="Context title")
    parser.add_argument("--step", action="append", dest="steps", default=[], help="Step name; repeatable")
    args = parser.parse_args()

    create_phase(
        phase_dir=args.phase_dir,
        project=args.project,
        goal=args.goal,
        title=args.title,
        step_names=args.steps,
    )


if __name__ == "__main__":
    main()
