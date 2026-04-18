export type BodyPart = "chest" | "back" | "legs" | "shoulders" | "arms" | "core";

export type ExerciseSource = "base" | "user";

export type ExerciseOption = {
  id: string;
  name: string;
  bodyPart: BodyPart;
  source: ExerciseSource;
};

export type ExerciseSetInput = {
  setOrder: number;
  weight: number;
  reps: number;
};

export type ExerciseSet = ExerciseSetInput & {
  volume: number;
};

export type ExerciseLog = {
  id: string;
  date: string;
  bodyPart: BodyPart;
  exerciseName: string;
  exerciseSource: ExerciseSource;
  memo: string;
  sets: ExerciseSet[];
  totalVolume: number;
};

export type ExerciseLogDraft = {
  id?: string;
  date: string;
  bodyPart: BodyPart;
  exerciseName: string;
  exerciseSource: ExerciseSource;
  memo: string;
  sets: ExerciseSetInput[];
};

