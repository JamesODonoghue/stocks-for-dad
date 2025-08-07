import { expect, test } from "@playwright/test";

test("should allow user to create a game", async ({ page }) => {
  await page.goto("/");
  const homeTeam = page.getByLabel(/home team/i);
  await homeTeam.click();
  await page.getByLabel(/alameda taurus/i).click();
  const awayTeam = page.getByLabel(/away team/i);
  await awayTeam.click();
  await page.getByLabel(/seawolves/i).click();
  await page.getByRole("button", { name: /^create$/i }).click();
  await expect(page.getByText(/^0$/).first()).toBeVisible();
});
