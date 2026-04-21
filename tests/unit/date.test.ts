import { describe, expect, it } from "vitest";
import { formatDateKey, getTodayDateKey } from "@/shared/lib/date";

describe("date helper", () => {
  it("날짜를 YYYY-MM-DD 문자열로 변환해야 한다", () => {
    expect(formatDateKey(new Date(2026, 3, 5))).toBe("2026-04-05");
  });

  it("오늘 날짜 문자열을 YYYY-MM-DD 형식으로 반환해야 한다", () => {
    expect(getTodayDateKey(new Date(2026, 3, 20))).toBe("2026-04-20");
  });
});
