import { expect, test } from "@playwright/test";
import { addTask, day, today } from "./helpers";

test("a day turns red when its hours go over the daily limit", async ({ page }) => {
  await page.goto("/");
  const t0 = await today(page);

  await addTask(page, "Design review", { date: t0, hours: 5 });
  await expect(day(page, t0)).toHaveAttribute("data-overloaded", "false");
  await expect(day(page, t0).getByTestId("day-total")).toHaveText("5 / 8 h");

  await addTask(page, "Prototype", { date: t0, hours: 4 });
  await expect(day(page, t0)).toHaveAttribute("data-overloaded", "true");
  await expect(day(page, t0)).toHaveClass(/border-red-500/);

  // Raising the limit to 10 hours clears the warning.
  const limit = page.getByLabel("Maximum hours per day");
  await limit.fill("10");
  await limit.press("Enter");
  await expect(day(page, t0)).toHaveAttribute("data-overloaded", "false");

  await page.reload();
  await expect(page.getByLabel("Maximum hours per day")).toHaveValue("10");
});
