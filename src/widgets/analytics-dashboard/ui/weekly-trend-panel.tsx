import type { WeeklyVolumeTrend } from "@/entities/analytics/model/analytics-service";
import { bodyPartLabels } from "@/shared/lib/body-part";
import { bodyPartColors } from "@/shared/lib/body-part-colors";
import { BarFill, BarRow, BarTrack, Card, CardGrid, Description, Label, Section, SectionHeader, SectionTitle, StatusPill, Value, WeekBar, WeekBarFill, WeekBars } from "./analytics-dashboard.styles";
import { formatChangeRate, formatDelta, formatTrendStatus } from "./analytics-formatters";

type WeeklyTrendPanelProps = {
  trend: WeeklyVolumeTrend;
  variant: "stats" | "comparison";
};

export function WeeklyTrendPanel({ trend, variant }: WeeklyTrendPanelProps) {
  const maxRecentWeekVolume = Math.max(...trend.recentWeeks.map((week) => week.totalVolume), 1);

  if (variant === "stats") {
    return (
      <Section aria-label="최근 주간 볼륨 흐름">
        <SectionHeader>
          <div>
            <SectionTitle>최근 주간 볼륨 흐름</SectionTitle>
            <Description>완료된 최근 4주를 기준으로 전체 운동량 흐름을 봅니다.</Description>
          </div>
        </SectionHeader>
        <WeekBars aria-label="최근 4주 볼륨 막대">
          {trend.recentWeeks.map((week) => (
            <WeekBar key={`${week.startDate}-${week.endDate}`}>
              <WeekBarFill $height={(week.totalVolume / maxRecentWeekVolume) * 80} />
              <Label>{week.totalVolume}kg</Label>
            </WeekBar>
          ))}
        </WeekBars>
      </Section>
    );
  }

  return (
    <Section aria-label="이번 주 비교">
      <SectionHeader>
        <div>
          <SectionTitle>이번 주 비교</SectionTitle>
          <Description>
            {trend.currentStartDate} - {trend.currentEndDate}와 {trend.previousStartDate} - {trend.previousEndDate}를 비교합니다.
          </Description>
        </div>
        <StatusPill $status={trend.status}>{formatTrendStatus(trend.status)}</StatusPill>
      </SectionHeader>
      <CardGrid>
        <Card>
          <Label>이번 주</Label>
          <Value>{trend.currentWeekVolume}kg</Value>
        </Card>
        <Card>
          <Label>지난주 같은 기간</Label>
          <Value>{trend.previousComparableVolume}kg</Value>
        </Card>
        <Card>
          <Label>볼륨 차이</Label>
          <Value>{formatDelta(trend.delta)}</Value>
        </Card>
        <Card>
          <Label>변화율</Label>
          <Value>{formatChangeRate(trend.changeRate)}</Value>
        </Card>
      </CardGrid>
      {trend.byBodyPart.map((item) => (
        <BarRow key={`trend-${item.bodyPart}`}>
          <strong>{bodyPartLabels[item.bodyPart]}</strong>
          <BarTrack>
            <BarFill $width={trend.currentWeekVolume ? (item.currentVolume / trend.currentWeekVolume) * 100 : 0} $color={bodyPartColors[item.bodyPart]} />
          </BarTrack>
          <strong>{formatChangeRate(item.changeRate)}</strong>
        </BarRow>
      ))}
    </Section>
  );
}
