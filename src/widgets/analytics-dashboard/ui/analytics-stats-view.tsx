import type { AnalyticsViewModel } from "@/entities/analytics/model/analytics-service";
import { BodyPartVolumeList } from "./body-part-volume-list";
import { ExerciseRankingList } from "./exercise-ranking-list";
import { SummaryCards } from "./summary-cards";
import { WeeklyTrendPanel } from "./weekly-trend-panel";

type AnalyticsStatsViewProps = {
  viewModel: AnalyticsViewModel;
};

export function AnalyticsStatsView({ viewModel }: AnalyticsStatsViewProps) {
  return (
    <>
      <SummaryCards summary={viewModel.summary} />
      <WeeklyTrendPanel trend={viewModel.weeklyVolumeTrend} variant="stats" />
      <BodyPartVolumeList items={viewModel.byBodyPart} />
      <ExerciseRankingList items={viewModel.exerciseRanking} />
    </>
  );
}
