"use client";

import { useMemo } from "react";
import { getTodayDateKey } from "@/shared/lib/date";
import { getExerciseLogs } from "@/shared/lib/mock-record-storage";
import { AnalyticsDashboard } from "@/widgets/analytics-dashboard/ui/analytics-dashboard";

interface AnalyticsCompareClientPageProps {
  referenceDate?: string;
}

export function AnalyticsCompareClientPage({ referenceDate: injectedReferenceDate }: AnalyticsCompareClientPageProps = {}) {
  const logs = useMemo(() => getExerciseLogs(), []);
  const referenceDate = useMemo(() => injectedReferenceDate ?? getTodayDateKey(), [injectedReferenceDate]);

  return <AnalyticsDashboard logs={logs} referenceDate={referenceDate} view="comparison" />;
}
