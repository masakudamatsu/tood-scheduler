import { expect, type Page } from "@playwright/test";

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
