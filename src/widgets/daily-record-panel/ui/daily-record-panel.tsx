"use client";

import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import {
  addQuickIncrement,
  calculateExerciseVolume,
  filterExerciseOptions,
  getExerciseOptionsByBodyPart,
} from "@/entities/exercise-log/model/exercise-log-service";
import type { BodyPart, ExerciseLog, ExerciseLogDraft, ExerciseOption, ExerciseSetInput } from "@/entities/exercise-log/model/types";
import { bodyPartLabels } from "@/shared/lib/body-part";
import { AppNavigation } from "@/widgets/app-navigation/ui/app-navigation";

type DailyRecordPanelProps = {
  date: string;
  logs: ExerciseLog[];
  exerciseOptions: ExerciseOption[];
  onSave: (draft: ExerciseLogDraft) => void;
  onDelete: (id: string) => void;
  onAddCustomExercise: (input: { name: string; bodyPart: BodyPart }) => ExerciseOption;
  mode: "modal" | "inline";
  onClose?: () => void;
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.58);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 32px 20px;
  z-index: 50;
  overflow-y: auto;
`;

const InlineWrap = styled.main`
  min-height: 100vh;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Panel = styled.section<{ $modal: boolean }>`
  width: 100%;
  max-width: ${({ $modal }) => ($modal ? "980px" : "100%")};
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: ${({ $modal }) => ($modal ? "0 32px 64px rgba(15, 23, 42, 0.2)" : "none")};

  @media (max-width: 768px) {
    padding: 18px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CloseButton = styled.button`
  border: 1px solid #d1d5db;
  background: #ffffff;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SummaryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SummaryChip = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 700;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const SelectButton = styled.button<{ $active?: boolean }>`
  border: ${({ $active }) => ($active ? "none" : "1px solid #d1d5db")};
  background: ${({ $active }) => ($active ? "#111827" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#111827")};
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

const Card = styled.article`
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #374151;
`;

const Input = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  min-height: 88px;
  resize: vertical;
`;

const ActionButton = styled.button<{ $variant?: "primary" | "danger" }>`
  border: ${({ $variant }) => ($variant === "primary" ? "none" : "1px solid #d1d5db")};
  background: ${({ $variant }) => {
    if ($variant === "primary") return "#111827";
    if ($variant === "danger") return "#fff1f2";
    return "#ffffff";
  }};
  color: ${({ $variant }) => ($variant === "primary" ? "#ffffff" : $variant === "danger" ? "#be123c" : "#111827")};
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const LogItem = styled.article`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const QuickButton = styled.button`
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

type DraftState = {
  id?: string;
  bodyPart: BodyPart;
  exerciseName: string;
  exerciseSource: "base" | "user";
  memo: string;
  sets: ExerciseSetInput[];
};

function createInitialSet(): ExerciseSetInput {
  return {
    setOrder: 1,
    weight: 0,
    reps: 0,
  };
}

function createInitialDraft(): DraftState {
  return {
    bodyPart: "chest",
    exerciseName: "",
    exerciseSource: "base",
    memo: "",
    sets: [createInitialSet()],
  };
}

function getDailyTotalVolume(logs: ExerciseLog[]): number {
  return logs.reduce((sum, log) => sum + log.totalVolume, 0);
}

export function DailyRecordPanel({
  date,
  logs,
  exerciseOptions,
  onSave,
  onDelete,
  onAddCustomExercise,
  mode,
  onClose,
}: DailyRecordPanelProps) {
  const [draft, setDraft] = useState<DraftState>(createInitialDraft());
  const [keyword, setKeyword] = useState("");

  const totalVolume = useMemo(() => calculateExerciseVolume(draft.sets), [draft.sets]);
  const dailyTotalVolume = useMemo(() => getDailyTotalVolume(logs), [logs]);
  const summaryByBodyPart = useMemo(() => {
    return logs.reduce<Record<string, number>>((acc, log) => {
      acc[log.bodyPart] = (acc[log.bodyPart] ?? 0) + log.totalVolume;
      return acc;
    }, {});
  }, [logs]);

  const bodyPartOptions = useMemo(
    () => getExerciseOptionsByBodyPart(exerciseOptions, draft.bodyPart),
    [draft.bodyPart, exerciseOptions],
  );
  const filteredOptions = useMemo(
    () => filterExerciseOptions(bodyPartOptions, keyword).slice(0, 8),
    [bodyPartOptions, keyword],
  );

  const setDraftSetValue = (index: number, key: "weight" | "reps", nextValue: number) => {
    setDraft((prev) => ({
      ...prev,
      sets: prev.sets.map((set, setIndex) => (setIndex === index ? { ...set, [key]: Math.max(0, nextValue) } : set)),
    }));
  };

  const handleSave = () => {
    if (!draft.exerciseName.trim()) {
      return;
    }

    onSave({
      id: draft.id,
      date,
      bodyPart: draft.bodyPart,
      exerciseName: draft.exerciseName,
      exerciseSource: draft.exerciseSource,
      memo: draft.memo,
      sets: draft.sets,
    });
    setDraft(createInitialDraft());
    setKeyword("");
  };

  const handleEdit = (log: ExerciseLog) => {
    setDraft({
      id: log.id,
      bodyPart: log.bodyPart,
      exerciseName: log.exerciseName,
      exerciseSource: log.exerciseSource,
      memo: log.memo,
      sets: log.sets.map((set) => ({
        setOrder: set.setOrder,
        weight: set.weight,
        reps: set.reps,
      })),
    });
    setKeyword(log.exerciseName);
  };

  const handleAddCustomExercise = () => {
    if (!keyword.trim()) {
      return;
    }

    const option = onAddCustomExercise({
      name: keyword.trim(),
      bodyPart: draft.bodyPart,
    });

    setDraft((prev) => ({
      ...prev,
      exerciseName: option.name,
      exerciseSource: option.source,
    }));
  };

  const content = (
    <Panel $modal={mode === "modal"}>
      {mode === "inline" ? <AppNavigation current="detail" date={date} /> : null}

      <Header>
        <Heading>
          <h1 style={{ margin: 0, fontSize: "32px" }}>{date} 운동 기록</h1>
          <p style={{ margin: 0, color: "#4b5563" }}>총 {dailyTotalVolume}kg, 빠른 입력 버튼으로 세트를 편하게 기록하세요.</p>
        </Heading>
        {mode === "modal" ? (
          <CloseButton type="button" onClick={onClose}>
            닫기
          </CloseButton>
        ) : null}
      </Header>

      <Section>
        <strong>오늘의 부위별 요약</strong>
        {Object.keys(summaryByBodyPart).length ? (
          <SummaryRow>
            {Object.entries(summaryByBodyPart).map(([bodyPart, volume]) => (
              <SummaryChip key={bodyPart}>
                {bodyPartLabels[bodyPart as BodyPart]} {volume}kg
              </SummaryChip>
            ))}
          </SummaryRow>
        ) : (
          <span>아직 기록이 없습니다.</span>
        )}
      </Section>

      <Card>
        <strong>{draft.id ? "운동 기록 수정" : "운동 기록 추가"}</strong>

        <Section>
          <span>부위 선택</span>
          <ButtonRow>
            {(Object.entries(bodyPartLabels) as [BodyPart, string][]).map(([value, label]) => (
              <SelectButton
                key={value}
                type="button"
                $active={draft.bodyPart === value}
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    bodyPart: value,
                    exerciseName: "",
                    exerciseSource: "base",
                  }))
                }
              >
                {label}
              </SelectButton>
            ))}
          </ButtonRow>
        </Section>

        <Section>
          <span>운동 버튼</span>
          <div aria-label="선택된 운동">{draft.exerciseName || "선택된 운동 없음"}</div>
          <ButtonRow>
            {filteredOptions.map((option) => (
              <SelectButton
                key={option.id}
                type="button"
                $active={draft.exerciseName === option.name}
                onClick={() => {
                  setDraft((prev) => ({
                    ...prev,
                    exerciseName: option.name,
                    exerciseSource: option.source,
                    bodyPart: option.bodyPart,
                  }));
                  setKeyword("");
                }}
              >
                {option.name} 선택
              </SelectButton>
            ))}
          </ButtonRow>
        </Section>

        <Row>
          <Field>
            <span>운동 검색</span>
            <Input
              aria-label="운동 검색"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="운동명을 검색하거나 새 운동을 입력하세요."
            />
          </Field>

          <Field>
            <span>메모</span>
            <TextArea value={draft.memo} onChange={(event) => setDraft((prev) => ({ ...prev, memo: event.target.value }))} />
          </Field>
        </Row>

        {!filteredOptions.length && keyword.trim() ? (
          <ButtonRow>
            <ActionButton type="button" onClick={handleAddCustomExercise}>
              사용자 운동 추가
            </ActionButton>
          </ButtonRow>
        ) : null}

        <Section>
          <strong>세트</strong>
          {draft.sets.map((set, index) => (
            <Card key={`set-${set.setOrder}-${index}`}>
              <Row>
                <Field>
                  <span>세트 {index + 1} 중량</span>
                  <Input
                    aria-label={`세트 ${index + 1} 중량`}
                    type="number"
                    value={set.weight}
                    onChange={(event) => setDraftSetValue(index, "weight", Number(event.target.value))}
                  />
                </Field>

                <Field>
                  <span>세트 {index + 1} 횟수</span>
                  <Input
                    aria-label={`세트 ${index + 1} 횟수`}
                    type="number"
                    value={set.reps}
                    onChange={(event) => setDraftSetValue(index, "reps", Number(event.target.value))}
                  />
                </Field>
              </Row>

              <ButtonRow>
                {[5, 10, 15, 20].map((amount) => (
                  <QuickButton
                    key={`weight-${amount}`}
                    type="button"
                    onClick={() => setDraftSetValue(index, "weight", addQuickIncrement(set.weight, amount))}
                    aria-label={`세트 ${index + 1} 중량 +${amount}kg`}
                  >
                    +{amount}kg
                  </QuickButton>
                ))}
              </ButtonRow>

              <ButtonRow>
                {[5, 8, 10, 12].map((amount) => (
                  <QuickButton
                    key={`reps-${amount}`}
                    type="button"
                    onClick={() => setDraftSetValue(index, "reps", addQuickIncrement(set.reps, amount))}
                    aria-label={`세트 ${index + 1} 횟수 +${amount}`}
                  >
                    +{amount}
                  </QuickButton>
                ))}
              </ButtonRow>

              <ButtonRow>
                <span>세트 볼륨 {set.weight * set.reps}kg</span>
                {draft.sets.length > 1 ? (
                  <ActionButton
                    type="button"
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        sets: prev.sets
                          .filter((_, setIndex) => setIndex !== index)
                          .map((item, nextIndex) => ({ ...item, setOrder: nextIndex + 1 })),
                      }))
                    }
                  >
                    세트 삭제
                  </ActionButton>
                ) : null}
              </ButtonRow>
            </Card>
          ))}
        </Section>

        <ButtonRow>
          <ActionButton
            type="button"
            onClick={() =>
              setDraft((prev) => ({
                ...prev,
                sets: [...prev.sets, { setOrder: prev.sets.length + 1, weight: 0, reps: 0 }],
              }))
            }
          >
            세트 추가
          </ActionButton>
          <span>운동 총 볼륨 {totalVolume}kg</span>
        </ButtonRow>

        <ButtonRow>
          <ActionButton type="button" $variant="primary" onClick={handleSave}>
            기록 저장
          </ActionButton>
        </ButtonRow>
      </Card>

      <Section>
        <strong>기존 기록 목록</strong>
        {logs.length ? (
          logs.map((log) => (
            <LogItem key={log.id}>
              <strong>{log.exerciseName}</strong>
              <span>
                {bodyPartLabels[log.bodyPart]} · 총 볼륨 {log.totalVolume}kg
              </span>
              <span>세트 {log.sets.length}개</span>
              <ButtonRow>
                <ActionButton type="button" onClick={() => handleEdit(log)}>
                  수정
                </ActionButton>
                <ActionButton type="button" $variant="danger" onClick={() => onDelete(log.id)}>
                  삭제
                </ActionButton>
              </ButtonRow>
            </LogItem>
          ))
        ) : (
          <span>기록된 운동이 없습니다.</span>
        )}
      </Section>
    </Panel>
  );

  if (mode === "modal") {
    return (
      <Overlay>
        <div role="dialog" aria-modal="true" aria-label={`${date} 운동 기록`} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          {content}
        </div>
      </Overlay>
    );
  }

  return <InlineWrap>{content}</InlineWrap>;
}
