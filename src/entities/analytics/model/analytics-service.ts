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

export type TrendStatus = "increase" | "decrease" | "maintain";

export type RecommendationEvidence = {
  label: string;
  value: string;
};

export type RecommendedBodyPart = {
  bodyPart: BodyPart;
  reason: string;
  currentVolume: number;
  previousVolume: number;
  delta: number;
  changeRate: number | null;
  lastTrainedDate: string | null;
  daysSinceLastTrained: number | null;
  weeklyShare: number;
  evidence: RecommendationEvidence[];
};

export type WeekVolumeBucket = {
  startDate: string;
  endDate: string;
  totalVolume: number;
};

export type BodyPartTrend = {
  bodyPart: BodyPart;
  currentVolume: number;
  previousVolume: number;
  delta: number;
  changeRate: number | null;
  status: TrendStatus;
};

export type WeeklyVolumeTrend = {
  currentStartDate: string;
  currentEndDate: string;
  previousStartDate: string;
  previousEndDate: string;
  currentWeekVolume: number;
  previousComparableVolume: number;
  delta: number;
  changeRate: number | null;
  status: TrendStatus;
  recentWeeks: WeekVolumeBucket[];
  byBodyPart: BodyPartTrend[];
};

export type ExerciseProgressStatus =
  | "weight_increase"
  | "volume_increase"
  | "volume_decrease"
  | "maintained"
  | "heavy_session"
  | "insufficient";

export type ExerciseProgressChange = {
  exerciseName: string;
  bodyPart: BodyPart;
  latestDate: string;
  previousDate: string | null;
  latestVolume: number;
  previousVolume: number | null;
  volumeChangeRate: number | null;
  latestMaxWeight: number;
  previousMaxWeight: number | null;
  maxWeightDelta: number | null;
  latestSetCount: number;
  previousSetCount: number | null;
  latestAverageReps: number;
  previousAverageReps: number | null;
  status: ExerciseProgressStatus;
  note: string;
};

export type AnalyticsViewModel = {
  summary: AnalyticsSummary;
  byBodyPart: BodyPartVolumeSummary[];
  focusedBodyParts: BodyPartInsight[];
  undertrainedBodyParts: BodyPartInsight[];
  comparisons: BodyPartComparison[];
  exerciseRanking: ExerciseRankingItem[];
  recommendedBodyParts: RecommendedBodyPart[];
  weeklyVolumeTrend: WeeklyVolumeTrend;
  exerciseProgressChanges: ExerciseProgressChange[];
  filter: AnalyticsFilter;
};

type RangeBounds = {
  startDate: string;
  endDate: string;
};

const bodyParts: BodyPart[] = ["chest", "back", "legs", "shoulders", "arms", "core"];

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

