import Link from "next/link";
import styled from "@emotion/styled";
import type { ExerciseProgressStatus, TrendStatus } from "@/entities/analytics/model/analytics-service";

export const Page = styled.main`
  min-height: 100vh;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 32px;
  line-height: 1.2;
`;

export const Description = styled.p`
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
`;

export const ViewSwitch = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const ViewLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "$active",
})<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: ${({ $active }) => ($active ? "none" : "1px solid #d1d5db")};
  background: ${({ $active }) => ($active ? "#111827" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#111827")};
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
`;

export const TabRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  border: ${({ $active }) => ($active ? "none" : "1px solid #d1d5db")};
  background: ${({ $active }) => ($active ? "#111827" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#111827")};
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

export const RangePanel = styled.section`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RangeRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #374151;
`;

export const Input = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
`;

export const ActionButton = styled.button`
  border: none;
  background: #111827;
  color: #ffffff;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  align-self: end;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const CardGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const Card = styled.article`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

export const Value = styled.strong`
  font-size: 24px;
  color: #111827;
`;

export const Section = styled.section`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SectionTitle = styled.strong`
  font-size: 18px;
`;

export const RecommendationPanel = styled.section`
  background: #ffffff;
  border: 1px solid #c7d2fe;
  border-radius: 16px;
  padding: 20px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const RecommendationTitle = styled.strong`
  font-size: 26px;
  line-height: 1.2;
  color: #111827;
`;

export const EvidenceGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const EvidenceChip = styled.span`
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  background: #eef2ff;
  color: #3730a3;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 700;
`;

export const CtaLink = styled(Link)`
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #111827;
  color: #ffffff;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const BarRow = styled.article`
  display: grid;
  grid-template-columns: minmax(72px, 120px) 1fr minmax(72px, auto);
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const BarTrack = styled.div`
  height: 12px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
`;

export const BarFill = styled.div<{ $width: number; $color?: string }>`
  width: ${({ $width }) => `${Math.min(Math.max($width, 0), 100)}%`};
  height: 100%;
  background: ${({ $color }) => $color ?? "#6366f1"};
  border-radius: 999px;
`;

export const WeekBars = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  align-items: end;
  min-height: 104px;
`;

export const WeekBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 6px;
  min-width: 0;
`;

export const WeekBarFill = styled.div<{ $height: number }>`
  min-height: 8px;
  height: ${({ $height }) => `${Math.max($height, 8)}px`};
  border-radius: 8px 8px 3px 3px;
  background: #6366f1;
`;

export const ComparisonGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ComparisonCard = styled.article<{ $color?: string }>`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-left: 5px solid ${({ $color }) => $color ?? "#d1d5db"};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MetricRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Metric = styled.span`
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: #4b5563;
  font-size: 12px;
`;

export const StatusPill = styled.span<{ $status: TrendStatus | ExerciseProgressStatus }>`
  display: inline-flex;
  width: fit-content;
  align-items: center;
  min-height: 28px;
  border-radius: 999px;
  padding: 0 10px;
  background: ${({ $status }) => {
    if ($status === "increase" || $status === "weight_increase" || $status === "volume_increase") return "#dcfce7";
    if ($status === "decrease" || $status === "volume_decrease") return "#ffe4e6";
    if ($status === "heavy_session") return "#fef3c7";
    return "#f3f4f6";
  }};
  color: ${({ $status }) => {
    if ($status === "increase" || $status === "weight_increase" || $status === "volume_increase") return "#166534";
    if ($status === "decrease" || $status === "volume_decrease") return "#be123c";
    if ($status === "heavy_session") return "#92400e";
    return "#374151";
  }};
  font-size: 12px;
  font-weight: 800;
`;
