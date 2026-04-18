import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AnalyticsDashboard } from "@/widgets/analytics-dashboard/ui/analytics-dashboard";
import type { ExerciseLog } from "@/entities/exercise-log/model/types";

const logs: ExerciseLog[] = [
  {
    id: "1",
    date: "2026-04-03",
    bodyPart: "chest",
    exerciseName: "벤치프레스",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 80, reps: 10, volume: 800 }],
    totalVolume: 800,
  },
  {
    id: "2",
    date: "2026-04-14",
    bodyPart: "back",
    exerciseName: "바벨 로우",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 70, reps: 10, volume: 700 }],
    totalVolume: 700,
  },
  {
    id: "3",
    date: "2026-04-14",
    bodyPart: "shoulders",
    exerciseName: "숄더프레스",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 45, reps: 8, volume: 360 }],
    totalVolume: 360,
  },
  {
    id: "4",
    date: "2026-04-15",
    bodyPart: "back",
    exerciseName: "랫풀다운",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 60, reps: 12, volume: 720 }],
    totalVolume: 720,
  },
];

describe("AnalyticsDashboard", () => {
  it("기본적으로 집중 부위, 부족 부위, 부위별 비교, 운동 랭킹을 함께 보여야 한다", () => {
    render(<AnalyticsDashboard logs={logs} referenceDate="2026-04-15" />);

    expect(screen.getByLabelText("집중 부위 목록")).toHaveTextContent("등");
    expect(screen.getByLabelText("부족 부위 목록")).toHaveTextContent("등");
    expect(screen.getByLabelText("부위별 비교 목록")).toHaveTextContent("등");
    expect(screen.getByLabelText("운동 랭킹 차트")).toHaveTextContent("랫풀다운");
    expect(screen.getByLabelText("랫풀다운 등 720kg")).toBeInTheDocument();
  });

  it("custom range를 설정하면 비교, 인사이트, 운동 랭킹이 함께 바뀌어야 한다", async () => {
    const user = userEvent.setup();

    render(<AnalyticsDashboard logs={logs} referenceDate="2026-04-15" />);

    await user.click(screen.getByRole("button", { name: "직접 기간 통계 보기" }));
    await user.clear(screen.getByLabelText("시작일"));
    await user.type(screen.getByLabelText("시작일"), "2026-04-03");
    await user.clear(screen.getByLabelText("종료일"));
    await user.type(screen.getByLabelText("종료일"), "2026-04-15");
    await user.click(screen.getByRole("button", { name: "기간 적용" }));

    expect(screen.getByText("2580kg")).toBeInTheDocument();
    expect(screen.getByLabelText("최다 운동 부위")).toHaveTextContent("등");
    expect(screen.getByLabelText("집중 부위 목록")).toHaveTextContent("등");
    expect(screen.getByLabelText("부위별 비교 목록")).toHaveTextContent("어깨");
    expect(screen.getByLabelText("운동 랭킹 차트")).toHaveTextContent("벤치프레스");
  });
});
