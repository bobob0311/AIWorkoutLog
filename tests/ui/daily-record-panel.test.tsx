import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DailyRecordPanel } from "@/widgets/daily-record-panel/ui/daily-record-panel";
import type { ExerciseLog, ExerciseOption } from "@/entities/exercise-log/model/types";

const options: ExerciseOption[] = [
  { id: "base-bench", name: "벤치프레스", bodyPart: "chest", source: "base" },
  { id: "base-fly", name: "덤벨 플라이", bodyPart: "chest", source: "base" },
  { id: "base-row", name: "바벨 로우", bodyPart: "back", source: "base" },
];

const logs: ExerciseLog[] = [];

describe("DailyRecordPanel", () => {
  it("모달 형식으로 열리고 닫기 버튼을 보여야 한다", () => {
    render(
      <DailyRecordPanel
        date="2026-04-03"
        logs={logs}
        exerciseOptions={options}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onAddCustomExercise={vi.fn()}
        onClose={vi.fn()}
        mode="modal"
      />,
    );

    expect(screen.getByRole("dialog", { name: "2026-04-03 운동 기록" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "닫기" })).toBeInTheDocument();
  });

  it("부위를 바꾸면 운동 버튼 목록도 바뀌어야 한다", async () => {
    const user = userEvent.setup();

    render(
      <DailyRecordPanel
        date="2026-04-03"
        logs={logs}
        exerciseOptions={options}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onAddCustomExercise={vi.fn()}
        mode="inline"
      />,
    );

    expect(screen.getByRole("button", { name: "벤치프레스 선택" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "바벨 로우 선택" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "등" }));

    expect(screen.getByRole("button", { name: "바벨 로우 선택" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "벤치프레스 선택" })).not.toBeInTheDocument();
  });

  it("운동 버튼을 누른 뒤 다른 운동 버튼으로 다시 바꿀 수 있어야 한다", async () => {
    const user = userEvent.setup();

    render(
      <DailyRecordPanel
        date="2026-04-03"
        logs={logs}
        exerciseOptions={options}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onAddCustomExercise={vi.fn()}
        mode="inline"
      />,
    );

    await user.click(screen.getByRole("button", { name: "벤치프레스 선택" }));
    expect(screen.getByLabelText("선택된 운동")).toHaveTextContent("벤치프레스");

    await user.click(screen.getByRole("button", { name: "덤벨 플라이 선택" }));
    expect(screen.getByLabelText("선택된 운동")).toHaveTextContent("덤벨 플라이");
  });

  it("중량과 횟수 빠른 버튼은 현재 세트 값에 더하기로 동작해야 한다", async () => {
    const user = userEvent.setup();

    render(
      <DailyRecordPanel
        date="2026-04-03"
        logs={logs}
        exerciseOptions={options}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onAddCustomExercise={vi.fn()}
        mode="inline"
      />,
    );

    await user.click(screen.getByRole("button", { name: "벤치프레스 선택" }));
    await user.click(screen.getByRole("button", { name: "세트 1 중량 +10kg" }));
    await user.click(screen.getByRole("button", { name: "세트 1 중량 +20kg" }));
    await user.click(screen.getByRole("button", { name: "세트 1 횟수 +8" }));
    await user.click(screen.getByRole("button", { name: "세트 1 횟수 +12" }));

    expect(screen.getByLabelText("세트 1 중량")).toHaveValue(30);
    expect(screen.getByLabelText("세트 1 횟수")).toHaveValue(20);
    expect(screen.getByText("운동 총 볼륨 600kg")).toBeInTheDocument();
  });

  it("직접 입력과 빠른 입력을 섞어 저장하면 저장 값이 맞아야 한다", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <DailyRecordPanel
        date="2026-04-03"
        logs={logs}
        exerciseOptions={options}
        onSave={onSave}
        onDelete={vi.fn()}
        onAddCustomExercise={vi.fn()}
        mode="inline"
      />,
    );

    await user.click(screen.getByRole("button", { name: "벤치프레스 선택" }));
    await user.clear(screen.getByLabelText("세트 1 중량"));
    await user.type(screen.getByLabelText("세트 1 중량"), "40");
    await user.click(screen.getByRole("button", { name: "세트 1 중량 +20kg" }));
    await user.clear(screen.getByLabelText("세트 1 횟수"));
    await user.type(screen.getByLabelText("세트 1 횟수"), "5");
    await user.click(screen.getByRole("button", { name: "세트 1 횟수 +5" }));
    await user.click(screen.getByRole("button", { name: "기록 저장" }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0][0].exerciseName).toBe("벤치프레스");
    expect(onSave.mock.calls[0][0].sets[0].weight).toBe(60);
    expect(onSave.mock.calls[0][0].sets[0].reps).toBe(10);
  });
});
