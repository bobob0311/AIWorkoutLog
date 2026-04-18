"use client";

import Link from "next/link";
import styled from "@emotion/styled";
import type { CalendarDay } from "@/entities/calendar-day/model/types";
import { bodyPartLabels } from "@/shared/lib/body-part";

type CalendarGridProps = {
  monthLabel: string;
  days: CalendarDay[];
  onSelectDate?: (date: string) => void;
};

const Wrap = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
`;

const ScrollArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
  min-width: 720px;
`;

const CellBase = `
  min-height: 128px;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  text-decoration: none;
`;

const CellLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "$currentMonth" && prop !== "$hasRecord",
})<{ $currentMonth: boolean; $hasRecord: boolean }>`
  ${CellBase}
  border: 1px solid ${({ $hasRecord }) => ($hasRecord ? "#c7d2fe" : "#e5e7eb")};
  background: ${({ $hasRecord, $currentMonth }) => ($hasRecord ? "#eef2ff" : $currentMonth ? "#ffffff" : "#f9fafb")};
  color: ${({ $currentMonth }) => ($currentMonth ? "#111827" : "#9ca3af")};
`;

const CellButton = styled.button<{ $currentMonth: boolean; $hasRecord: boolean }>`
  ${CellBase}
  border: 1px solid ${({ $hasRecord }) => ($hasRecord ? "#c7d2fe" : "#e5e7eb")};
  background: ${({ $hasRecord, $currentMonth }) => ($hasRecord ? "#eef2ff" : $currentMonth ? "#ffffff" : "#f9fafb")};
  color: ${({ $currentMonth }) => ($currentMonth ? "#111827" : "#9ca3af")};
  cursor: pointer;
`;

const CellTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const DayNumber = styled.strong`
  font-size: 14px;
`;

const CellContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
`;

const VolumeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: #111827;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  align-self: flex-end;
  margin-top: auto;
`;

const EmptyText = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const ChartWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SegmentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SegmentLabel = styled.span`
  width: 32px;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  color: #111827;
  text-align: left;
`;

const SegmentTrack = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  height: 8px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
`;

const SegmentBar = styled.div<{ $width: number; $color: string }>`
  height: 8px;
  width: ${({ $width }) => `${Math.max($width * 100, 10)}%`};
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;

const SegmentValue = styled.span`
  font-size: 11px;
  color: #374151;
  font-weight: 700;
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
  min-width: 720px;
`;

const WeekLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  text-align: center;
`;

function renderChart(day: CalendarDay) {
  if (!day.bodyPartChartSegments.length) {
    return <EmptyText>{day.isCurrentMonth ? "기록 없음" : "다른 달"}</EmptyText>;
  }

  return (
    <ChartWrap aria-label={`${day.date} 부위별 볼륨 차트`}>
      {day.bodyPartChartSegments.map((segment) => (
        <SegmentRow key={`${day.date}-${segment.bodyPart}`}>
          <SegmentLabel>{bodyPartLabels[segment.bodyPart]}</SegmentLabel>
          <SegmentTrack>
            <SegmentBar
              $width={segment.ratio}
              $color={segment.color}
              aria-label={`${day.date} ${bodyPartLabels[segment.bodyPart]} ${segment.volume}kg`}
            />
          </SegmentTrack>
          <SegmentValue>{segment.volume}kg</SegmentValue>
        </SegmentRow>
      ))}
    </ChartWrap>
  );
}

export function CalendarGrid({ monthLabel, days, onSelectDate }: CalendarGridProps) {
  return (
    <Wrap>
      <Header>
        <Title>{monthLabel}</Title>
      </Header>

      <ScrollArea>
        <WeekHeader>
          {["일", "월", "화", "수", "목", "금", "토"].map((label) => (
            <WeekLabel key={label}>{label}</WeekLabel>
          ))}
        </WeekHeader>

        <Grid>
          {days.map((day) => {
            const content = (
              <>
                <CellTop>
                  <DayNumber>{day.dayNumber}</DayNumber>
                </CellTop>
                <CellContent>
                  {renderChart(day)}
                  {day.hasRecord ? <VolumeBadge>총 {day.totalVolume}kg</VolumeBadge> : null}
                </CellContent>
              </>
            );

            if (onSelectDate) {
              return (
                <CellButton
                  key={day.date}
                  type="button"
                  aria-label={day.date}
                  $currentMonth={day.isCurrentMonth}
                  $hasRecord={day.hasRecord}
                  onClick={() => onSelectDate(day.date)}
                >
                  {content}
                </CellButton>
              );
            }

            return (
              <CellLink
                key={day.date}
                href={`/calendar/${day.date}`}
                aria-label={day.date}
                $currentMonth={day.isCurrentMonth}
                $hasRecord={day.hasRecord}
              >
                {content}
              </CellLink>
            );
          })}
        </Grid>
      </ScrollArea>
    </Wrap>
  );
}
