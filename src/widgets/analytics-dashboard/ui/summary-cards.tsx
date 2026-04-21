import type { AnalyticsSummary } from "@/entities/analytics/model/analytics-service";
import { bodyPartLabels } from "@/shared/lib/body-part";
import { Card, CardGrid, Label, Value } from "./analytics-dashboard.styles";

type SummaryCardsProps = {
  summary: AnalyticsSummary;
};

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <CardGrid aria-label="통계 요약">
      <Card>
        <Label>총 볼륨</Label>
        <Value>{summary.totalVolume}kg</Value>
      </Card>
      <Card>
        <Label>운동 수</Label>
        <Value>{summary.exerciseCount}</Value>
      </Card>
      <Card>
        <Label>세트 수</Label>
        <Value>{summary.setCount}</Value>
      </Card>
      <Card>
        <Label>가장 많이 한 부위</Label>
        <Value aria-label="가장 많이 한 부위">{summary.topBodyPart ? bodyPartLabels[summary.topBodyPart] : "-"}</Value>
      </Card>
    </CardGrid>
  );
}
