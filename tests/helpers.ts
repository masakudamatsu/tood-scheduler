import { expect, type Locator, type Page } from "@playwright/test";

/** Today's date as "YYYY-MM-DD", in the browser's own time zone. */
export async function today(page: Page): Promise<string> {
  return page.evaluate(() => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  });
}

export async function addDays(page: Page, key: string, days: number): Promise<string> {
  return page.evaluate(
    ([k, n]) => {
      const [y, m, d] = (k as string).split("-").map(Number);
      const date = new Date(y, m - 1, d + (n as number));
      const p = (x: number) => String(x).padStart(2, "0");
      return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
    },
    [key, days]
  );
}

export async function addTask(
  page: Page,
  title: string,
  opts: { date?: string; hours?: number } = {}
) {
  const form = page.getByRole("form", { name: "Add a task" });
  await form.getByLabel("What to do").fill(title);
  if (opts.date) await form.getByLabel("Date").fill(opts.date);
  if (opts.hours !== undefined) await form.getByLabel("Estimated hours").fill(String(opts.hours));
  await form.getByRole("button", { name: "Add" }).click();
  await expect(card(page, title)).toBeVisible();
}

export function day(page: Page, key: string) {
  return page.getByTestId(`day-${key}`);
}

export function card(page: Page, title: string) {
  return page.locator(`[data-testid="task-card"][data-task-title="${title}"]`);
}

/** Titles of the cards in a day, top to bottom. */
export async function titlesIn(page: Page, key: string): Promise<string[]> {
  return day(page, key)
    .getByTestId("task-card")
    .evaluateAll((els) => els.map((el) => el.getAttribute("data-task-title") ?? ""));
}

/**
 * Drag a card with the mouse and drop it on a point inside `target`.
 * `at` picks where in the target: "top", "center" (default) or "bottom".
 */
export async function dragCard(
  page: Page,
  title: string,
  target: Locator,
  at: "top" | "center" | "bottom" = "center"
) {
  const from = (await card(page, title).boundingBox())!;
  const to = (await target.boundingBox())!;
  const y = { top: to.y + 4, center: to.y + to.height / 2, bottom: to.y + to.height - 4 }[at];
  await page.mouse.move(from.x + 10, from.y + from.height / 2);
  await page.mouse.down();
  // Move in small steps so the drag library sees a real drag.
  await page.mouse.move(from.x + 10, from.y + from.height / 2 + 10, { steps: 5 });
  await page.mouse.move(to.x + 20, y, { steps: 15 });
  await page.mouse.up();
}
