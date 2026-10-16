import { expect, test } from "@playwright/test";
import { addDays, addTask, card, dragCard, titlesIn, today } from "./helpers";

test("dragging a card up within a day reorders it, and the order survives a reload", async ({ page }) => {
  await page.goto("/");
  const t0 = await today(page);
  await addTask(page, "First", { date: t0 });
  await addTask(page, "Second", { date: t0 });
  await addTask(page, "Third", { date: t0 });
  expect(await titlesIn(page, t0)).toEqual(["First", "Second", "Third"]);

  await dragCard(page, "Third", card(page, "First"));
  await expect.poll(() => titlesIn(page, t0)).toEqual(["Third", "First", "Second"]);

  await page.reload();
  await expect.poll(() => titlesIn(page, t0)).toEqual(["Third", "First", "Second"]);
});

test("dragging a card down within a day reorders it", async ({ page }) => {
  await page.goto("/");
  const t0 = await today(page);
  await addTask(page, "First", { date: t0 });
  await addTask(page, "Second", { date: t0 });
  await addTask(page, "Third", { date: t0 });

  await dragCard(page, "First", card(page, "Third"));
  await expect.poll(() => titlesIn(page, t0)).toEqual(["Second", "Third", "First"]);
});

test("dropping a card onto a card in another day puts it at that spot", async ({ page }) => {
  await page.goto("/");
  const t0 = await today(page);
  const t1 = await addDays(page, t0, 1);
  await addTask(page, "Tomorrow A", { date: t1 });
  await addTask(page, "Tomorrow B", { date: t1 });
  await addTask(page, "Mover", { date: t0 });

  // Drop on the top edge of "Tomorrow A", so it lands above it.
  await dragCard(page, "Mover", card(page, "Tomorrow A"), "top");
  await expect.poll(() => titlesIn(page, t1)).toEqual(["Mover", "Tomorrow A", "Tomorrow B"]);
  expect(await titlesIn(page, t0)).toEqual([]);

  // A new task added to that day goes to the bottom.
  await addTask(page, "Tomorrow C", { date: t1 });
  await expect.poll(() => titlesIn(page, t1)).toEqual([
    "Mover",
    "Tomorrow A",
    "Tomorrow B",
    "Tomorrow C",
  ]);

  await page.reload();
  await expect.poll(() => titlesIn(page, t1)).toEqual([
    "Mover",
    "Tomorrow A",
    "Tomorrow B",
    "Tomorrow C",
  ]);
});
