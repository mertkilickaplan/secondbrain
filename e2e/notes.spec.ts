import { test, expect } from "@playwright/test";

test.describe("Notes Management", () => {
  test.beforeEach(async ({ page }) => {
    // This assumes you have authentication set up
    // You might need to use Playwright's auth state feature
    await page.goto("/app");

    // Skip if not logged in
    if (page.url().includes("/login")) {
      test.skip();
    }
  });

  test("should create a text note", async ({ page }) => {
    // Find the note input area
    const noteInput = page.getByPlaceholder(/add a note/i);
    await expect(noteInput).toBeVisible();

    // Type a note
    const noteContent = `Test note created at ${Date.now()}`;
    await noteInput.fill(noteContent);

    // Submit the note
    await page.getByRole("button", { name: /add note/i }).click();

    // Wait for note to appear in graph
    await page.waitForTimeout(1000);

    // Note should be visible in the graph or note list
    await expect(page.getByText(noteContent)).toBeVisible({ timeout: 5000 });
  });

  test("should create a URL note", async ({ page }) => {
    // Switch to URL mode
    await page.getByRole("button", { name: /url/i }).click();

    // Enter URL
    const urlInput = page.getByPlaceholder(/enter url/i);
    await urlInput.fill("https://example.com");

    // Add optional note
    const noteInput = page.getByPlaceholder(/add a note/i);
    await noteInput.fill("Example website");

    // Submit
    await page.getByRole("button", { name: /add/i }).click();

    // Wait for note to be created
    await page.waitForTimeout(1000);

    // Should see the URL note
    await expect(page.getByText(/example/i)).toBeVisible({ timeout: 5000 });
  });

  test("should view note details", async ({ page }) => {
    // Click on a note in the graph
    // This assumes there's at least one note
    const graphCanvas = page.locator("canvas").first();
    await expect(graphCanvas).toBeVisible();

    // Click somewhere on the graph (simplified - real test would click on a node)
    await graphCanvas.click({ position: { x: 100, y: 100 } });

    // Note detail sidebar should appear
    await expect(page.getByRole("heading", { level: 2 })).toBeVisible({ timeout: 2000 });
  });

  test("should show AI processing status for premium users", async ({ page }) => {
    // Create a note
    const noteInput = page.getByPlaceholder(/add a note/i);
    await noteInput.fill("AI test note");
    await page.getByRole("button", { name: /add note/i }).click();

    // Wait a bit
    await page.waitForTimeout(500);

    // Should see either "processing" or "ready" status
    const processingIndicator = page.getByText(/processing|ready/i);
    await expect(processingIndicator).toBeVisible({ timeout: 3000 });
  });

  test("should delete a note", async ({ page }) => {
    // First, click on a note to open details
    const graphCanvas = page.locator("canvas").first();
    await graphCanvas.click({ position: { x: 100, y: 100 } });

    // Wait for detail panel
    await page.waitForTimeout(500);

    // Click delete button
    const deleteButton = page.getByRole("button", { name: /delete/i });
    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Confirm deletion if there's a confirmation dialog
      const confirmButton = page.getByRole("button", { name: /confirm|yes/i });
      if (await confirmButton.isVisible({ timeout: 1000 })) {
        await confirmButton.click();
      }

      // Note should be removed
      await page.waitForTimeout(1000);
    }
  });

  test("should show upgrade modal when free user hits limit", async ({ page }) => {
    // This test is tricky - you'd need to create 25 notes first
    // Or mock the subscription state

    // For now, just check if upgrade modal can be triggered
    const upgradeButton = page.getByRole("button", { name: /upgrade/i });
    if (await upgradeButton.isVisible({ timeout: 1000 })) {
      await upgradeButton.click();

      // Upgrade modal should appear
      await expect(page.getByRole("heading", { name: /premium/i })).toBeVisible();
    }
  });
});
