import { bodyPartColors } from "@/shared/lib/body-part-colors";
import type { BodyPart, BodyPartChartSegment, BodyPartVolumeMap, CalendarDay, DailyWorkoutSummary, MonthlySummary } from "./types";

type BuildCalendarDaysParams = {
  year: number;
  month: number;
  records: DailyWorkoutSummary[];
};

type MonthFilterParams = {
  year: number;
  month: number;
  records: DailyWorkoutSummary[];
};

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function normalizeBodyPartMap(map: BodyPartVolumeMap): BodyPartVolumeMap {
  return Object.fromEntries(Object.entries(map).filter(([, value]) => Boolean(value))) as BodyPartVolumeMap;
}

function buildBodyPartChartSegments(totalVolume: number, bodyPartVolumes: BodyPartVolumeMap): BodyPartChartSegment[] {
  return (Object.entries(bodyPartVolumes) as [BodyPart, number][])
    .filter(([, volume]) => volume > 0 && totalVolume > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([bodyPart, volume]) => ({
      bodyPart,
      volume,
      ratio: Number((volume / totalVolume).toFixed(2)),
      color: bodyPartColors[bodyPart],
    }));
}

export function filterRecordsByMonth({ year, month, records }: MonthFilterParams): DailyWorkoutSummary[] {
  const prefix = `${year}-${String(month).padStart(2, "0")}-`;
  return records.filter((record) => record.date.startsWith(prefix));
}

export function buildCalendarDays({ year, month, records }: BuildCalendarDaysParams): CalendarDay[] {
  const firstDay = new Date(year, month - 1, 1);
  const startOffset = firstDay.getDay();
  const startDate = new Date(year, month - 1, 1 - startOffset);
  const recordMap = new Map(records.map((record) => [record.date, record]));

  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + index);

    const currentYear = current.getFullYear();
    const currentMonth = current.getMonth() + 1;
    const currentDay = current.getDate();
    const date = formatDate(currentYear, currentMonth, currentDay);
    const matched = recordMap.get(date);
    const bodyPartVolumes = normalizeBodyPartMap(matched?.bodyPartVolumes ?? {});
    const totalVolume = matched?.totalVolume ?? 0;

    return {
      date,
      dayNumber: currentDay,
      isCurrentMonth: currentMonth === month,
      hasRecord: Boolean(matched),
      totalVolume,
      bodyPartVolumes,
      bodyPartChartSegments: buildBodyPartChartSegments(totalVolume, bodyPartVolumes),
    };
  });
}

export function getMonthlySummary({ year, month, records }: MonthFilterParams): MonthlySummary {
  const monthlyRecords = filterRecordsByMonth({ year, month, records });
  const totalVolume = monthlyRecords.reduce((sum, record) => sum + record.totalVolume, 0);
  const bodyPartTotals = monthlyRecords.reduce<Record<BodyPart, number>>(
    (acc, record) => {
      for (const [bodyPart, volume] of Object.entries(record.bodyPartVolumes) as [BodyPart, number][]) {
        acc[bodyPart] += volume;
      }
      return acc;
    },
    {
      chest: 0,
      back: 0,
      legs: 0,
      shoulders: 0,
      arms: 0,
      core: 0,
    },
  );

  const topBodyPart =
    (Object.entries(bodyPartTotals).sort((a, b) => b[1] - a[1])[0]?.[0] as BodyPart | undefined) ?? null;

  return {
    activeDays: monthlyRecords.length,
    totalVolume,
    topBodyPart: topBodyPart && bodyPartTotals[topBodyPart] > 0 ? topBodyPart : null,
  };
}
