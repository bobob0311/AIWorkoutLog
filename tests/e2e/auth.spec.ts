import { expect, test } from "@playwright/test";

test("프로필 선택 후 비밀번호 입력으로 캘린더에 진입한다", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "민수" }).click();
  await page.getByLabel("비밀번호").fill("1234");
  await page.getByRole("button", { name: "로그인" }).click();

  await expect(page).toHaveURL(/calendar/);
});

