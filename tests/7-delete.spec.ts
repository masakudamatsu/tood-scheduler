import { expect, test, type Page } from "@playwright/test";
import { addTask, card } from "./helpers";

async function pressDelete(page: Page, title: string) {
  await card(page, title).getByRole("button").click();
  await page
    .getByRole("dialog", { name: "Task details" })
    .getByRole("button", { name: "Delete" })
    .click();
  return page.getByRole("alertdialog", { name: "Delete this task?" });
}

test("Delete asks first, near the top of the screen, and Cancel keeps the task", async ({ page }) => {
  await page.goto("/");
  await addTask(page, "Amazon pickup");

  const question = await pressDelete(page, "Amazon pickup");
  await expect(question).toBeVisible();
  await expect(card(page, "Amazon pickup")).toBeVisible();

  // Centered left to right, but sitting in the top half of the screen.
  const box = (await question.boundingBox())!;
  const screen = page.viewportSize()!;
  expect(Math.abs(box.x + box.width / 2 - screen.width / 2)).toBeLessThan(2);
  expect(box.y + box.height).toBeLessThan(screen.height / 2);

  await question.getByRole("button", { name: "Cancel" }).click();
  await expect(question).toBeHidden();
  await expect(page.getByRole("dialog", { name: "Task details" })).toBeVisible();
  await expect(card(page, "Amazon pickup")).toBeVisible();
});

test("clicking outside the question, or pressing Escape, keeps the task", async ({ page }) => {
  await page.goto("/");
  await addTask(page, "Amazon pickup");

  const question = await pressDelete(page, "Amazon pickup");
  const screen = page.viewportSize()!;
  await page.mouse.click(10, screen.height - 10);
  await expect(question).toBeHidden();
  await expect(page.getByRole("dialog", { name: "Task details" })).toBeVisible();

  await page.getByRole("dialog", { name: "Task details" }).getByRole("button", { name: "Delete" }).click();
  await expect(question).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(question).toBeHidden();
  await expect(page.getByRole("dialog", { name: "Task details" })).toBeVisible();
  await expect(card(page, "Amazon pickup")).toBeVisible();
});

test("pressing Delete in the question deletes the task", async ({ page }) => {
  await page.goto("/");
  await addTask(page, "Amazon pickup");

  const question = await pressDelete(page, "Amazon pickup");
  await question.getByRole("button", { name: "Delete" }).click();
  await expect(question).toBeHidden();
  await expect(page.getByRole("dialog", { name: "Task details" })).toBeHidden();
  await expect(card(page, "Amazon pickup")).toHaveCount(0);
});