function addDays(date: Date, amount: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function diffDays(fromDate: string, toDateValue: string): number {
  return Math.floor((toDate(toDateValue).getTime() - toDate(fromDate).getTime()) / 86400000);
}

function getWeekToDateBounds(referenceDate: string): { current: RangeBounds; previous: RangeBounds } {
  const reference = toDate(referenceDate);
  const currentStart = startOfWeek(reference);
  const offset = Math.floor((reference.getTime() - currentStart.getTime()) / 86400000);
  const previousStart = addDays(currentStart, -7);

  return {
    current: {
      startDate: formatDate(currentStart),
      endDate: referenceDate,
    },
    previous: {
      startDate: formatDate(previousStart),
      endDate: formatDate(addDays(previousStart, offset)),
    },
  };
}

function sumVolume(logs: ExerciseLog[], bounds: RangeBounds): number {
  return logs.filter((log) => isWithinBounds(log.date, bounds)).reduce((sum, log) => sum + log.totalVolume, 0);
}

function getVolumeByBodyPart(logs: ExerciseLog[], bounds: RangeBounds): Record<BodyPart, number> {
  const result = Object.fromEntries(bodyParts.map((bodyPart) => [bodyPart, 0])) as Record<BodyPart, number>;

  for (const log of logs) {
    if (isWithinBounds(log.date, bounds)) {
      result[log.bodyPart] += log.totalVolume;
    }
  }

  return result;
}

function getChangeRate(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function getTrendStatus(changeRate: number | null, delta: number): TrendStatus {
  if (changeRate === null) {
    if (delta > 0) return "increase";
    return "maintain";
  }

  if (changeRate >= 5) return "increase";
  if (changeRate <= -5) return "decrease";
  return "maintain";
}

function formatSignedPercent(changeRate: number | null): string {
  if (changeRate === null) return "비교 기준 없음";
  if (changeRate > 0) return `+${changeRate}%`;
  return `${changeRate}%`;
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

function buildRecentWeekBuckets(logs: ExerciseLog[], referenceDate: string): WeekVolumeBucket[] {
  const referenceWeekStart = startOfWeek(toDate(referenceDate));

  return [4, 3, 2, 1].map((weekOffset) => {
    const start = addDays(referenceWeekStart, -7 * weekOffset);
    const end = addDays(start, 6);
    const bounds = {
      startDate: formatDate(start),
      endDate: formatDate(end),
    };

    return {
      ...bounds,
      totalVolume: sumVolume(logs, bounds),
    };
  });
}

function buildWeeklyVolumeTrend(logs: ExerciseLog[], referenceDate: string): WeeklyVolumeTrend {
  const bounds = getWeekToDateBounds(referenceDate);
  const currentWeekVolume = sumVolume(logs, bounds.current);
  const previousComparableVolume = sumVolume(logs, bounds.previous);
  const delta = currentWeekVolume - previousComparableVolume;
  const changeRate = getChangeRate(currentWeekVolume, previousComparableVolume);
  const currentByBodyPart = getVolumeByBodyPart(logs, bounds.current);
  const previousByBodyPart = getVolumeByBodyPart(logs, bounds.previous);

  return {
    currentStartDate: bounds.current.startDate,
    currentEndDate: bounds.current.endDate,
    previousStartDate: bounds.previous.startDate,
    previousEndDate: bounds.previous.endDate,
    currentWeekVolume,
    previousComparableVolume,
    delta,
    changeRate,
    status: getTrendStatus(changeRate, delta),
    recentWeeks: buildRecentWeekBuckets(logs, referenceDate),
    byBodyPart: bodyParts.map((bodyPart) => {
      const currentVolume = currentByBodyPart[bodyPart];
      const previousVolume = previousByBodyPart[bodyPart];
      const bodyPartDelta = currentVolume - previousVolume;
      const bodyPartChangeRate = getChangeRate(currentVolume, previousVolume);

      return {
        bodyPart,
        currentVolume,
        previousVolume,
        delta: bodyPartDelta,
        changeRate: bodyPartChangeRate,
        status: getTrendStatus(bodyPartChangeRate, bodyPartDelta),
      };
    }),
  };
}

function buildRecommendedBodyParts(logs: ExerciseLog[], referenceDate: string): RecommendedBodyPart[] {
  const bounds = getWeekToDateBounds(referenceDate);
  const currentByBodyPart = getVolumeByBodyPart(logs, bounds.current);
  const previousByBodyPart = getVolumeByBodyPart(logs, bounds.previous);
  const currentTotal = bodyParts.reduce((sum, bodyPart) => sum + currentByBodyPart[bodyPart], 0);

  return bodyParts
    .map((bodyPart) => {
      const currentVolume = currentByBodyPart[bodyPart];
      const previousVolume = previousByBodyPart[bodyPart];
      const delta = currentVolume - previousVolume;
      const changeRate = getChangeRate(currentVolume, previousVolume);
      const bodyPartLogs = logs.filter((log) => log.bodyPart === bodyPart && log.date <= referenceDate).sort((a, b) => b.date.localeCompare(a.date));
      const lastTrainedDate = bodyPartLogs[0]?.date ?? null;
      const daysSinceLastTrained = lastTrainedDate ? diffDays(lastTrainedDate, referenceDate) : null;
      const weeklyShare = currentTotal > 0 ? Number(((currentVolume / currentTotal) * 100).toFixed(1)) : 0;
      const evidence: RecommendationEvidence[] = [];
      let score = 0;

      if (previousVolume > 0 && currentVolume < previousVolume) {
        evidence.push({ label: "지난주 대비", value: formatSignedPercent(changeRate) });
        score += Math.min(60, Math.abs(changeRate ?? 0));
      }

      if (daysSinceLastTrained === null) {
        evidence.push({ label: "마지막 기록", value: "기록 없음" });
        score += 45;
      } else if (daysSinceLastTrained >= 4) {
        evidence.push({ label: "마지막 기록", value: `${daysSinceLastTrained}일 전` });
        score += Math.min(35, daysSinceLastTrained * 4);
      }

      if (currentTotal > 0 && weeklyShare < 15) {
        evidence.push({ label: "이번 주 비중", value: `${weeklyShare}%` });
        score += 20 - weeklyShare;
      }

      if (currentVolume === 0 && previousVolume > 0) {
        evidence.push({ label: "이번 주", value: "0kg" });
        score += 30;
      }

      if (evidence.length === 0) {
        evidence.push({ label: "이번 주 볼륨", value: `${currentVolume}kg` });
      }

      const reason =
        previousVolume > 0 && currentVolume < previousVolume
          ? `지난주 같은 요일까지의 볼륨보다 ${formatSignedPercent(changeRate)} 낮습니다.`
          : daysSinceLastTrained === null
            ? "아직 이 부위의 기록이 없습니다."
            : daysSinceLastTrained >= 4
              ? `마지막 기록 후 ${daysSinceLastTrained}일이 지났습니다.`
              : "이번 주 전체 볼륨에서 차지하는 비중이 낮습니다.";

      return {
        bodyPart,
        reason,
        currentVolume,
        previousVolume,
        delta,
        changeRate,
        lastTrainedDate,
        daysSinceLastTrained,
        weeklyShare,
        evidence,
        score,
      };
    })
    .sort((a, b) => b.score - a.score || a.bodyPart.localeCompare(b.bodyPart))
    .slice(0, 3)
    .map(({ score: _score, ...item }) => item);
}

type ExerciseSessionSummary = {
  exerciseName: string;
  bodyPart: BodyPart;
  date: string;
  totalVolume: number;
  maxWeight: number;
  setCount: number;
  averageReps: number;
};

function summarizeExerciseSessions(logs: ExerciseLog[]): ExerciseSessionSummary[] {
  const sessions = new Map<string, ExerciseSessionSummary & { totalReps: number }>();

  for (const log of logs) {
    const key = `${log.exerciseName}:${log.date}`;
    const current = sessions.get(key) ?? {
      exerciseName: log.exerciseName,
      bodyPart: log.bodyPart,
      date: log.date,
      totalVolume: 0,
      maxWeight: 0,
      setCount: 0,
      averageReps: 0,
      totalReps: 0,
    };

    current.totalVolume += log.totalVolume;
    for (const set of log.sets) {
      current.maxWeight = Math.max(current.maxWeight, set.weight);
      current.setCount += 1;
      current.totalReps += set.reps;
    }
    current.averageReps = current.setCount > 0 ? Number((current.totalReps / current.setCount).toFixed(1)) : 0;
    sessions.set(key, current);
  }

  return Array.from(sessions.values()).map(({ totalReps: _totalReps, ...session }) => session);
}

function getExerciseProgressStatus(
  latest: ExerciseSessionSummary,
  previous: ExerciseSessionSummary,
  volumeChangeRate: number | null,
): { status: ExerciseProgressStatus; note: string } {
  const maxWeightDelta = latest.maxWeight - previous.maxWeight;
  const setCountDelta = latest.setCount - previous.setCount;

  if (maxWeightDelta > 0 && latest.totalVolume < previous.totalVolume) {
    return { status: "heavy_session", note: "최고 중량은 올랐지만 총 볼륨은 줄었습니다." };
  }

  if (maxWeightDelta > 0) {
    return { status: "weight_increase", note: "직전 세션보다 최고 중량이 올랐습니다." };
  }

  if ((volumeChangeRate ?? 0) >= 5) {
    return {
      status: "volume_increase",
      note: setCountDelta > 0 ? "세트 수 증가가 볼륨 상승에 영향을 줬습니다." : "직전 세션보다 총 볼륨이 늘었습니다.",
    };
  }

  if ((volumeChangeRate ?? 0) <= -5) {
    return { status: "volume_decrease", note: "직전 세션보다 총 볼륨이 줄었습니다." };
  }

  return { status: "maintained", note: "직전 세션과 비슷한 수행량을 유지했습니다." };
}

function buildExerciseProgressChanges(logs: ExerciseLog[]): ExerciseProgressChange[] {
  const sessionsByExercise = new Map<string, ExerciseSessionSummary[]>();

  for (const session of summarizeExerciseSessions(logs)) {
    const current = sessionsByExercise.get(session.exerciseName) ?? [];
    current.push(session);
    sessionsByExercise.set(session.exerciseName, current);
  }

  return Array.from(sessionsByExercise.entries())
    .map(([exerciseName, sessions]) => {
      const sortedSessions = sessions.sort((a, b) => b.date.localeCompare(a.date));
      const latest = sortedSessions[0];
      const previous = sortedSessions[1] ?? null;

      if (!previous) {
        return {
          exerciseName,
          bodyPart: latest.bodyPart,
          latestDate: latest.date,
          previousDate: null,
          latestVolume: latest.totalVolume,
          previousVolume: null,
          volumeChangeRate: null,
          latestMaxWeight: latest.maxWeight,
          previousMaxWeight: null,
          maxWeightDelta: null,
          latestSetCount: latest.setCount,
          previousSetCount: null,
          latestAverageReps: latest.averageReps,
          previousAverageReps: null,
          status: "insufficient",
          note: "비교할 이전 세션이 아직 없습니다.",
        } satisfies ExerciseProgressChange;
      }

      const volumeChangeRate = getChangeRate(latest.totalVolume, previous.totalVolume);
      const maxWeightDelta = latest.maxWeight - previous.maxWeight;
      const status = getExerciseProgressStatus(latest, previous, volumeChangeRate);

      return {
        exerciseName,
        bodyPart: latest.bodyPart,
        latestDate: latest.date,
        previousDate: previous.date,
        latestVolume: latest.totalVolume,
        previousVolume: previous.totalVolume,
        volumeChangeRate,
        latestMaxWeight: latest.maxWeight,
        previousMaxWeight: previous.maxWeight,
        maxWeightDelta,
        latestSetCount: latest.setCount,
        previousSetCount: previous.setCount,
        latestAverageReps: latest.averageReps,
        previousAverageReps: previous.averageReps,
        status: status.status,
        note: status.note,
      };
    })
    .sort((a, b) => b.latestDate.localeCompare(a.latestDate) || b.latestVolume - a.latestVolume);
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
    recommendedBodyParts: buildRecommendedBodyParts(logs, filter.referenceDate),
    weeklyVolumeTrend: buildWeeklyVolumeTrend(logs, filter.referenceDate),
    exerciseProgressChanges: buildExerciseProgressChanges(logs),
    filter,
  };
}
