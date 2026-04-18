"use client";

import styled from "@emotion/styled";
import type { MonthlySummary } from "@/entities/calendar-day/model/types";
import { bodyPartLabels } from "@/shared/lib/body-part";

type MonthSummaryProps = {
  summary: MonthlySummary;
};

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

const Value = styled.strong`
  font-size: 24px;
  color: #111827;
`;

export function MonthSummary({ summary }: MonthSummaryProps) {
  return (
    <Grid>
      <Card>
        <Label>이번 달 운동일</Label>
        <Value>{summary.activeDays}일</Value>
      </Card>
      <Card>
        <Label>이번 달 총 볼륨</Label>
        <Value>{summary.totalVolume}kg</Value>
      </Card>
      <Card>
        <Label>가장 많이 한 부위</Label>
        <Value>{summary.topBodyPart ? bodyPartLabels[summary.topBodyPart] : "-"}</Value>
      </Card>
    </Grid>
  );
}
