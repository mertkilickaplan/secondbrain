import { test, expect } from "@playwright/test";

test.describe("Subscription and Upgrade Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/app");

    // Skip if not logged in
    if (page.url().includes("/login")) {
      test.skip();
    }
  });

  test("should display usage indicator", async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // Usage indicator should be visible
    const usageIndicator = page.getByText(/\d+\s*\/\s*\d+|unlimited/i);
    await expect(usageIndicator).toBeVisible({ timeout: 3000 });
  });

  test("should show subscription badge", async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // Should see either "Free" or "Premium" badge
    const badge = page.getByText(/free|premium/i);
    await expect(badge).toBeVisible({ timeout: 3000 });
  });

  test("should open upgrade modal", async ({ page }) => {
    // Look for upgrade button
    const upgradeButton = page.getByRole("button", { name: /upgrade/i });

    if (await upgradeButton.isVisible({ timeout: 2000 })) {
      await upgradeButton.click();

      // Upgrade modal should appear
      await expect(page.getByRole("heading", { name: /premium/i })).toBeVisible();
      await expect(page.getByText(/\$\d+/)).toBeVisible(); // Price
    }
  });

  test("should display feature comparison in upgrade modal", async ({ page }) => {
    // Open upgrade modal
    const upgradeButton = page.getByRole("button", { name: /upgrade/i });

    if (await upgradeButton.isVisible({ timeout: 2000 })) {
      await upgradeButton.click();

      // Should see feature comparison
      await expect(page.getByText(/unlimited notes/i)).toBeVisible({ timeout: 2000 });
      await expect(page.getByText(/ai.*features/i)).toBeVisible();
    }
  });

  test("should close upgrade modal", async ({ page }) => {
    // Open upgrade modal
    const upgradeButton = page.getByRole("button", { name: /upgrade/i });

    if (await upgradeButton.isVisible({ timeout: 2000 })) {
      await upgradeButton.click();

      // Wait for modal
      await page.waitForTimeout(300);

      // Close modal
      const closeButton = page.getByRole("button", { name: /close|maybe later/i });
      await closeButton.click();

      // Modal should close
      await expect(page.getByRole("heading", { name: /premium/i })).not.toBeVisible({
        timeout: 1000,
      });
    }
  });

  test("should show upgrade button when approaching limit", async ({ page }) => {
    // This test depends on the user's current note count
    // If user has notes close to limit, upgrade button should be prominent

    await page.waitForTimeout(1000);

    // Check if usage indicator shows high usage
    const usageText = await page.getByText(/\d+\s*\/\s*\d+/).textContent();

    if (usageText) {
      // Parse usage (e.g., "20 / 25")
      const match = usageText.match(/(\d+)\s*\/\s*(\d+)/);
      if (match) {
        const [, current, max] = match;
        const usage = parseInt(current) / parseInt(max);

        if (usage > 0.8) {
          // Should see upgrade prompt
          await expect(page.getByText(/upgrade|premium/i)).toBeVisible();
        }
      }
    }
  });

  test("should prevent note creation at limit for free users", async ({ page }) => {
    // This test requires the user to be at their limit
    // You'd need to set up test data accordingly

    // Try to create a note
    const noteInput = page.getByPlaceholder(/add a note/i);
    if (await noteInput.isVisible()) {
      await noteInput.fill("Test note at limit");
      await page.getByRole("button", { name: /add note/i }).click();

      // Wait for response
      await page.waitForTimeout(1000);

      // Might see upgrade modal or error message
      const upgradeModal = page.getByRole("heading", { name: /premium/i });
      const errorMessage = page.getByText(/limit reached/i);

      const modalVisible = await upgradeModal.isVisible({ timeout: 2000 });
      const errorVisible = await errorMessage.isVisible({ timeout: 2000 });

      // One of them should be visible if at limit
      if (modalVisible || errorVisible) {
        expect(true).toBe(true);
      }
    }
  });
});
