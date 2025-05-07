import { test, expect } from "@playwright/test"
import { v4 as uuidv4 } from "uuid"

import { routes } from "@client/web/routes"

test.describe("Artifact Viewer Page", () => {
  test("displays the artifact modal correctly", async ({ page }) => {
    await page.goto(routes.artifacts.viewerDetail(uuidv4()))

    await expect(page.getByRole("heading", { name: /artifact/i })).toBeVisible()

    await expect(page.getByRole("dialog")).toBeVisible()
  })
})
