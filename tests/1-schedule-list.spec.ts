import { expect, test } from "@playwright/test";
import { addDays, addTask, card, day, newTaskPopup, today } from "./helpers";

test("the + button opens a new task popup; Cancel or a tap outside closes it", async ({
  page,
}) => {
  await page.goto("/");

  // No new task form at the top of the page any more.
  await expect(page.getByRole("form")).toHaveCount(0);

  // A 48px round button sits at the bottom right of the screen.
  const button = page.getByRole("button", { name: "Add a task" });
  const box = (await button.boundingBox())!;
  const screen = page.viewportSize()!;
  expect(box.width).toBe(48);
  expect(box.height).toBe(48);
  await expect(button).toHaveClass(/rounded-full/);
  expect(box.x + box.width).toBeGreaterThan(screen.width - 48);
  expect(box.y + box.height).toBeGreaterThan(screen.height - 48);

  // It stays there while the page scrolls.
  await page.mouse.wheel(0, 2000);
  await expect
    .poll(async () => (await button.boundingBox())!.y)
    .toBeCloseTo(box.y, 0);

  const popup = newTaskPopup(page);
  await expect(popup).toBeHidden();

  // The popup looks like the task editor, minus Delete.
  await button.click();
  await expect(popup).toBeVisible();
  await expect(popup.getByLabel("Title")).toBeFocused();
  await expect(popup.getByLabel("Note")).toBeVisible();
  await expect(popup.getByRole("button")).toHaveText(["Cancel", "Save"]);

  // Cancel closes it without adding anything.
  await popup.getByLabel("Title").fill("Never mind");
  await popup.getByRole("button", { name: "Cancel" }).click();
  await expect(popup).toBeHidden();
  await expect(card(page, "Never mind")).toHaveCount(0);

  // So does a tap outside the popup. Opening it again starts with empty fields.
  await button.click();
  await expect(popup.getByLabel("Title")).toHaveValue("");
  await popup.getByLabel("Title").fill("Never mind");
  await page.mouse.click(10, screen.height / 2);
  await expect(popup).toBeHidden();
  await expect(card(page, "Never mind")).toHaveCount(0);
});

test("tasks appear under their day, in date order, and survive a reload", async ({ page }) => {
  await page.goto("/");
  const t0 = await today(page);
  const t2 = await addDays(page, t0, 2);

  // addTask() fills in the popup, presses Save, and checks the popup closes.
  await addTask(page, "Write report", {
    date: t0,
    hours: 1.5,
    note: "Draft: https://example.com/report",
  });
  await addTask(page, "Call the bank", { date: t2 });

  await expect(day(page, t0).getByText("Write report")).toBeVisible();
  await expect(day(page, t0).getByText("1.5 h")).toBeVisible();
  await expect(day(page, t2).getByText("Call the bank")).toBeVisible();

  // Days are listed top to bottom in date order, like a schedule view.
  const todayBox = await day(page, t0).boundingBox();
  const laterBox = await day(page, t2).boundingBox();
  expect(laterBox!.y).toBeGreaterThan(todayBox!.y);

  await page.reload();
  await expect(card(page, "Write report")).toBeVisible();
  await expect(day(page, t2).getByText("Call the bank")).toBeVisible();

  // The note typed in the new task popup was saved with the task.
  await card(page, "Write report").getByRole("button").click();
  await expect(page.getByRole("dialog").getByTestId("note-view")).toHaveText(
    "Draft: https://example.com/report"
  );
});
