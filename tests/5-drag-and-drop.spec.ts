import { expect, test } from "@playwright/test";
import { addDays, addTask, card, day, today } from "./helpers";

test("dragging a card to another day changes its date", async ({ page }) => {
  await page.goto("/");
  const t0 = await today(page);
  const t1 = await addDays(page, t0, 1);

  await addTask(page, "Move me", { date: t0, hours: 2 });

  const from = await card(page, "Move me").boundingBox();
  const to = await day(page, t1).boundingBox();
  await page.mouse.move(from!.x + 10, from!.y + from!.height / 2);
  await page.mouse.down();
  // Move in small steps so the drag library sees a real drag.
  await page.mouse.move(from!.x + 10, from!.y + from!.height / 2 + 20, { steps: 5 });
  await page.mouse.move(to!.x + 20, to!.y + to!.height / 2, { steps: 10 });
  await page.mouse.up();

  await expect(day(page, t1).getByText("Move me")).toBeVisible();
  await expect(day(page, t0).getByText("Move me")).toHaveCount(0);

  await page.reload();
  await expect(day(page, t1).getByText("Move me")).toBeVisible();
});
