import type { ExerciseProgressStatus, TrendStatus } from "@/entities/analytics/model/analytics-service";

export function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta}kg`;
  if (delta < 0) return `${delta}kg`;
  return "변화 없음";
}

export function formatChangeRate(changeRate: number | null): string {
  if (changeRate === null) return "비교 기준 없음";
  if (changeRate > 0) return `+${changeRate}%`;
  if (changeRate < 0) return `${changeRate}%`;
  return "0%";
}

export function formatTrendStatus(status: TrendStatus): string {
  if (status === "increase") return "증가";
  if (status === "decrease") return "감소";
  return "유지";
}

export function formatProgressStatus(status: ExerciseProgressStatus): string {
  if (status === "weight_increase") return "중량 증가";
  if (status === "volume_increase") return "볼륨 증가";
  if (status === "volume_decrease") return "볼륨 감소";
  if (status === "heavy_session") return "고중량 세션";
  if (status === "insufficient") return "비교 부족";
  return "수행 유지";
}
