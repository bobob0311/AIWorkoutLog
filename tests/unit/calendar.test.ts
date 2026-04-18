import { describe, expect, it } from "vitest";
import { buildCalendarDays, filterRecordsByMonth, getMonthlySummary } from "@/entities/calendar-day/model/calendar-service";
import type { DailyWorkoutSummary } from "@/entities/calendar-day/model/types";

const records: DailyWorkoutSummary[] = [
  {
    date: "2026-04-03",
    totalVolume: 5000,
    bodyPartVolumes: {
      chest: 3200,
      arms: 1800,
    },
  },
  {
    date: "2026-04-14",
    totalVolume: 4200,
    bodyPartVolumes: {
      back: 2600,
      shoulders: 1600,
    },
  },
  {
    date: "2026-05-02",
    totalVolume: 3600,
    bodyPartVolumes: {
      legs: 3600,
    },
  },
];

describe("calendar service", () => {
  it("월간 달력 데이터는 6주 그리드로 만들어야 한다", () => {
    const days = buildCalendarDays({
      year: 2026,
      month: 4,
      records,
    });

    expect(days).toHaveLength(42);
    expect(days.some((day) => day.date === "2026-04-03")).toBe(true);
  });

  it("기록 있는 날짜는 총 볼륨과 미니 차트 segment를 포함해야 한다", () => {
    const days = buildCalendarDays({
      year: 2026,
      month: 4,
      records,
    });

    const target = days.find((day) => day.date === "2026-04-03");
    expect(target?.totalVolume).toBe(5000);
    expect(target?.bodyPartVolumes.chest).toBe(3200);
    expect(target?.bodyPartVolumes.arms).toBe(1800);
    expect(target?.bodyPartChartSegments).toHaveLength(2);
    expect(target?.bodyPartChartSegments[0]).toMatchObject({
      bodyPart: "chest",
      volume: 3200,
      ratio: 0.64,
    });
    expect(target?.bodyPartChartSegments[1]).toMatchObject({
      bodyPart: "arms",
      volume: 1800,
      ratio: 0.36,
    });
    expect(target?.hasRecord).toBe(true);
  });

  it("보이는 월 기준으로 기록을 필터링해야 한다", () => {
    const aprilRecords = filterRecordsByMonth({ year: 2026, month: 4, records });
    const mayRecords = filterRecordsByMonth({ year: 2026, month: 5, records });

    expect(aprilRecords).toHaveLength(2);
    expect(mayRecords).toHaveLength(1);
    expect(mayRecords[0]?.date).toBe("2026-05-02");
  });

  it("월간 요약은 선택한 달 기준으로 다시 계산해야 한다", () => {
    const aprilSummary = getMonthlySummary({ year: 2026, month: 4, records });
    const maySummary = getMonthlySummary({ year: 2026, month: 5, records });

    expect(aprilSummary.activeDays).toBe(2);
    expect(aprilSummary.totalVolume).toBe(9200);
    expect(aprilSummary.topBodyPart).toBe("chest");

    expect(maySummary.activeDays).toBe(1);
    expect(maySummary.totalVolume).toBe(3600);
    expect(maySummary.topBodyPart).toBe("legs");
  });
});
