"use client";

import { useMemo, useState } from "react";
import type { BodyPart, ExerciseLogDraft } from "@/entities/exercise-log/model/types";
import { DailyRecordPanel } from "@/widgets/daily-record-panel/ui/daily-record-panel";
import {
  addUserExercise,
  deleteExerciseLog,
  getExerciseLogsByDate,
  getExerciseOptions,
  saveExerciseLog,
} from "@/shared/lib/mock-record-storage";

type CalendarDetailClientPageProps = {
  date: string;
};

export function CalendarDetailClientPage({ date }: CalendarDetailClientPageProps) {
  const [refreshToken, setRefreshToken] = useState(0);

  const exerciseOptions = useMemo(() => getExerciseOptions(), [refreshToken]);
  const logs = useMemo(() => getExerciseLogsByDate(date), [date, refreshToken]);

  return (
    <DailyRecordPanel
      mode="inline"
      date={date}
      logs={logs}
      exerciseOptions={exerciseOptions}
      onSave={(draft: ExerciseLogDraft) => {
        saveExerciseLog(draft);
        setRefreshToken((value) => value + 1);
      }}
      onDelete={(id) => {
        deleteExerciseLog(id);
        setRefreshToken((value) => value + 1);
      }}
      onAddCustomExercise={({ name, bodyPart }: { name: string; bodyPart: BodyPart }) => {
        const option = addUserExercise({ name, bodyPart });
        setRefreshToken((value) => value + 1);
        return option;
      }}
    />
  );
}
