import type { ExerciseOption } from "@/entities/exercise-log/model/types";

export const baseExerciseOptions: ExerciseOption[] = [
  { id: "base-bench", name: "벤치프레스", bodyPart: "chest", source: "base" },
  { id: "base-incline-bench", name: "인클라인 벤치프레스", bodyPart: "chest", source: "base" },
  { id: "base-fly", name: "덤벨 플라이", bodyPart: "chest", source: "base" },
  { id: "base-row", name: "바벨 로우", bodyPart: "back", source: "base" },
  { id: "base-deadlift", name: "데드리프트", bodyPart: "back", source: "base" },
  { id: "base-squat", name: "스쿼트", bodyPart: "legs", source: "base" },
  { id: "base-leg-press", name: "레그프레스", bodyPart: "legs", source: "base" },
  { id: "base-shoulder-press", name: "숄더프레스", bodyPart: "shoulders", source: "base" },
  { id: "base-lateral-raise", name: "사이드 레터럴 레이즈", bodyPart: "shoulders", source: "base" },
  { id: "base-curl", name: "바벨 컬", bodyPart: "arms", source: "base" },
  { id: "base-triceps-pushdown", name: "케이블 푸시다운", bodyPart: "arms", source: "base" },
  { id: "base-plank", name: "플랭크", bodyPart: "core", source: "base" },
];
