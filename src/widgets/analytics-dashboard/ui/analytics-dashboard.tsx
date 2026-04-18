"use client";

import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { buildAnalyticsViewModel, type AnalyticsFilter, type AnalyticsRange } from "@/entities/analytics/model/analytics-service";
import type { ExerciseLog } from "@/entities/exercise-log/model/types";
import { bodyPartLabels } from "@/shared/lib/body-part";
import { AppNavigation } from "@/widgets/app-navigation/ui/app-navigation";

type AnalyticsDashboardProps = {
  logs: ExerciseLog[];
  referenceDate: string;
};

const Page = styled.main`
  min-height: 100vh;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const TabRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const TabButton = styled.button<{ $active: boolean }>`
  border: ${({ $active }) => ($active ? "none" : "1px solid #d1d5db")};
  background: ${({ $active }) => ($active ? "#111827" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#111827")};
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

const RangePanel = styled.section`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RangeRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #374151;
`;

const Input = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
`;

const ActionButton = styled.button`
  border: none;
  background: #111827;
  color: #ffffff;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-end;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CardGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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

const InsightGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const List = styled.section`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InsightItem = styled.article`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BarRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 90px;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 72px 1fr 72px;
    gap: 8px;
  }
`;

const BarTrack = styled.div`
  height: 12px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $width: number; $color?: string }>`
  width: ${({ $width }) => `${$width}%`};
  height: 100%;
  background: ${({ $color }) => $color ?? "#6366f1"};
  border-radius: 999px;
`;

const ComparisonRow = styled.article`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px 16px;
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const ComparisonMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #4b5563;
  font-size: 13px;
`;

const DeltaText = styled.strong<{ $positive: boolean; $neutral: boolean }>`
  color: ${({ $positive, $neutral }) => ($neutral ? "#111827" : $positive ? "#15803d" : "#be123c")};
  font-size: 14px;
`;

const RankingRow = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 180px) 1fr 90px;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const RankingMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const tabs: Array<{ label: string; value: AnalyticsRange; ariaLabel: string }> = [
  { label: "일", value: "day", ariaLabel: "일간 통계 보기" },
  { label: "주", value: "week", ariaLabel: "주간 통계 보기" },
  { label: "월", value: "month", ariaLabel: "월간 통계 보기" },
  { label: "직접 기간", value: "custom", ariaLabel: "직접 기간 통계 보기" },
];

