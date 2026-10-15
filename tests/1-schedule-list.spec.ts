import { expect, test } from "@playwright/test";
import { addDays, addTask, card, day, today } from "./helpers";

test("tasks appear under their day, in date order, and survive a reload", async ({ page }) => {
  await page.goto("/");
  const t0 = await today(page);
  const t2 = await addDays(page, t0, 2);

  await addTask(page, "Write report", { date: t0 });
  await addTask(page, "Call the bank", { date: t2 });

  await expect(day(page, t0).getByText("Write report")).toBeVisible();
  await expect(day(page, t2).getByText("Call the bank")).toBeVisible();

  // Days are listed top to bottom in date order, like a schedule view.
  const todayBox = await day(page, t0).boundingBox();
  const laterBox = await day(page, t2).boundingBox();
  expect(laterBox!.y).toBeGreaterThan(todayBox!.y);

  await page.reload();
  await expect(card(page, "Write report")).toBeVisible();
  await expect(day(page, t2).getByText("Call the bank")).toBeVisible();
});
