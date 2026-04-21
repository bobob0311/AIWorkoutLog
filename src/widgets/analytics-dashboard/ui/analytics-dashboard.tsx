"use client";

import { useMemo, useState } from "react";
import {
  buildAnalyticsViewModel,
  type AnalyticsFilter,
  type AnalyticsRange,
} from "@/entities/analytics/model/analytics-service";
import type { ExerciseLog } from "@/entities/exercise-log/model/types";
import { AppNavigation } from "@/widgets/app-navigation/ui/app-navigation";
import { AnalyticsComparisonView } from "./analytics-comparison-view";
import { Header, Page, PageTitle, Description, ViewLink, ViewSwitch } from "./analytics-dashboard.styles";
import { AnalyticsRangeFilter } from "./analytics-range-filter";
import { AnalyticsStatsView } from "./analytics-stats-view";

type AnalyticsView = "stats" | "comparison";

type AnalyticsDashboardProps = {
  logs: ExerciseLog[];
  referenceDate: string;
  view?: AnalyticsView;
};

function getPageCopy(view: AnalyticsView) {
  if (view === "comparison") {
    return {
      title: "운동 비교",
      description: "지난 기록과 비교해 오늘 어떤 부위를 보완할지, 주요 운동 수행량이 어떻게 바뀌었는지 확인합니다.",
    };
  }

  return {
    title: "운동 통계",
    description: "선택한 기간의 총 볼륨, 세트 수, 부위별 비중, 운동 랭킹을 간단하게 확인합니다.",
  };
}

export function AnalyticsDashboard({ logs, referenceDate, view = "stats" }: AnalyticsDashboardProps) {
  const [preset, setPreset] = useState<AnalyticsRange>("week");
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
  const copy = getPageCopy(view);

  return (
    <Page>
      <AppNavigation current={view === "comparison" ? "comparison" : "analytics"} />

      <Header>
        <PageTitle>{copy.title}</PageTitle>
        <Description>{copy.description}</Description>
      </Header>

      <ViewSwitch aria-label="통계와 비교 화면 전환">
        <ViewLink href="/analytics" $active={view === "stats"}>
          통계 보기
        </ViewLink>
        <ViewLink href="/analytics/compare" $active={view === "comparison"}>
          비교 보기
        </ViewLink>
      </ViewSwitch>

      <AnalyticsRangeFilter
        preset={preset}
        draftStartDate={draftStartDate}
        draftEndDate={draftEndDate}
        onPresetChange={setPreset}
        onDraftStartDateChange={setDraftStartDate}
        onDraftEndDateChange={setDraftEndDate}
        onApplyCustomRange={() => setCustomRange({ startDate: draftStartDate, endDate: draftEndDate })}
      />

      {view === "stats" ? <AnalyticsStatsView viewModel={viewModel} /> : <AnalyticsComparisonView viewModel={viewModel} referenceDate={referenceDate} />}
    </Page>
  );
}
