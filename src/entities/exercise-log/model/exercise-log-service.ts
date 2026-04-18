import type { BodyPart, ExerciseLogDraft, ExerciseOption, ExerciseSetInput } from "./types";

export function calculateSetVolume(set: Pick<ExerciseSetInput, "weight" | "reps">): number {
  return set.weight * set.reps;
}

export function calculateExerciseVolume(sets: ExerciseSetInput[]): number {
  return sets.reduce((sum, set) => sum + calculateSetVolume(set), 0);
}

export function addQuickIncrement(currentValue: number, amount: number): number {
  return Math.max(0, currentValue + amount);
}

export function filterExerciseOptions(options: ExerciseOption[], keyword: string): ExerciseOption[] {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) {
    return options;
  }

  return options.filter((option) => option.name.toLowerCase().includes(normalized));
}

export function getExerciseOptionsByBodyPart(options: ExerciseOption[], bodyPart: BodyPart): ExerciseOption[] {
  return options.filter((option) => option.bodyPart === bodyPart);
}

export function addUserExerciseOption(
  options: ExerciseOption[],
  input: Pick<ExerciseOption, "name" | "bodyPart">,
): ExerciseOption[] {
  const id = `user-${input.name.toLowerCase().replace(/\s+/g, "-")}`;

  return [
    ...options,
    {
      id,
      name: input.name,
      bodyPart: input.bodyPart,
      source: "user",
    },
  ];
}

export function buildExerciseLog(input: ExerciseLogDraft) {
  const sets = input.sets.map((set) => ({
    ...set,
    volume: calculateSetVolume(set),
  }));

  return {
    id: input.id ?? crypto.randomUUID(),
    date: input.date,
    bodyPart: input.bodyPart,
    exerciseName: input.exerciseName,
    exerciseSource: input.exerciseSource,
    memo: input.memo,
    sets,
    totalVolume: sets.reduce((sum, set) => sum + set.volume, 0),
  };
}
