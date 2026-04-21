import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppNavigation } from "@/widgets/app-navigation/ui/app-navigation";

describe("AppNavigation", () => {
  it("현재 화면과 주요 화면 이동 링크를 보여야 한다", () => {
    render(<AppNavigation current="calendar" />);

    expect(screen.getByRole("navigation", { name: "주요 화면 이동" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "달력" })).toHaveAttribute("href", "/calendar");
    expect(screen.getByRole("link", { name: "통계" })).toHaveAttribute("href", "/analytics");
    expect(screen.getByRole("link", { name: "비교" })).toHaveAttribute("href", "/analytics/compare");
    expect(screen.getByLabelText("현재 화면")).toHaveTextContent("달력");
  });

  it("선택 날짜가 있으면 날짜 기록 링크를 함께 보여야 한다", () => {
    render(<AppNavigation current="detail" date="2026-04-14" />);

    expect(screen.getByRole("link", { name: "2026-04-14 기록" })).toHaveAttribute("href", "/calendar/2026-04-14");
  });
});
