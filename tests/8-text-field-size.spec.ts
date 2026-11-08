import { expect, test, type Locator } from "@playwright/test";
import { addTask, card } from "./helpers";

// iOS browsers zoom the page when the user taps a text field whose font size
// is under 16px. Playwright can't run iOS Safari, so we check the font size.
async function smallFields(scope: Locator): Promise<string[]> {
  return scope
    .locator("input:not([type=checkbox]), textarea, select")
    .evaluateAll((els) =>
      els
        .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
        .map((el) => el.getAttribute("aria-label") ?? el.outerHTML.slice(0, 80))
    );
}

test("text fields on the main page are at least 16px, so iOS doesn't zoom", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("form", { name: "Add a task" })).toBeVisible();
  expect(await smallFields(page.locator("body"))).toEqual([]);
});

test("text fields in the task sheet are at least 16px, so iOS doesn't zoom", async ({ page }) => {
  await page.goto("/");
  await addTask(page, "Write report");
  await card(page, "Write report").getByRole("button").click();
  const dialog = page.getByRole("dialog", { name: "Task details" });
  await expect(dialog.getByLabel("Note")).toBeVisible();
  expect(await smallFields(dialog)).toEqual([]);
});
