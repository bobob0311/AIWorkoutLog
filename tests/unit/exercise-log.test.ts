import { describe, expect, it } from "vitest";
import {
  addQuickIncrement,
  addUserExerciseOption,
  calculateExerciseVolume,
  calculateSetVolume,
  filterExerciseOptions,
  getExerciseOptionsByBodyPart,
} from "@/entities/exercise-log/model/exercise-log-service";
import type { ExerciseOption, ExerciseSetInput } from "@/entities/exercise-log/model/types";

const baseExercises: ExerciseOption[] = [
  { id: "base-bench", name: "벤치프레스", bodyPart: "chest", source: "base" },
  { id: "base-incline-bench", name: "인클라인 벤치프레스", bodyPart: "chest", source: "base" },
  { id: "base-row", name: "바벨 로우", bodyPart: "back", source: "base" },
];

describe("exercise log service", () => {
  it("중량 x 횟수로 세트 볼륨을 계산해야 한다", () => {
    expect(calculateSetVolume({ weight: 60, reps: 10 })).toBe(600);
  });

  it("여러 세트의 운동 총 볼륨을 계산해야 한다", () => {
    const sets: ExerciseSetInput[] = [
      { setOrder: 1, weight: 60, reps: 10 },
      { setOrder: 2, weight: 70, reps: 8 },
    ];

    expect(calculateExerciseVolume(sets)).toBe(1160);
  });

  it("부위별 운동 버튼 목록은 기본 운동과 사용자 운동을 함께 반환해야 한다", () => {
    const exercises = addUserExerciseOption(baseExercises, {
      name: "케이블 플라이",
      bodyPart: "chest",
    });

    const results = getExerciseOptionsByBodyPart(exercises, "chest");
    expect(results.map((item) => item.name)).toEqual(["벤치프레스", "인클라인 벤치프레스", "케이블 플라이"]);
  });

  it("운동 검색은 버튼 외의 보조 입력으로도 계속 사용할 수 있어야 한다", () => {
    const results = filterExerciseOptions(baseExercises, "벤치");

    expect(results).toHaveLength(2);
    expect(results[0].name).toBe("벤치프레스");
  });

  it("빠른 입력 버튼은 현재 값에 더하기로 동작해야 한다", () => {
    expect(addQuickIncrement(10, 5)).toBe(15);
    expect(addQuickIncrement(0, 20)).toBe(20);
  });
});
