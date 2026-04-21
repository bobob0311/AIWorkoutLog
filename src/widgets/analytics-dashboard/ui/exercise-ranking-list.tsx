import type { ExerciseRankingItem } from "@/entities/analytics/model/analytics-service";
import { bodyPartLabels } from "@/shared/lib/body-part";
import { BarFill, BarRow, BarTrack, Description, Label, Section, SectionTitle } from "./analytics-dashboard.styles";

type ExerciseRankingListProps = {
  items: ExerciseRankingItem[];
};

export function ExerciseRankingList({ items }: ExerciseRankingListProps) {
  const maxExerciseVolume = items[0]?.totalVolume ?? 1;

  return (
    <Section aria-label="운동 랭킹">
      <SectionTitle>운동 랭킹</SectionTitle>
      {items.length ? (
        items.map((item) => (
          <BarRow key={`${item.bodyPart}-${item.exerciseName}`}>
            <div>
              <strong>{item.exerciseName}</strong>
              <Label>{bodyPartLabels[item.bodyPart]}</Label>
            </div>
            <BarTrack>
              <BarFill $width={(item.totalVolume / maxExerciseVolume) * 100} $color={item.color} aria-label={`${item.exerciseName} ${item.totalVolume}kg`} />
            </BarTrack>
            <strong>{item.totalVolume}kg</strong>
          </BarRow>
        ))
      ) : (
        <Description>선택한 기간에 표시할 운동 랭킹이 없습니다.</Description>
      )}
    </Section>
  );
}
