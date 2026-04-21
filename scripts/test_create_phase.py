import json
import sys
from pathlib import Path
from unittest.mock import patch

import pytest

sys.path.insert(0, str(Path(__file__).parent))
import create_phase as cp


@pytest.fixture
def tmp_project(tmp_path):
    (tmp_path / "phases").mkdir()
    (tmp_path / "context").mkdir()
    (tmp_path / "phases" / "index.json").write_text(json.dumps({"phases": []}, indent=2), encoding="utf-8")
    (tmp_path / "context" / "index.json").write_text(
        json.dumps({"active": None, "items": []}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    return tmp_path


def test_create_phase_writes_phase_context_and_indexes(tmp_project):
    with patch.object(cp, "ROOT", tmp_project):
        cp.create_phase(
            phase_dir="2-new-phase",
            project="Test Project",
            goal="Ship new work",
            title="New phase title",
            step_names=["first-step", "second-step"],
        )

    phase_index = json.loads((tmp_project / "phases" / "2-new-phase" / "index.json").read_text(encoding="utf-8"))
    context = json.loads((tmp_project / "context" / "2-new-phase.json").read_text(encoding="utf-8"))
    top_index = json.loads((tmp_project / "phases" / "index.json").read_text(encoding="utf-8"))
    context_index = json.loads((tmp_project / "context" / "index.json").read_text(encoding="utf-8"))

    assert phase_index["goal"] == "Ship new work"
    assert phase_index["steps"][0]["status"] == "in_progress"
    assert phase_index["steps"][1]["status"] == "pending"
    assert context["status"] == "in_progress"
    assert context["next"] == ["Complete step 0: first-step"]
    assert top_index["phases"][0]["dir"] == "2-new-phase"
    assert top_index["phases"][0]["status"] == "in_progress"
    assert context_index["active"] == "2-new-phase"
    assert context_index["items"][0]["phase"] == "2-new-phase"
    assert (tmp_project / "phases" / "2-new-phase" / "step0.md").exists()
    assert (tmp_project / "phases" / "2-new-phase" / "step1.md").exists()


def test_create_phase_requires_steps(tmp_project):
    with patch.object(cp, "ROOT", tmp_project):
        with pytest.raises(SystemExit) as exc_info:
            cp.create_phase(
                phase_dir="2-new-phase",
                project="Test Project",
                goal="Ship new work",
                title="New phase title",
                step_names=[],
            )
    assert exc_info.value.code == 1
