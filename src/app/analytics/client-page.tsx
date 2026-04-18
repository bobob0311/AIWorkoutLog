"use client";

import { useMemo } from "react";
import { AnalyticsDashboard } from "@/widgets/analytics-dashboard/ui/analytics-dashboard";
import { getExerciseLogs } from "@/shared/lib/mock-record-storage";

export function AnalyticsClientPage() {
  const logs = useMemo(() => getExerciseLogs(), []);

  return <AnalyticsDashboard logs={logs} referenceDate="2026-04-14" />;
}

