import { test, expect } from "@playwright/test"

import { routes } from "@client/web/routes"

test.describe("HomePage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.home)
  })

  test("displays homepage content correctly", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()

    await expect(
      page.getByRole("heading", { name: /caches/i, level: 3 })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: /challenges/i, level: 3 })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: /rewards/i, level: 3 })
    ).toBeVisible()

    await expect(page.getByRole("button", { name: /App Store/i })).toBeVisible()

    await expect(
      page.getByRole("button", { name: /Google Play/i })
    ).toBeVisible()

    await expect(page.getByRole("link", { name: /Lootopia/i })).toBeVisible()

    await expect(page.getByRole("button", { name: /Login/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /Register/i })).toBeVisible()
  })
})
