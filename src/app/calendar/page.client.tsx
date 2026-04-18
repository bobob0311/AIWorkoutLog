"use client";

import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { buildCalendarDays, getMonthlySummary } from "@/entities/calendar-day/model/calendar-service";
import type { DailyWorkoutSummary } from "@/entities/calendar-day/model/types";
import type { BodyPart, ExerciseLogDraft } from "@/entities/exercise-log/model/types";
import {
  addUserExercise,
  deleteExerciseLog,
  getExerciseLogs,
  getExerciseLogsByDate,
  getExerciseOptions,
  saveExerciseLog,
} from "@/shared/lib/mock-record-storage";
import { AppNavigation } from "@/widgets/app-navigation/ui/app-navigation";
import { CalendarGrid } from "@/widgets/calendar-grid/ui/calendar-grid";
import { MonthSummary } from "@/widgets/day-summary/ui/month-summary";
import { DailyRecordPanel } from "@/widgets/daily-record-panel/ui/daily-record-panel";

const PageWrap = styled.main`
  min-height: 100vh;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MonthToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const MonthActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const MonthButton = styled.button`
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

function buildDailySummaries(logs: ReturnType<typeof getExerciseLogs>): DailyWorkoutSummary[] {
  const map = new Map<
    string,
    {
      totalVolume: number;
      bodyPartVolumes: Partial<Record<BodyPart, number>>;
    }
  >();

  for (const log of logs) {
    const current = map.get(log.date) ?? { totalVolume: 0, bodyPartVolumes: {} };
    current.totalVolume += log.totalVolume;
    current.bodyPartVolumes[log.bodyPart] = (current.bodyPartVolumes[log.bodyPart] ?? 0) + log.totalVolume;
    map.set(log.date, current);
  }

  return Array.from(map.entries()).map(([date, value]) => ({
    date,
    totalVolume: value.totalVolume,
    bodyPartVolumes: value.bodyPartVolumes,
  }));
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(base: Date, amount: number): Date {
  return new Date(base.getFullYear(), base.getMonth() + amount, 1);
}

function formatMonthLabel(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

type CalendarClientPageProps = {
  currentMonthDate?: Date;
};

export function CalendarClientPage({ currentMonthDate }: CalendarClientPageProps) {
  const [refreshToken, setRefreshToken] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const today = currentMonthDate ?? new Date();
  const [visibleMonth, setVisibleMonth] = useState(() => getMonthStart(today));

  const logs = useMemo(() => getExerciseLogs(), [refreshToken]);
  const dailySummaries = useMemo(() => buildDailySummaries(logs), [logs]);
  const exerciseOptions = useMemo(() => getExerciseOptions(), [refreshToken]);
  const selectedDateLogs = useMemo(() => (selectedDate ? getExerciseLogsByDate(selectedDate) : []), [refreshToken, selectedDate]);

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth() + 1;
  const monthLabel = formatMonthLabel(visibleMonth);
  const days = useMemo(
    () =>
      buildCalendarDays({
        year,
        month,
        records: dailySummaries,
      }),
    [dailySummaries, month, year],
  );
  const summary = useMemo(
    () =>
      getMonthlySummary({
        year,
        month,
        records: dailySummaries,
      }),
    [dailySummaries, month, year],
  );

  return (
    <PageWrap>
      <AppNavigation current="calendar" />
      <Hero>
        <h1 style={{ margin: 0, fontSize: "32px" }}>월간 운동 기록</h1>
        <p style={{ margin: 0, color: "#4b5563" }}>
          운동한 날짜와 부위별 볼륨을 확인하고, 날짜를 눌러 기록 모달을 열 수 있습니다.
        </p>
      </Hero>

      <MonthToolbar>
        <strong aria-label="현재 보고 있는 월" style={{ fontSize: "20px", color: "#111827" }}>
          {monthLabel}
        </strong>
        <MonthActions>
          <MonthButton type="button" onClick={() => setVisibleMonth((current) => addMonths(current, -1))}>
            이전 달
          </MonthButton>
          <MonthButton type="button" onClick={() => setVisibleMonth(getMonthStart(today))}>
            이번 달
          </MonthButton>
          <MonthButton type="button" onClick={() => setVisibleMonth((current) => addMonths(current, 1))}>
            다음 달
          </MonthButton>
        </MonthActions>
      </MonthToolbar>

      <MonthSummary summary={summary} />
      <CalendarGrid monthLabel={monthLabel} days={days} onSelectDate={setSelectedDate} />

      {selectedDate ? (
        <DailyRecordPanel
          mode="modal"
          date={selectedDate}
          logs={selectedDateLogs}
          exerciseOptions={exerciseOptions}
          onClose={() => setSelectedDate(null)}
          onSave={(draft: ExerciseLogDraft) => {
            saveExerciseLog(draft);
            setRefreshToken((value) => value + 1);
          }}
          onDelete={(id) => {
            deleteExerciseLog(id);
            setRefreshToken((value) => value + 1);
          }}
          onAddCustomExercise={({ name, bodyPart }: { name: string; bodyPart: BodyPart }) => {
            const option = addUserExercise({ name, bodyPart });
            setRefreshToken((value) => value + 1);
            return option;
          }}
        />
      ) : null}
    </PageWrap>
  );
}
