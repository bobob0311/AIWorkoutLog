export type BodyPartVolumeMap = Partial<Record<BodyPart, number>>;

export type BodyPart = "chest" | "back" | "legs" | "shoulders" | "arms" | "core";

export type DailyWorkoutSummary = {
  date: string;
  totalVolume: number;
  bodyPartVolumes: BodyPartVolumeMap;
};

export type BodyPartChartSegment = {
  bodyPart: BodyPart;
  volume: number;
  ratio: number;
  color: string;
};

export type CalendarDay = {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  hasRecord: boolean;
  totalVolume: number;
  bodyPartVolumes: BodyPartVolumeMap;
  bodyPartChartSegments: BodyPartChartSegment[];
};

export type MonthlySummary = {
  activeDays: number;
  totalVolume: number;
  topBodyPart: BodyPart | null;
};
