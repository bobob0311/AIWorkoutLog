import type { AnalyticsViewModel } from "@/entities/analytics/model/analytics-service";
import { bodyPartLabels } from "@/shared/lib/body-part";
import { BarRow, CtaLink, Description, EvidenceChip, EvidenceGrid, Label, RecommendationPanel, RecommendationTitle, Section, SectionTitle } from "./analytics-dashboard.styles";
import { formatChangeRate, formatDelta } from "./analytics-formatters";
import { ExerciseProgressList } from "./exercise-progress-list";
import { WeeklyTrendPanel } from "./weekly-trend-panel";

type AnalyticsComparisonViewProps = {
  viewModel: AnalyticsViewModel;
  referenceDate: string;
};

function getTodayPath(referenceDate: string) {
  return `/calendar/${referenceDate}`;
}

export function AnalyticsComparisonView({ viewModel, referenceDate }: AnalyticsComparisonViewProps) {
  const topRecommendation = viewModel.recommendedBodyParts[0];

  return (
    <>
      <RecommendationPanel aria-label="다음 운동 추천">
        <div>
          <Label>다음 운동 추천</Label>
          {topRecommendation ? (
            <>
              <RecommendationTitle>{bodyPartLabels[topRecommendation.bodyPart]} 보완</RecommendationTitle>
              <Description>{topRecommendation.reason}</Description>
              <EvidenceGrid>
                {topRecommendation.evidence.map((item) => (
                  <EvidenceChip key={`${item.label}-${item.value}`}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </EvidenceChip>
                ))}
              </EvidenceGrid>
            </>
          ) : (
            <Description>추천을 만들 기록이 아직 부족합니다.</Description>
          )}
        </div>
        <CtaLink href={getTodayPath(referenceDate)}>오늘 기록하기</CtaLink>
      </RecommendationPanel>

      <WeeklyTrendPanel trend={viewModel.weeklyVolumeTrend} variant="comparison" />
      <ExerciseProgressList items={viewModel.exerciseProgressChanges} />

      <Section aria-label="부위별 이전 기간 비교">
        <SectionTitle>부위별 이전 기간 비교</SectionTitle>
        {viewModel.comparisons.map((item) => (
          <BarRow key={item.bodyPart}>
            <strong>{bodyPartLabels[item.bodyPart]}</strong>
            <Description>
              이번 {item.currentVolume}kg / 이전 {item.previousVolume}kg
            </Description>
            <strong>
              {formatDelta(item.delta)} · {formatChangeRate(item.changeRate)}
            </strong>
          </BarRow>
        ))}
      </Section>
    </>
  );
}
