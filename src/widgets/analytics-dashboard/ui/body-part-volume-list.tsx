import type { BodyPartVolumeSummary } from "@/entities/analytics/model/analytics-service";
import { bodyPartLabels } from "@/shared/lib/body-part";
import { bodyPartColors } from "@/shared/lib/body-part-colors";
import { BarFill, BarRow, BarTrack, Description, Section, SectionTitle } from "./analytics-dashboard.styles";

type BodyPartVolumeListProps = {
  items: BodyPartVolumeSummary[];
};

export function BodyPartVolumeList({ items }: BodyPartVolumeListProps) {
  const maxBodyPartVolume = items[0]?.totalVolume ?? 1;

  return (
    <Section aria-label="부위별 볼륨">
      <SectionTitle>부위별 볼륨</SectionTitle>
      {items.length ? (
        items.map((item) => (
          <BarRow key={item.bodyPart}>
            <strong>{bodyPartLabels[item.bodyPart]}</strong>
            <BarTrack>
              <BarFill $width={(item.totalVolume / maxBodyPartVolume) * 100} $color={bodyPartColors[item.bodyPart]} />
            </BarTrack>
            <strong>{item.totalVolume}kg</strong>
          </BarRow>
        ))
      ) : (
        <Description>선택한 기간에 기록된 운동이 없습니다.</Description>
      )}
    </Section>
  );
}
