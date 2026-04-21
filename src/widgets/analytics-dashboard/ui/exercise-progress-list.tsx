import type { ExerciseProgressChange } from "@/entities/analytics/model/analytics-service";
import { bodyPartLabels } from "@/shared/lib/body-part";
import { bodyPartColors } from "@/shared/lib/body-part-colors";
import { ComparisonCard, ComparisonGrid, Description, Metric, MetricRow, Section, SectionHeader, SectionTitle, StatusPill } from "./analytics-dashboard.styles";
import { formatProgressStatus } from "./analytics-formatters";

type ExerciseProgressListProps = {
  items: ExerciseProgressChange[];
};

export function ExerciseProgressList({ items }: ExerciseProgressListProps) {
  return (
    <Section aria-label="운동별 수행 변화">
      <SectionHeader>
        <div>
          <SectionTitle>운동별 수행 변화</SectionTitle>
          <Description>같은 운동의 최근 2회 세션을 비교합니다. 중량, 볼륨, 반복 수를 같이 봐야 의미가 분명합니다.</Description>
        </div>
      </SectionHeader>
      <ComparisonGrid>
        {items.map((item) => (
          <ComparisonCard key={`${item.exerciseName}-${item.latestDate}`} $color={bodyPartColors[item.bodyPart]}>
            <div>
              <strong>{item.exerciseName}</strong>
              <Description>
                {bodyPartLabels[item.bodyPart]} · {item.latestDate}
                {item.previousDate ? ` vs ${item.previousDate}` : ""}
              </Description>
            </div>
            <StatusPill $status={item.status}>{formatProgressStatus(item.status)}</StatusPill>
            <MetricRow>
              <Metric>
                <span>총 볼륨</span>
                <strong>
                  {item.latestVolume}kg{item.previousVolume !== null ? ` / ${item.previousVolume}kg` : ""}
                </strong>
              </Metric>
              <Metric>
                <span>최고 중량</span>
                <strong>
                  {item.latestMaxWeight}kg{item.previousMaxWeight !== null ? ` / ${item.previousMaxWeight}kg` : ""}
                </strong>
              </Metric>
              <Metric>
                <span>평균 반복</span>
                <strong>
                  {item.latestAverageReps}
                  {item.previousAverageReps !== null ? ` / ${item.previousAverageReps}` : ""}
                </strong>
              </Metric>
            </MetricRow>
            <Description>{item.note}</Description>
          </ComparisonCard>
        ))}
      </ComparisonGrid>
    </Section>
  );
}
