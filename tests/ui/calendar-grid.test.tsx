import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CalendarGrid } from "@/widgets/calendar-grid/ui/calendar-grid";
import { buildCalendarDays } from "@/entities/calendar-day/model/calendar-service";
import type { DailyWorkoutSummary } from "@/entities/calendar-day/model/types";

const records: DailyWorkoutSummary[] = [
  {
    date: "2026-04-03",
    totalVolume: 5000,
    bodyPartVolumes: {
      chest: 3200,
      arms: 1800,
    },
  },
];

describe("CalendarGrid", () => {
  it("월간 달력을 렌더링한다", () => {
    const days = buildCalendarDays({ year: 2026, month: 4, records });

    render(<CalendarGrid days={days} monthLabel="2026년 4월" />);

    expect(screen.getByText("2026년 4월")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /2026-04-03/ })).toBeInTheDocument();
  });

  it("기록 있는 날짜는 총 볼륨 배지와 부위 이름이 붙은 미니 차트를 보여준다", () => {
    const days = buildCalendarDays({ year: 2026, month: 4, records });

    render(<CalendarGrid days={days} monthLabel="2026년 4월" />);

    expect(screen.getByText("총 5000kg")).toBeInTheDocument();
    expect(screen.getByLabelText("2026-04-03 부위별 볼륨 차트")).toBeInTheDocument();
    expect(screen.getByText("가슴")).toBeInTheDocument();
    expect(screen.getByText("팔")).toBeInTheDocument();
    expect(screen.getByLabelText("2026-04-03 가슴 3200kg")).toBeInTheDocument();
    expect(screen.getByLabelText("2026-04-03 팔 1800kg")).toBeInTheDocument();
  });

  it("날짜 클릭 콜백이 있으면 페이지 이동 대신 모달 오픈 이벤트를 보낸다", async () => {
    const user = userEvent.setup();
    const onSelectDate = vi.fn();
    const days = buildCalendarDays({ year: 2026, month: 4, records });

    render(<CalendarGrid days={days} monthLabel="2026년 4월" onSelectDate={onSelectDate} />);

    await user.click(screen.getByRole("button", { name: /2026-04-03/ }));

    expect(onSelectDate).toHaveBeenCalledWith("2026-04-03");
  });
});
