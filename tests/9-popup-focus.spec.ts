import { expect, test, type Locator, type Page } from "@playwright/test";
import { addTask, card, newTaskPopup } from "./helpers";

/**
 * Press a key many times and check focus never lands on anything behind the
 * popup. Two things are fine:
 * - The browser may briefly move focus to its own toolbar, which leaves
 *   nothing focused in the page.
 * - With the delete question over the task details, WebKit may stop once on
 *   the task details box itself on the way back from the toolbar. Nothing in
 *   it can be reached, and the next Tab goes back into the question.
 */
async function expectFocusStaysIn(page: Page, popup: Locator, key: "Tab" | "Shift+Tab") {
  const handle = await popup.elementHandle();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press(key);
    const inside = await page.evaluate(
      (el) =>
        !document.activeElement ||
        document.activeElement === document.body ||
        document.activeElement instanceof HTMLDialogElement ||
        el!.contains(document.activeElement),
      handle
    );
    expect(inside, `focus left the popup after ${i + 1} presses of ${key}`).toBe(true);
  }
}

function details(page: Page) {
  return page.getByRole("dialog", { name: "Task details" });
}

/** Tap outside a popup, above it: on a phone, the popup is a sheet that fills the lower half. */
async function tapAbove(page: Page, popup: Locator) {
  const top = (await popup.boundingBox())!.y;
  await page.mouse.click(10, top / 2);
}

test("Tab and Shift+Tab stay inside the new task popup", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add a task" }).click();
  const popup = newTaskPopup(page);
  await expect(popup.getByLabel("Title")).toBeFocused();

  await expectFocusStaysIn(page, popup, "Tab");
  await expectFocusStaysIn(page, popup, "Shift+Tab");
});

test("closing the new task popup puts focus back on the + button", async ({ page }) => {
  await page.goto("/");
  const plus = page.getByRole("button", { name: "Add a task" });

  await plus.click();
  await page.keyboard.press("Escape");
  await expect(newTaskPopup(page)).toBeHidden();
  await expect(plus).toBeFocused();

  await plus.click();
  await newTaskPopup(page).getByRole("button", { name: "Cancel" }).click();
  await expect(newTaskPopup(page)).toBeHidden();
  await expect(plus).toBeFocused();

  await plus.click();
  await tapAbove(page, newTaskPopup(page));
  await expect(newTaskPopup(page)).toBeHidden();
  await expect(plus).toBeFocused();

  await plus.click();
  await newTaskPopup(page).getByLabel("Title").fill("Buy milk");
  await newTaskPopup(page).getByRole("button", { name: "Save" }).click();
  await expect(newTaskPopup(page)).toBeHidden();
  await expect(plus).toBeFocused();
});

test("Tab stays inside the task details popup, and closing it puts focus back on the card", async ({
  page,
}) => {
  await page.goto("/");
  await addTask(page, "Amazon pickup");
  const opener = card(page, "Amazon pickup").getByRole("button");

  await opener.click();
  await expectFocusStaysIn(page, details(page), "Tab");
  await page.keyboard.press("Escape");
  await expect(details(page)).toBeHidden();
  await expect(opener).toBeFocused();

  await opener.click();
  await details(page).getByRole("button", { name: "Save" }).click();
  await expect(details(page)).toBeHidden();
  await expect(opener).toBeFocused();
});

test("the delete question keeps focus inside it, and Escape closes only the question", async ({
  page,
}) => {
  await page.goto("/");
  await addTask(page, "Amazon pickup");
  await card(page, "Amazon pickup").getByRole("button").click();
  const deleteButton = details(page).getByRole("button", { name: "Delete" });
  await deleteButton.click();

  const question = page.getByRole("alertdialog", { name: "Delete this task?" });
  await expect(question.getByRole("button", { name: "Cancel" })).toBeFocused();
  await expectFocusStaysIn(page, question, "Tab");

  await page.keyboard.press("Escape");
  await expect(question).toBeHidden();
  await expect(details(page)).toBeVisible();
  await expect(deleteButton).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(details(page)).toBeHidden();
  await expect(card(page, "Amazon pickup").getByRole("button")).toBeFocused();
});

test("a tap outside still closes popups in browsers without closedby, like Safari", async ({
  page,
}) => {
  // Make Chromium act like Safari: no closedBy property, and no closedby
  // attribute on a dialog when it opens.
  await page.addInitScript(() => {
    delete (HTMLDialogElement.prototype as { closedBy?: string }).closedBy;
    const showModal = HTMLDialogElement.prototype.showModal;
    HTMLDialogElement.prototype.showModal = function () {
      this.removeAttribute("closedby");
      showModal.call(this);
    };
  });
  await page.goto("/");
  await addTask(page, "Amazon pickup");

  // A tap on the popup's own padding keeps it open.
  await card(page, "Amazon pickup").getByRole("button").click();
  const box = (await details(page).boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + 4);
  await expect(details(page)).toBeVisible();

  // A tap outside the delete question closes only the question.
  await details(page).getByRole("button", { name: "Delete" }).click();
  const question = page.getByRole("alertdialog", { name: "Delete this task?" });
  await expect(question).toBeVisible();
  await tapAbove(page, question);
  await expect(question).toBeHidden();
  await expect(details(page)).toBeVisible();

  await tapAbove(page, details(page));
  await expect(details(page)).toBeHidden();
  await expect(card(page, "Amazon pickup")).toBeVisible();
});
