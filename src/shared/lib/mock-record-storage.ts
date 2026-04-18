import { baseExerciseOptions } from "@/shared/mock/exercise-data";
import { buildExerciseLog } from "@/entities/exercise-log/model/exercise-log-service";
import type { ExerciseLog, ExerciseLogDraft, ExerciseOption } from "@/entities/exercise-log/model/types";

const USER_EXERCISES_KEY = "health-log-user-exercises";
const EXERCISE_LOGS_KEY = "health-log-exercise-logs";

const initialLogs: ExerciseLog[] = [
  buildExerciseLog({
    id: "log-1",
    date: "2026-04-03",
    bodyPart: "chest",
    exerciseName: "벤치프레스",
    exerciseSource: "base",
    memo: "가슴 메인 운동",
    sets: [
      { setOrder: 1, weight: 80, reps: 10 },
      { setOrder: 2, weight: 90, reps: 8 },
      { setOrder: 3, weight: 100, reps: 6 },
    ],
  }),
  buildExerciseLog({
    id: "log-2",
    date: "2026-04-03",
    bodyPart: "arms",
    exerciseName: "바벨 컬",
    exerciseSource: "base",
    memo: "",
    sets: [
      { setOrder: 1, weight: 30, reps: 12 },
      { setOrder: 2, weight: 30, reps: 10 },
      { setOrder: 3, weight: 25, reps: 12 },
    ],
  }),
  buildExerciseLog({
    id: "log-3",
    date: "2026-04-14",
    bodyPart: "back",
    exerciseName: "바벨 로우",
    exerciseSource: "base",
    memo: "",
    sets: [
      { setOrder: 1, weight: 70, reps: 10 },
      { setOrder: 2, weight: 80, reps: 8 },
      { setOrder: 3, weight: 80, reps: 9 },
    ],
  }),
  buildExerciseLog({
    id: "log-4",
    date: "2026-04-14",
    bodyPart: "shoulders",
    exerciseName: "숄더프레스",
    exerciseSource: "base",
    memo: "",
    sets: [
      { setOrder: 1, weight: 40, reps: 10 },
      { setOrder: 2, weight: 45, reps: 8 },
      { setOrder: 3, weight: 45, reps: 8 },
    ],
  }),
];

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getExerciseOptions(): ExerciseOption[] {
  const userExercises = readJson<ExerciseOption[]>(USER_EXERCISES_KEY, []);
  return [...baseExerciseOptions, ...userExercises];
}

export function addUserExercise(input: Pick<ExerciseOption, "name" | "bodyPart">): ExerciseOption {
  const userExercises = readJson<ExerciseOption[]>(USER_EXERCISES_KEY, []);
  const next: ExerciseOption = {
    id: `user-${Date.now()}`,
    name: input.name,
    bodyPart: input.bodyPart,
    source: "user",
  };

  writeJson(USER_EXERCISES_KEY, [...userExercises, next]);
  return next;
}

export function getExerciseLogs(): ExerciseLog[] {
  return readJson<ExerciseLog[]>(EXERCISE_LOGS_KEY, initialLogs);
}

export function getExerciseLogsByDate(date: string): ExerciseLog[] {
  return getExerciseLogs().filter((log) => log.date === date);
}

export function saveExerciseLog(draft: ExerciseLogDraft): ExerciseLog {
  const nextLog = buildExerciseLog(draft);
  const logs = getExerciseLogs();
  const nextLogs = draft.id ? logs.map((log) => (log.id === draft.id ? nextLog : log)) : [...logs, nextLog];

  writeJson(EXERCISE_LOGS_KEY, nextLogs);
  return nextLog;
}

export function deleteExerciseLog(id: string): void {
  const logs = getExerciseLogs().filter((log) => log.id !== id);
  writeJson(EXERCISE_LOGS_KEY, logs);
}
