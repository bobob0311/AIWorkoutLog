import type { AnalyticsRange } from "@/entities/analytics/model/analytics-service";
import { ActionButton, Field, Input, RangePanel, RangeRow, SectionTitle, TabButton, TabRow } from "./analytics-dashboard.styles";

type AnalyticsRangeFilterProps = {
  preset: AnalyticsRange;
  draftStartDate: string;
  draftEndDate: string;
  onPresetChange: (preset: AnalyticsRange) => void;
  onDraftStartDateChange: (date: string) => void;
  onDraftEndDateChange: (date: string) => void;
  onApplyCustomRange: () => void;
};

const tabs: Array<{ label: string; value: AnalyticsRange; ariaLabel: string }> = [
  { label: "일간", value: "day", ariaLabel: "일간 통계 보기" },
  { label: "주간", value: "week", ariaLabel: "주간 통계 보기" },
  { label: "월간", value: "month", ariaLabel: "월간 통계 보기" },
  { label: "직접 기간", value: "custom", ariaLabel: "직접 기간 통계 보기" },
];

export function AnalyticsRangeFilter({
  preset,
  draftStartDate,
  draftEndDate,
  onPresetChange,
  onDraftStartDateChange,
  onDraftEndDateChange,
  onApplyCustomRange,
}: AnalyticsRangeFilterProps) {
  return (
    <>
      <TabRow>
        {tabs.map((tab) => (
          <TabButton key={tab.value} type="button" $active={preset === tab.value} onClick={() => onPresetChange(tab.value)} aria-label={tab.ariaLabel}>
            {tab.label}
          </TabButton>
        ))}
      </TabRow>

      {preset === "custom" ? (
        <RangePanel>
          <SectionTitle>직접 기간 설정</SectionTitle>
          <RangeRow>
            <Field>
              <span>시작일</span>
              <Input aria-label="시작일" type="date" value={draftStartDate} onChange={(event) => onDraftStartDateChange(event.target.value)} />
            </Field>
            <Field>
              <span>종료일</span>
              <Input aria-label="종료일" type="date" value={draftEndDate} onChange={(event) => onDraftEndDateChange(event.target.value)} />
            </Field>
            <ActionButton type="button" onClick={onApplyCustomRange}>
              기간 적용
            </ActionButton>
          </RangeRow>
        </RangePanel>
      ) : null}
    </>
  );
}