function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta}kg`;
  if (delta < 0) return `${delta}kg`;
  return "변화 없음";
}

function formatChangeRate(changeRate: number | null): string {
  if (changeRate === null) return "비교 기준 없음";
  if (changeRate > 0) return `+${changeRate}%`;
  if (changeRate < 0) return `${changeRate}%`;
  return "0%";
}

export function AnalyticsDashboard({ logs, referenceDate }: AnalyticsDashboardProps) {
  const [preset, setPreset] = useState<AnalyticsRange>("day");
  const [draftStartDate, setDraftStartDate] = useState(referenceDate);
  const [draftEndDate, setDraftEndDate] = useState(referenceDate);
  const [customRange, setCustomRange] = useState({
    startDate: referenceDate,
    endDate: referenceDate,
  });

  const filter: AnalyticsFilter = useMemo(
    () => ({
      preset,
      referenceDate,
      startDate: preset === "custom" ? customRange.startDate : undefined,
      endDate: preset === "custom" ? customRange.endDate : undefined,
    }),
    [customRange.endDate, customRange.startDate, preset, referenceDate],
  );

  const viewModel = useMemo(() => buildAnalyticsViewModel(logs, filter), [filter, logs]);
  const maxBodyPartVolume = viewModel.byBodyPart[0]?.totalVolume ?? 1;
  const maxExerciseVolume = viewModel.exerciseRanking[0]?.totalVolume ?? 1;

  return (
    <Page>
      <AppNavigation current="analytics" />

      <div>
        <h1 style={{ margin: 0, fontSize: "32px" }}>부위별 볼륨 통계</h1>
        <p style={{ margin: "8px 0 0", color: "#4b5563" }}>
          일, 주, 월 또는 직접 기간 기준으로 운동 볼륨을 보고, 저번 기간과 비교해 어디에 집중했는지 확인하세요.
        </p>
      </div>

      <TabRow>
        {tabs.map((tab) => (
          <TabButton
            key={tab.value}
            type="button"
            $active={preset === tab.value}
            onClick={() => setPreset(tab.value)}
            aria-label={tab.ariaLabel}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabRow>

      {preset === "custom" ? (
        <RangePanel>
          <strong>직접 기간 설정</strong>
          <RangeRow>
            <Field>
              <span>시작일</span>
              <Input aria-label="시작일" type="date" value={draftStartDate} onChange={(event) => setDraftStartDate(event.target.value)} />
            </Field>
            <Field>
              <span>종료일</span>
              <Input aria-label="종료일" type="date" value={draftEndDate} onChange={(event) => setDraftEndDate(event.target.value)} />
            </Field>
            <ActionButton
              type="button"
              onClick={() =>
                setCustomRange({
                  startDate: draftStartDate,
                  endDate: draftEndDate,
                })
              }
            >
              기간 적용
            </ActionButton>
          </RangeRow>
        </RangePanel>
      ) : null}

      <CardGrid>
        <Card>
          <Label>총 볼륨</Label>
          <Value>{viewModel.summary.totalVolume}kg</Value>
        </Card>
        <Card>
          <Label>총 운동 수</Label>
          <Value>{viewModel.summary.exerciseCount}</Value>
        </Card>
        <Card>
          <Label>총 세트 수</Label>
          <Value>{viewModel.summary.setCount}</Value>
        </Card>
        <Card>
          <Label>최다 부위</Label>
          <Value aria-label="최다 운동 부위">
            {viewModel.summary.topBodyPart ? bodyPartLabels[viewModel.summary.topBodyPart] : "-"}
          </Value>
        </Card>
      </CardGrid>

      <InsightGrid>
        <List aria-label="집중 부위 목록">
          <strong>많이 한 부위</strong>
          {viewModel.focusedBodyParts.length ? (
            viewModel.focusedBodyParts.map((item) => (
              <InsightItem key={item.bodyPart}>
                <strong>{bodyPartLabels[item.bodyPart]}</strong>
                <span>{item.reason}</span>
                <span>
                  현재 {item.currentVolume}kg / 이전 {item.previousVolume}kg
                </span>
              </InsightItem>
            ))
          ) : (
            <span>집중 부위를 계산할 데이터가 없습니다.</span>
          )}
        </List>

        <List aria-label="부족 부위 목록">
          <strong>부족 부위</strong>
          {viewModel.undertrainedBodyParts.length ? (
            viewModel.undertrainedBodyParts.map((item) => (
              <InsightItem key={item.bodyPart}>
                <strong>{bodyPartLabels[item.bodyPart]}</strong>
                <span>{item.reason}</span>
                <span>
                  현재 {item.currentVolume}kg / 이전 {item.previousVolume}kg
                </span>
              </InsightItem>
            ))
          ) : (
            <span>계산 가능한 부족 부위가 없습니다.</span>
          )}
        </List>
      </InsightGrid>

      <List aria-label="부위별 비교 목록">
        <strong>부위별 비교</strong>
        {viewModel.comparisons.map((item) => (
          <ComparisonRow key={item.bodyPart}>
            <strong>{bodyPartLabels[item.bodyPart]}</strong>
            <ComparisonMeta>
              <span>이번 {item.currentVolume}kg</span>
              <span>저번 {item.previousVolume}kg</span>
            </ComparisonMeta>
            <DeltaText $positive={item.delta > 0} $neutral={item.delta === 0}>
              {formatDelta(item.delta)} / {formatChangeRate(item.changeRate)}
            </DeltaText>
          </ComparisonRow>
        ))}
      </List>

      <List aria-label="운동 랭킹 차트">
        <strong>운동 랭킹</strong>
        {viewModel.exerciseRanking.map((item) => (
          <RankingRow key={`${item.bodyPart}-${item.exerciseName}`}>
            <RankingMeta>
              <strong>{item.exerciseName}</strong>
              <span>{bodyPartLabels[item.bodyPart]}</span>
            </RankingMeta>
            <BarTrack>
              <BarFill
                $width={(item.totalVolume / maxExerciseVolume) * 100}
                $color={item.color}
                aria-label={`${item.exerciseName} ${bodyPartLabels[item.bodyPart]} ${item.totalVolume}kg`}
              />
            </BarTrack>
            <strong>{item.totalVolume}kg</strong>
          </RankingRow>
        ))}
      </List>

      <List aria-label="부위별 볼륨 목록">
        <strong>부위별 볼륨</strong>
        {viewModel.byBodyPart.map((item) => (
          <BarRow key={item.bodyPart}>
            <span>{bodyPartLabels[item.bodyPart]}</span>
            <BarTrack>
              <BarFill $width={(item.totalVolume / maxBodyPartVolume) * 100} />
            </BarTrack>
            <strong>{item.totalVolume}kg</strong>
          </BarRow>
        ))}
      </List>
    </Page>
  );
}
