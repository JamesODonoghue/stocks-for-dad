import { test as setup, expect } from "@playwright/test";
import { db } from "~/server/db";
import dotenv from "dotenv";
dotenv.config();
setup("create new database", async () => {
  console.log("seeding database...");
  await db.pointPlayer.deleteMany();
  await db.player.deleteMany();
  await db.point.deleteMany();
  await db.game.deleteMany();
  await db.team.deleteMany();
  const { id } = await db.team.create({
    data: {
      name: "Alameda Taurus",
    },
  });
  await db.team.create({
    data: {
      name: "Seawolves",
    },
  });
  await db.player.createMany({
    data: [
      { name: "Grand Shaddon", teamId: id },
      { name: "Arlo Henrikson", teamId: id },
      { name: "Beckett Yap", teamId: id },
      { name: "Cameron Gambino", teamId: id },
      { name: "Charmain Tran", teamId: id },
      { name: "Christopher Gordon", teamId: id },
      { name: "Hailey Jordan", teamId: id },
      { name: "Lucas Strosahl-Ortega", teamId: id },
      { name: "Miles Bullock-Humphrey", teamId: id },
    ],
  });
});

setup("Clerk", async ({ page }) => {
  const authFile = "auth.json";

  await page.goto("/");
  await page
    .getByRole("textbox", { name: /email address/i })
    .fill(process.env.PLAYWRIGHT_E2E_USER_EMAIL ?? "");
  await page.getByRole("button", { name: /^continue$/i }).click();
  await page
    .getByRole("textbox", { name: /password/i })
    .fill(process.env.PLAYWRIGHT_E2E_USER_PASSWORD ?? "");
  await page.getByRole("button", { name: /^continue$/i }).click();
  await expect(page.getByText(/ulti score/i)).toBeVisible();
  await page.context().storageState({ path: authFile });
});
