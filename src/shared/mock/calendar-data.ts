import type { DailyWorkoutSummary } from "@/entities/calendar-day/model/types";

export const mockDailyWorkoutSummaries: DailyWorkoutSummary[] = [
  {
    date: "2026-04-03",
    totalVolume: 5000,
    bodyPartVolumes: {
      chest: 3200,
      arms: 1800,
    },
  },
  {
    date: "2026-04-08",
    totalVolume: 4600,
    bodyPartVolumes: {
      legs: 4600,
    },
  },
  {
    date: "2026-04-14",
    totalVolume: 4200,
    bodyPartVolumes: {
      back: 2600,
      shoulders: 1600,
    },
  },
  {
    date: "2026-04-19",
    totalVolume: 3900,
    bodyPartVolumes: {
      core: 1200,
      chest: 2700,
    },
  },
];

