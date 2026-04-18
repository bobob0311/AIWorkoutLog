import type { BodyPart, ExerciseLog } from "@/entities/exercise-log/model/types";
import { bodyPartColors } from "@/shared/lib/body-part-colors";

export type AnalyticsRange = "day" | "week" | "month" | "custom";

export type AnalyticsFilter = {
  preset: AnalyticsRange;
  referenceDate: string;
  startDate?: string;
  endDate?: string;
};

export type BodyPartVolumeSummary = {
  bodyPart: BodyPart;
  totalVolume: number;
  exerciseCount: number;
  setCount: number;
};

export type AnalyticsSummary = {
  totalVolume: number;
  exerciseCount: number;
  setCount: number;
  topBodyPart: BodyPart | null;
};

export type BodyPartInsight = {
  bodyPart: BodyPart;
  currentVolume: number;
  previousVolume: number;
  delta: number;
  reason: string;
};

export type BodyPartComparison = {
  bodyPart: BodyPart;
  currentVolume: number;
  previousVolume: number;
  delta: number;
  changeRate: number | null;
};

export type ExerciseRankingItem = {
  exerciseName: string;
  bodyPart: BodyPart;
  totalVolume: number;
  color: string;
};

export type AnalyticsViewModel = {
  summary: AnalyticsSummary;
  byBodyPart: BodyPartVolumeSummary[];
  focusedBodyParts: BodyPartInsight[];
  undertrainedBodyParts: BodyPartInsight[];
  comparisons: BodyPartComparison[];
  exerciseRanking: ExerciseRankingItem[];
  filter: AnalyticsFilter;
};

type RangeBounds = {
  startDate: string;
  endDate: string;
};

