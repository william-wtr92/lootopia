import { test, expect } from "@playwright/test"

test.describe("404 Not Found Page", () => {
  test("displays the 404 content on unknown route", async ({ page }) => {
    await page.goto("does-not-exist")

    await expect(
      page.getByRole("heading", { level: 1, name: /404.*not found/i })
    ).toBeVisible()

    await expect(
      page.getByText(/sorry, the page you are looking for does not exist/i)
    ).toBeVisible()

    await expect(
      page.getByRole("button", { name: /back to home/i })
    ).toBeVisible()
  })
})
