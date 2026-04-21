import { describe, expect, it } from "vitest";
import { buildAnalyticsViewModel } from "@/entities/analytics/model/analytics-service";
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
    date: "2026-04-03",
    bodyPart: "arms",
    exerciseName: "바벨 컬",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 30, reps: 12, volume: 360 }],
    totalVolume: 360,
  },
  {
    id: "3",
    date: "2026-04-08",
    bodyPart: "legs",
    exerciseName: "스쿼트",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 100, reps: 8, volume: 800 }],
    totalVolume: 800,
  },
  {
    id: "3-1",
    date: "2026-04-13",
    bodyPart: "back",
    exerciseName: "시티드 로우",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 80, reps: 10, volume: 800 }],
    totalVolume: 800,
  },
  {
    id: "3-2",
    date: "2026-04-13",
    bodyPart: "shoulders",
    exerciseName: "사이드 레터럴 레이즈",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 25, reps: 20, volume: 500 }],
    totalVolume: 500,
  },
  {
    id: "4",
    date: "2026-04-14",
    bodyPart: "back",
    exerciseName: "바벨 로우",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 70, reps: 10, volume: 700 }],
    totalVolume: 700,
  },
  {
    id: "5",
    date: "2026-04-14",
    bodyPart: "shoulders",
    exerciseName: "숄더프레스",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 45, reps: 8, volume: 360 }],
    totalVolume: 360,
  },
  {
    id: "6",
    date: "2026-04-15",
    bodyPart: "back",
    exerciseName: "랫풀다운",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 60, reps: 12, volume: 720 }],
    totalVolume: 720,
  },
];

describe("analytics service", () => {
  it("일간 집계는 해당 날짜 기록만 포함해야 한다", () => {
    const result = buildAnalyticsViewModel(logs, {
      preset: "day",
      referenceDate: "2026-04-03",
    });

    expect(result.summary.totalVolume).toBe(1160);
    expect(result.summary.exerciseCount).toBe(2);
    expect(result.byBodyPart[0].bodyPart).toBe("chest");
  });

  it("주간 집계는 같은 주의 기록을 포함해야 한다", () => {
    const result = buildAnalyticsViewModel(logs, {
      preset: "week",
      referenceDate: "2026-04-14",
    });

    expect(result.summary.totalVolume).toBe(3080);
    expect(result.summary.setCount).toBe(5);
    expect(result.byBodyPart[0].bodyPart).toBe("back");
  });

  it("월간 집계는 해당 달 전체 기록을 포함해야 한다", () => {
    const result = buildAnalyticsViewModel(logs, {
      preset: "month",
      referenceDate: "2026-04-14",
    });

    expect(result.summary.totalVolume).toBe(5040);
    expect(result.summary.topBodyPart).toBe("back");
    expect(result.byBodyPart.length).toBeGreaterThan(2);
  });

  it("custom range는 선택한 시작일과 종료일 기준으로 집계해야 한다", () => {
    const result = buildAnalyticsViewModel(logs, {
      preset: "custom",
      referenceDate: "2026-04-15",
      startDate: "2026-04-14",
      endDate: "2026-04-15",
    });

    expect(result.summary.totalVolume).toBe(1780);
    expect(result.summary.exerciseCount).toBe(3);
    expect(result.byBodyPart[0].bodyPart).toBe("back");
  });

  it("집중 부위와 부족 부위를 함께 계산해야 한다", () => {
    const result = buildAnalyticsViewModel(logs, {
      preset: "custom",
      referenceDate: "2026-04-14",
      startDate: "2026-04-14",
      endDate: "2026-04-15",
    });

    expect(result.focusedBodyParts[0]).toMatchObject({
      bodyPart: "back",
      currentVolume: 1420,
      previousVolume: 800,
      delta: 620,
      reason: "이번 기간에 더 집중한 부위예요",
    });
    expect(result.undertrainedBodyParts[0]).toMatchObject({
      bodyPart: "shoulders",
      currentVolume: 360,
      previousVolume: 500,
      delta: -140,
      reason: "직전 동일 기간 대비 볼륨이 줄었어요",
    });
  });

  it("부위별 비교에서 저번 기간과의 차이를 모두 보여줘야 한다", () => {
    const result = buildAnalyticsViewModel(logs, {
      preset: "custom",
      referenceDate: "2026-04-15",
      startDate: "2026-04-14",
      endDate: "2026-04-15",
    });

    expect(result.comparisons[0]).toMatchObject({
      bodyPart: "back",
      currentVolume: 1420,
      previousVolume: 800,
      delta: 620,
      changeRate: 77.5,
    });
    expect(result.comparisons.find((item) => item.bodyPart === "shoulders")).toMatchObject({
      currentVolume: 360,
      previousVolume: 500,
      delta: -140,
      changeRate: -28,
    });
  });

  it("운동 랭킹은 총 볼륨 내림차순으로 정렬되고 부위 색상을 따라야 한다", () => {
    const result = buildAnalyticsViewModel(logs, {
      preset: "custom",
      referenceDate: "2026-04-15",
      startDate: "2026-04-14",
      endDate: "2026-04-15",
    });

    expect(result.exerciseRanking[0]).toMatchObject({
      exerciseName: "랫풀다운",
      bodyPart: "back",
      totalVolume: 720,
      color: "#3b82f6",
    });
    expect(result.exerciseRanking[1]).toMatchObject({
      exerciseName: "바벨 로우",
      bodyPart: "back",
      totalVolume: 700,
      color: "#3b82f6",
    });
    expect(result.exerciseRanking[2]).toMatchObject({
      exerciseName: "숄더프레스",
      bodyPart: "shoulders",
      totalVolume: 360,
      color: "#f59e0b",
    });
  });
});

