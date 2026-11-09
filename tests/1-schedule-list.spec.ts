import { expect, test } from "@playwright/test";
import { addDays, addTask, card, day, today } from "./helpers";

test("tasks appear under their day, in date order, and survive a reload", async ({ page }) => {
  await page.goto("/");
  const t0 = await today(page);
  const t2 = await addDays(page, t0, 2);

  // The new task form looks like the task editor, minus Delete and Cancel.
  const form = page.getByRole("form", { name: "Add a task" });
  await expect(form.getByLabel("Note")).toBeVisible();
  await expect(form.getByRole("button")).toHaveText(["Add"]);

  await addTask(page, "Write report", { date: t0, note: "Draft: https://example.com/report" });
  await addTask(page, "Call the bank", { date: t2 });

  // The form is cleared for the next task.
  await expect(form.getByLabel("Title")).toHaveValue("");
  await expect(form.getByLabel("Note")).toHaveValue("");

  await expect(day(page, t0).getByText("Write report")).toBeVisible();
  await expect(day(page, t2).getByText("Call the bank")).toBeVisible();

  // Days are listed top to bottom in date order, like a schedule view.
  const todayBox = await day(page, t0).boundingBox();
  const laterBox = await day(page, t2).boundingBox();
  expect(laterBox!.y).toBeGreaterThan(todayBox!.y);

  await page.reload();
  await expect(card(page, "Write report")).toBeVisible();
  await expect(day(page, t2).getByText("Call the bank")).toBeVisible();

  // The note typed in the new task form was saved with the task.
  await card(page, "Write report").getByRole("button").click();
  await expect(page.getByRole("dialog").getByTestId("note-view")).toHaveText(
    "Draft: https://example.com/report"
  );
});
