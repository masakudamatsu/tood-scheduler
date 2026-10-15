import { expect, test } from "@playwright/test";
import { addTask, card } from "./helpers";

test("ticking a task marks it done and stays done after reload", async ({ page }) => {
  await page.goto("/");
  await addTask(page, "Water plants");

  const box = page.getByRole("checkbox", { name: 'Mark "Water plants" as done' });
  await box.check();
  await expect(box).toBeChecked();
  await expect(card(page, "Water plants").getByText("Water plants")).toHaveClass(/line-through/);

  await page.reload();
  await expect(page.getByRole("checkbox", { name: 'Mark "Water plants" as done' })).toBeChecked();

  // Ticking doesn't open the task details.
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