const insightLogs: ExerciseLog[] = [
  {
    id: "insight-1",
    date: "2026-04-06",
    bodyPart: "back",
    exerciseName: "Row",
    exerciseSource: "base",
    memo: "",
    sets: [
      { setOrder: 1, weight: 80, reps: 10, volume: 800 },
      { setOrder: 2, weight: 80, reps: 10, volume: 800 },
    ],
    totalVolume: 1600,
  },
  {
    id: "insight-2",
    date: "2026-04-07",
    bodyPart: "legs",
    exerciseName: "Squat",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 120, reps: 10, volume: 1200 }],
    totalVolume: 1200,
  },
  {
    id: "insight-3",
    date: "2026-04-13",
    bodyPart: "back",
    exerciseName: "Row",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 80, reps: 8, volume: 640 }],
    totalVolume: 640,
  },
  {
    id: "insight-4",
    date: "2026-04-14",
    bodyPart: "chest",
    exerciseName: "Bench Press",
    exerciseSource: "base",
    memo: "",
    sets: [
      { setOrder: 1, weight: 80, reps: 10, volume: 800 },
      { setOrder: 2, weight: 80, reps: 10, volume: 800 },
    ],
    totalVolume: 1600,
  },
  {
    id: "insight-5",
    date: "2026-04-20",
    bodyPart: "chest",
    exerciseName: "Bench Press",
    exerciseSource: "base",
    memo: "",
    sets: [
      { setOrder: 1, weight: 85, reps: 8, volume: 680 },
      { setOrder: 2, weight: 85, reps: 8, volume: 680 },
    ],
    totalVolume: 1360,
  },
  {
    id: "insight-6",
    date: "2026-04-20",
    bodyPart: "arms",
    exerciseName: "Curl",
    exerciseSource: "base",
    memo: "",
    sets: [{ setOrder: 1, weight: 25, reps: 12, volume: 300 }],
    totalVolume: 300,
  },
];

describe("training insight analytics", () => {
  it("recommends undertrained body parts with explicit evidence", () => {
    const result = buildAnalyticsViewModel(insightLogs, {
      preset: "week",
      referenceDate: "2026-04-20",
    });

    expect(result.recommendedBodyParts[0]).toMatchObject({
      bodyPart: "back",
      currentVolume: 0,
      previousVolume: 640,
      changeRate: -100,
    });
    expect(result.recommendedBodyParts[0].evidence.length).toBeGreaterThan(0);
    expect(result.recommendedBodyParts[0].evidence.map((item) => item.label)).toContain("지난주 대비");
  });

  it("compares current week to the previous week through the same reference weekday", () => {
    const result = buildAnalyticsViewModel(insightLogs, {
      preset: "week",
      referenceDate: "2026-04-20",
    });

    expect(result.weeklyVolumeTrend).toMatchObject({
      currentStartDate: "2026-04-20",
      currentEndDate: "2026-04-20",
      previousStartDate: "2026-04-13",
      previousEndDate: "2026-04-13",
      currentWeekVolume: 1660,
      previousComparableVolume: 640,
      delta: 1020,
      changeRate: 159.4,
      status: "increase",
    });
  });

  it("builds recent completed week volume buckets", () => {
    const result = buildAnalyticsViewModel(insightLogs, {
      preset: "week",
      referenceDate: "2026-04-20",
    });

    expect(result.weeklyVolumeTrend.recentWeeks).toHaveLength(4);
    expect(result.weeklyVolumeTrend.recentWeeks[2]).toMatchObject({
      startDate: "2026-04-06",
      endDate: "2026-04-12",
      totalVolume: 2800,
    });
    expect(result.weeklyVolumeTrend.recentWeeks[3]).toMatchObject({
      startDate: "2026-04-13",
      endDate: "2026-04-19",
      totalVolume: 2240,
    });
  });

  it("compares the latest two sessions for each exercise", () => {
    const result = buildAnalyticsViewModel(insightLogs, {
      preset: "week",
      referenceDate: "2026-04-20",
    });
    const bench = result.exerciseProgressChanges.find((item) => item.exerciseName === "Bench Press");

    expect(bench).toMatchObject({
      latestDate: "2026-04-20",
      previousDate: "2026-04-14",
      latestVolume: 1360,
      previousVolume: 1600,
      volumeChangeRate: -15,
      latestMaxWeight: 85,
      previousMaxWeight: 80,
      maxWeightDelta: 5,
      status: "heavy_session",
    });
  });

  it("marks one-session exercises as insufficient for progress comparison", () => {
    const result = buildAnalyticsViewModel(insightLogs, {
      preset: "week",
      referenceDate: "2026-04-20",
    });
    const curl = result.exerciseProgressChanges.find((item) => item.exerciseName === "Curl");

    expect(curl).toMatchObject({
      previousDate: null,
      previousVolume: null,
      status: "insufficient",
      note: "비교할 이전 세션이 아직 없습니다.",
    });
  });
});