function toDate(date: string): Date {
  return new Date(`${date}T00:00:00`);
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function startOfWeek(date: Date): Date {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfWeek(date: Date): Date {
  const start = startOfWeek(date);
  const copy = new Date(start);
  copy.setDate(start.getDate() + 6);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function getFilterBounds(filter: AnalyticsFilter): RangeBounds {
  const reference = toDate(filter.referenceDate);

  if (filter.preset === "day") {
    return { startDate: filter.referenceDate, endDate: filter.referenceDate };
  }

  if (filter.preset === "week") {
    return {
      startDate: formatDate(startOfWeek(reference)),
      endDate: formatDate(endOfWeek(reference)),
    };
  }

  if (filter.preset === "month") {
    return {
      startDate: formatDate(startOfMonth(reference)),
      endDate: formatDate(endOfMonth(reference)),
    };
  }

  return {
    startDate: filter.startDate ?? filter.referenceDate,
    endDate: filter.endDate ?? filter.referenceDate,
  };
}

function isWithinBounds(logDate: string, bounds: RangeBounds): boolean {
  return logDate >= bounds.startDate && logDate <= bounds.endDate;
}

function getPreviousBounds(bounds: RangeBounds): RangeBounds {
  const start = toDate(bounds.startDate);
  const end = toDate(bounds.endDate);
  const dayLength = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
  const previousEnd = new Date(start);
  previousEnd.setDate(start.getDate() - 1);
  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousEnd.getDate() - (dayLength - 1));

  return {
    startDate: formatDate(previousStart),
    endDate: formatDate(previousEnd),
  };
}

function buildBodyPartSummary(logs: ExerciseLog[]): BodyPartVolumeSummary[] {
  const byBodyPartMap = logs.reduce<Record<BodyPart, BodyPartVolumeSummary>>(
    (acc, log) => {
      const current = acc[log.bodyPart] ?? {
        bodyPart: log.bodyPart,
        totalVolume: 0,
        exerciseCount: 0,
        setCount: 0,
      };

      current.totalVolume += log.totalVolume;
      current.exerciseCount += 1;
      current.setCount += log.sets.length;
      acc[log.bodyPart] = current;
      return acc;
    },
    {} as Record<BodyPart, BodyPartVolumeSummary>,
  );

  return Object.values(byBodyPartMap).sort((a, b) => b.totalVolume - a.totalVolume);
}

function buildSummary(logs: ExerciseLog[], byBodyPart: BodyPartVolumeSummary[]): AnalyticsSummary {
  return {
    totalVolume: logs.reduce((sum, log) => sum + log.totalVolume, 0),
    exerciseCount: logs.length,
    setCount: logs.reduce((sum, log) => sum + log.sets.length, 0),
    topBodyPart: byBodyPart[0]?.bodyPart ?? null,
  };
}

function buildComparisons(
  currentByBodyPart: BodyPartVolumeSummary[],
  previousByBodyPart: BodyPartVolumeSummary[],
): BodyPartComparison[] {
  const currentMap = new Map(currentByBodyPart.map((item) => [item.bodyPart, item.totalVolume]));
  const previousMap = new Map(previousByBodyPart.map((item) => [item.bodyPart, item.totalVolume]));
  const bodyParts = new Set<BodyPart>([
    ...currentByBodyPart.map((item) => item.bodyPart),
    ...previousByBodyPart.map((item) => item.bodyPart),
  ]);

  return Array.from(bodyParts)
    .map((bodyPart) => {
      const currentVolume = currentMap.get(bodyPart) ?? 0;
      const previousVolume = previousMap.get(bodyPart) ?? 0;
      const delta = currentVolume - previousVolume;

      return {
        bodyPart,
        currentVolume,
        previousVolume,
        delta,
        changeRate: previousVolume > 0 ? Number(((delta / previousVolume) * 100).toFixed(1)) : null,
      };
    })
    .sort((a, b) => b.currentVolume - a.currentVolume);
}

function buildFocusedBodyParts(comparisons: BodyPartComparison[]): BodyPartInsight[] {
  return comparisons
    .filter((item) => item.currentVolume > 0)
    .slice(0, Math.min(2, comparisons.length))
    .map((item) => ({
      bodyPart: item.bodyPart,
      currentVolume: item.currentVolume,
      previousVolume: item.previousVolume,
      delta: item.delta,
      reason:
        item.delta > 0
          ? "이번 기간에 더 집중한 부위예요"
          : item.delta < 0
            ? "이번 기간에도 많이 했지만 직전보다 줄었어요"
            : "이번 기간에 많이 한 부위예요",
    }));
}

function buildUndertrainedBodyParts(comparisons: BodyPartComparison[]): BodyPartInsight[] {
  const decreased = comparisons
    .filter((item) => item.currentVolume > 0 && item.delta < 0)
    .sort((a, b) => a.currentVolume - b.currentVolume)
    .slice(0, 2)
    .map((item) => ({
      bodyPart: item.bodyPart,
      currentVolume: item.currentVolume,
      previousVolume: item.previousVolume,
      delta: item.delta,
      reason: "직전 동일 기간 대비 볼륨이 줄었어요",
    }));

  if (decreased.length > 0) {
    return decreased;
  }

  return comparisons
    .filter((item) => item.currentVolume > 0)
    .slice()
    .sort((a, b) => a.currentVolume - b.currentVolume)
    .slice(0, Math.min(2, comparisons.length))
    .map((item) => ({
      bodyPart: item.bodyPart,
      currentVolume: item.currentVolume,
      previousVolume: item.previousVolume,
      delta: item.delta,
      reason: "현재 기간 기준 볼륨이 낮아요",
    }));
}

function buildExerciseRanking(logs: ExerciseLog[]): ExerciseRankingItem[] {
  const rankingMap = new Map<string, ExerciseRankingItem>();

  for (const log of logs) {
    const key = `${log.bodyPart}:${log.exerciseName}`;
    const current = rankingMap.get(key) ?? {
      exerciseName: log.exerciseName,
      bodyPart: log.bodyPart,
      totalVolume: 0,
      color: bodyPartColors[log.bodyPart],
    };

    current.totalVolume += log.totalVolume;
    rankingMap.set(key, current);
  }

  return Array.from(rankingMap.values()).sort((a, b) => b.totalVolume - a.totalVolume);
}

export function buildAnalyticsViewModel(logs: ExerciseLog[], filter: AnalyticsFilter): AnalyticsViewModel {
  const bounds = getFilterBounds(filter);
  const previousBounds = getPreviousBounds(bounds);
  const filtered = logs.filter((log) => isWithinBounds(log.date, bounds));
  const previous = logs.filter((log) => isWithinBounds(log.date, previousBounds));
  const byBodyPart = buildBodyPartSummary(filtered);
  const previousByBodyPart = buildBodyPartSummary(previous);
  const comparisons = buildComparisons(byBodyPart, previousByBodyPart);

  return {
    summary: buildSummary(filtered, byBodyPart),
    byBodyPart,
    focusedBodyParts: buildFocusedBodyParts(comparisons),
    undertrainedBodyParts: buildUndertrainedBodyParts(comparisons),
    comparisons,
    exerciseRanking: buildExerciseRanking(filtered),
    filter,
  };
}
