import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { ExerciseLog } from "@/entities/exercise-log/model/types";
import { AnalyticsDashboard } from "@/widgets/analytics-dashboard/ui/analytics-dashboard";

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

const comparisonLogs: ExerciseLog[] = [
  {
    id: "compare-1",
    date: "2026-04-13",
    bodyPart: "back",
    exerciseName: "로우",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 80, reps: 8, volume: 640 }],
    totalVolume: 640,
  },
  {
    id: "compare-2",
    date: "2026-04-14",
    bodyPart: "chest",
    exerciseName: "벤치프레스",
    exerciseSource: "base",
    memo: "",
    sets: [
      { setOrder: 1, weight: 80, reps: 10, volume: 800 },
      { setOrder: 2, weight: 80, reps: 10, volume: 800 },
    ],
    totalVolume: 1600,
  },
  {
    id: "compare-3",
    date: "2026-04-20",
    bodyPart: "chest",
    exerciseName: "벤치프레스",
    exerciseSource: "base",
    memo: "",
    sets: [
      { setOrder: 1, weight: 85, reps: 8, volume: 680 },
      { setOrder: 2, weight: 85, reps: 8, volume: 680 },
    ],
    totalVolume: 1360,
  },
  {
    id: "compare-4",
    date: "2026-04-20",
    bodyPart: "arms",
    exerciseName: "컬",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 25, reps: 12, volume: 300 }],
    totalVolume: 300,
  },
];

describe("AnalyticsDashboard", () => {
  it("통계 화면에서는 요약, 부위별 볼륨, 운동 랭킹을 보여야 한다", () => {
    render(<AnalyticsDashboard logs={logs} referenceDate="2026-04-15" view="stats" />);

    expect(screen.getByRole("heading", { name: "운동 통계" })).toBeInTheDocument();
    expect(screen.getByLabelText("통계 요약")).toHaveTextContent("총 볼륨");
    expect(screen.getByLabelText("부위별 볼륨")).toHaveTextContent("등");
    expect(screen.getByLabelText("운동 랭킹")).toHaveTextContent("랫풀다운");
    expect(screen.queryByLabelText("다음 운동 추천")).not.toBeInTheDocument();
  });

  it("비교 화면에서는 추천, 이번 주 비교, 운동별 수행 변화를 보여야 한다", () => {
    render(<AnalyticsDashboard logs={comparisonLogs} referenceDate="2026-04-20" view="comparison" />);

    expect(screen.getByRole("heading", { name: "운동 비교" })).toBeInTheDocument();
    expect(screen.getByLabelText("다음 운동 추천")).toHaveTextContent("보완");
    expect(screen.getByLabelText("다음 운동 추천")).toHaveTextContent("지난주 대비");
    expect(screen.getByLabelText("이번 주 비교")).toHaveTextContent("지난주 같은 기간");
    expect(screen.getByLabelText("운동별 수행 변화")).toHaveTextContent("벤치프레스");
    expect(screen.getByLabelText("운동별 수행 변화")).toHaveTextContent("고중량 세션");
    expect(screen.getByLabelText("운동별 수행 변화")).toHaveTextContent("비교 부족");
    expect(screen.queryByLabelText("운동 랭킹")).not.toBeInTheDocument();
  });

  it("직접 기간을 적용하면 통계 화면의 집계가 바뀌어야 한다", async () => {
    const user = userEvent.setup();

    render(<AnalyticsDashboard logs={logs} referenceDate="2026-04-15" view="stats" />);

    await user.click(screen.getByRole("button", { name: "직접 기간 통계 보기" }));
    await user.clear(screen.getByLabelText("시작일"));
    await user.type(screen.getByLabelText("시작일"), "2026-04-03");
    await user.clear(screen.getByLabelText("종료일"));
    await user.type(screen.getByLabelText("종료일"), "2026-04-15");
    await user.click(screen.getByRole("button", { name: "기간 적용" }));

    expect(screen.getByLabelText("통계 요약")).toHaveTextContent("2580kg");
    expect(screen.getByLabelText("가장 많이 한 부위")).toHaveTextContent("등");
    expect(screen.getByLabelText("운동 랭킹")).toHaveTextContent("벤치프레스");
  });
});
