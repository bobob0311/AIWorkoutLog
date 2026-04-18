import { describe, expect, it } from "vitest";
import { listProfiles, requireAuth, verifyProfilePassword } from "@/entities/profile/model/profile-service";

describe("profile auth service", () => {
  it("프로필 목록을 반환해야 한다", async () => {
    const profiles = await listProfiles();

    expect(profiles.length).toBeGreaterThan(0);
    expect(profiles[0]).toHaveProperty("id");
    expect(profiles[0]).toHaveProperty("name");
  });

  it("올바른 비밀번호면 성공 결과를 반환해야 한다", async () => {
    const profiles = await listProfiles();
    const result = await verifyProfilePassword(profiles[0].id, "1234");

    expect(result.success).toBe(true);
    expect(result.redirectTo).toBe("/calendar");
  });

  it("잘못된 비밀번호면 실패 메시지를 반환해야 한다", async () => {
    const profiles = await listProfiles();
    const result = await verifyProfilePassword(profiles[0].id, "wrong");

    expect(result.success).toBe(false);
    expect(result.errorMessage).toBeTruthy();
  });

  it("로그인 상태가 없으면 보호 페이지 접근을 차단해야 한다", () => {
    const result = requireAuth(null);

    expect(result.authorized).toBe(false);
    expect(result.redirectTo).toBe("/login");
  });
});

