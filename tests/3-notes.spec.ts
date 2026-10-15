import { expect, test } from "@playwright/test";
import { addTask, card } from "./helpers";

test("a pasted URL in a note becomes a clickable link", async ({ page }) => {
  await page.goto("/");
  await addTask(page, "Book flights");

  await card(page, "Book flights").getByRole("button").click();
  const dialog = page.getByRole("dialog", { name: "Task details" });
  await dialog
    .getByLabel("Note")
    .fill("Compare prices here: https://example.com/flights?from=TYO. Then book.");
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog).toBeHidden();

  // Tap the task again to see the note.
  await card(page, "Book flights").getByRole("button").click();
  const link = page.getByRole("dialog").getByRole("link", { name: "https://example.com/flights?from=TYO" });
  await expect(link).toHaveAttribute("href", "https://example.com/flights?from=TYO");
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(page.getByTestId("note-view")).toContainText("Then book.");
});
