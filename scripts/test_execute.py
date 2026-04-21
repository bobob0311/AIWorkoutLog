import json
import sys
from pathlib import Path
from unittest.mock import patch

import pytest

sys.path.insert(0, str(Path(__file__).parent))
import execute as ex


@pytest.fixture
def tmp_project(tmp_path):
    (tmp_path / "docs").mkdir()
    (tmp_path / "phases").mkdir()
    (tmp_path / "context").mkdir()
    (tmp_path / "AGENT.md").write_text("# agent", encoding="utf-8")
    (tmp_path / "docs" / "PRD.md").write_text("# prd", encoding="utf-8")
    (tmp_path / "docs" / "ARCHITECTURE.md").write_text("# architecture", encoding="utf-8")
    (tmp_path / "docs" / "ADR.md").write_text("# adr", encoding="utf-8")
    (tmp_path / "docs" / "UI_GUIDE.md").write_text("# ui", encoding="utf-8")
    return tmp_path


@pytest.fixture
def phase_files(tmp_project):
    (tmp_project / "phases" / "index.json").write_text(
        json.dumps(
            {
                "phases": [
                    {
                        "dir": "0-mvp",
                        "status": "pending",
                        "steps": [
                            {"step": 0, "name": "setup", "status": "completed"},
                            {"step": 1, "name": "core", "status": "pending"},
                        ],
                    }
                ]
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    (tmp_project / "context" / "index.json").write_text(
        json.dumps(
            {
                "active": "0-mvp",
                "items": [{"phase": "0-mvp", "file": "context/0-mvp.json", "status": "in_progress"}],
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    phase_dir = tmp_project / "phases" / "0-mvp"
    phase_dir.mkdir()
    (phase_dir / "index.json").write_text(
        json.dumps(
            {
                "project": "TestProject",
                "phase": "0-mvp",
                "steps": [
                    {"step": 0, "name": "setup", "status": "completed", "summary": "setup done"},
                    {"step": 1, "name": "core", "status": "pending"},
                ],
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    (phase_dir / "step1.md").write_text("# Step 1\n\nDo work", encoding="utf-8")
    (tmp_project / "context" / "0-mvp.json").write_text(
        json.dumps(
            {
                "phase": "0-mvp",
                "title": "context title",
                "status": "in_progress",
                "as_is": ["a"],
                "to_be": ["b"],
                "done": ["c"],
                "next": ["d"],
                "decisions": [],
                "risks": [],
                "updated_at": "2026-04-17T18:05:00+09:00",
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    return phase_dir


@pytest.fixture
def executor(tmp_project, phase_files):
    with patch.object(ex, "ROOT", tmp_project):
        inst = ex.StepExecutor("0-mvp")
    inst._root = tmp_project
    inst._phases_dir = tmp_project / "phases"
    inst._context_dir = tmp_project / "context"
    inst._phase_dir = tmp_project / "phases" / "0-mvp"
    inst._index_file = inst._phase_dir / "index.json"
    inst._top_index_file = tmp_project / "phases" / "index.json"
    inst._context_file = tmp_project / "context" / "0-mvp.json"
    return inst


def test_stamp_has_kst_offset(executor):
    assert "+0900" in executor._stamp()


def test_load_guardrails_reads_agent_and_docs(executor):
    data = executor._load_guardrails()
    assert "AGENT.md" in data
    assert "PRD" in data
    assert "ARCHITECTURE" in data


def test_build_step_context_uses_completed_summary():
    index = {
        "steps": [
            {"step": 0, "name": "setup", "status": "completed", "summary": "done"},
            {"step": 1, "name": "core", "status": "pending"},
        ]
    }
    result = ex.StepExecutor._build_step_context(index)
    assert "Step 0 (setup): done" in result
    assert "core" not in result


def test_find_current_step_prefers_in_progress():
    index = {
        "steps": [
            {"step": 0, "name": "setup", "status": "pending"},
            {"step": 1, "name": "core", "status": "in_progress"},
        ]
    }
    current = ex.StepExecutor._find_current_step(index)
    assert current["step"] == 1


def test_find_current_step_falls_back_to_pending():
    index = {
        "steps": [
            {"step": 0, "name": "setup", "status": "completed"},
            {"step": 1, "name": "core", "status": "pending"},
        ]
    }
    current = ex.StepExecutor._find_current_step(index)
    assert current["step"] == 1


def test_derive_phase_status():
    assert ex.StepExecutor._derive_phase_status([{"status": "completed"}]) == "completed"
    assert ex.StepExecutor._derive_phase_status([{"status": "in_progress"}]) == "in_progress"
    assert ex.StepExecutor._derive_phase_status([{"status": "blocked"}]) == "blocked"
    assert ex.StepExecutor._derive_phase_status([{"status": "error"}]) == "error"
    assert ex.StepExecutor._derive_phase_status([{"status": "pending"}]) == "pending"


def test_validate_structure_passes(executor):
    executor._validate_structure()


def test_validate_structure_rejects_invalid_status(executor):
    ex.StepExecutor._write_json(
        executor._index_file,
        {"project": "x", "phase": "0-mvp", "steps": [{"step": 0, "name": "bad", "status": "weird"}]},
    )
    with pytest.raises(SystemExit) as exc_info:
        executor._validate_structure()
    assert exc_info.value.code == 1


def test_build_execution_payload_contains_context_and_prompt(executor):
    payload = executor.build_execution_payload()
    assert payload["phase"] == "0-mvp"
    assert payload["context_title"] == "context title"
    assert payload["current_step"]["name"] == "core"
    assert "setup done" in payload["prompt"]
    assert "Do work" in payload["prompt"]


def test_complete_current_step_updates_phase_context_and_top_index(executor):
    executor.complete_current_step(summary="core done", next_items=["ship it"])

    phase_index = ex.StepExecutor._read_json(executor._index_file)
    top_index = ex.StepExecutor._read_json(executor._top_index_file)
    context = ex.StepExecutor._read_json(executor._context_file)
    context_index = ex.StepExecutor._read_json(executor._context_dir / "index.json")

    assert phase_index["steps"][1]["status"] == "completed"
    assert phase_index["steps"][1]["summary"] == "core done"
    assert top_index["phases"][0]["status"] == "completed"
    assert top_index["phases"][0]["steps"][1]["status"] == "completed"
    assert context["status"] == "completed"
    assert "core done" in context["done"]
    assert context["next"] == ["ship it"]
    assert context_index["items"][0]["status"] == "completed"
    assert context_index["active"] is None


def test_main_dry_run(tmp_project, phase_files, capsys):
    with patch.object(ex, "ROOT", tmp_project):
        with patch("sys.argv", ["execute.py", "0-mvp", "--dry-run"]):
            ex.main()
    output = capsys.readouterr().out
    assert "0-mvp" in output


def test_main_complete_requires_summary(tmp_project, phase_files):
    with patch.object(ex, "ROOT", tmp_project):
        with patch("sys.argv", ["execute.py", "0-mvp", "--complete"]):
            with pytest.raises(SystemExit) as exc_info:
                ex.main()
    assert exc_info.value.code == 2
