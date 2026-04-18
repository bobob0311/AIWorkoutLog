import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { CalendarClientPage } from "@/app/calendar/page.client";

describe("CalendarClientPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("달력 날짜를 누르면 상세 페이지 이동 대신 날짜 기록 모달이 열려야 한다", async () => {
    const user = userEvent.setup();

    render(<CalendarClientPage currentMonthDate={new Date("2026-04-17T09:00:00+09:00")} />);
    await user.click(screen.getByRole("button", { name: "2026-04-03" }));

    expect(screen.getByRole("dialog", { name: "2026-04-03 운동 기록" })).toBeInTheDocument();
  });

  it("모달에서 저장한 기록이 닫힌 뒤 달력 날짜 셀에 즉시 반영되어야 한다", async () => {
    const user = userEvent.setup();

    render(<CalendarClientPage currentMonthDate={new Date("2026-04-17T09:00:00+09:00")} />);
    await user.click(screen.getByRole("button", { name: "2026-04-01" }));
    await user.click(screen.getByRole("button", { name: "가슴" }));
    await user.click(screen.getByRole("button", { name: "벤치프레스 선택" }));
    await user.click(screen.getByRole("button", { name: "세트 1 중량 +20kg" }));
    await user.click(screen.getByRole("button", { name: "세트 1 횟수 +10" }));
    await user.click(screen.getByRole("button", { name: "기록 저장" }));
    await user.click(screen.getByRole("button", { name: "닫기" }));

    expect(screen.getByText("총 200kg")).toBeInTheDocument();
    expect(screen.getByLabelText("2026-04-01 가슴 200kg")).toBeInTheDocument();
  });

  it("이전 달, 다음 달, 이번 달 이동 시 달력과 월간 요약이 함께 갱신되어야 한다", async () => {
    const user = userEvent.setup();

    render(<CalendarClientPage currentMonthDate={new Date("2026-04-17T09:00:00+09:00")} />);

    expect(screen.getByLabelText("현재 보고 있는 월")).toHaveTextContent("2026년 4월");
    expect(screen.getByText("6260kg")).toBeInTheDocument();
    expect(screen.getByText("2일")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "다음 달" }));

    expect(screen.getByLabelText("현재 보고 있는 월")).toHaveTextContent("2026년 5월");
    expect(screen.getByText("0kg")).toBeInTheDocument();
    expect(screen.getByText("0일")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "2026-04-03" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "이번 달" }));

    expect(screen.getByLabelText("현재 보고 있는 월")).toHaveTextContent("2026년 4월");
    expect(screen.getByText("6260kg")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2026-04-03" })).toBeInTheDocument();
  });
});
