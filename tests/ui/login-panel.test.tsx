import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Profile } from "@/entities/profile/model/types";
import { LoginPanel } from "@/widgets/login-panel/ui/login-panel";

const profiles: Profile[] = [
  { id: "profile-1", name: "민수", passwordHash: "unused" },
  { id: "profile-2", name: "지현", passwordHash: "unused" },
];

describe("LoginPanel", () => {
  it("프로필 목록과 비밀번호 입력 필드를 렌더링해야 한다", () => {
    render(<LoginPanel profiles={profiles} onLogin={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByText("민수")).toBeInTheDocument();
    expect(screen.getByText("지현")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
  });

  it("프로필 선택 전에는 로그인 버튼이 비활성화되어야 한다", () => {
    render(<LoginPanel profiles={profiles} onLogin={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByRole("button", { name: "로그인" })).toBeDisabled();
  });

  it("올바른 로그인 결과면 성공 콜백을 호출해야 한다", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn().mockResolvedValue({ success: true, redirectTo: "/calendar" });
    const onSuccess = vi.fn();

    render(<LoginPanel profiles={profiles} onLogin={onLogin} onSuccess={onSuccess} />);

    await user.click(screen.getByRole("button", { name: "민수" }));
    await user.type(screen.getByLabelText("비밀번호"), "1234");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(onLogin).toHaveBeenCalledWith({ profileId: "profile-1", password: "1234" });
    expect(onSuccess).toHaveBeenCalledWith("/calendar");
  });

  it("잘못된 로그인 결과면 에러 메시지를 보여야 한다", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn().mockResolvedValue({ success: false, errorMessage: "비밀번호가 올바르지 않습니다." });

    render(<LoginPanel profiles={profiles} onLogin={onLogin} onSuccess={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "민수" }));
    await user.type(screen.getByLabelText("비밀번호"), "9999");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(await screen.findByText("비밀번호가 올바르지 않습니다.")).toBeInTheDocument();
  });
});

