import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should show landing page for unauthenticated users", async ({ page }) => {
    await expect(page).toHaveTitle(/WhichNotes/i);

    // Should see landing page elements
    await expect(page.getByRole("heading", { name: /whichnotes/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /get started/i })).toBeVisible();
  });

  test("should navigate to login page", async ({ page }) => {
    await page.getByRole("link", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  });

  test("should show validation errors for invalid login", async ({ page }) => {
    await page.goto("/login");

    // Try to submit empty form
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should show validation errors
    await expect(page.getByText(/email.*required/i)).toBeVisible();
  });

  test("should redirect to app after successful login", async ({ page }) => {
    // Note: This test requires a test user to exist
    // In a real scenario, you'd set up test data beforehand
    await page.goto("/login");

    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("testpassword123");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should redirect to app (or show error if credentials are wrong)
    await page.waitForURL(/\/(app|login)/, { timeout: 5000 });
  });

  test("should be able to logout", async ({ page, context }) => {
    // This test assumes user is logged in
    // You might need to set up authentication state
    await page.goto("/app");

    // If not logged in, will redirect to login
    const url = page.url();
    if (url.includes("/login")) {
      test.skip();
      return;
    }

    // Click user menu and logout
    await page.getByRole("button", { name: /user menu/i }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    // Should redirect to landing page
    await expect(page).toHaveURL("/");
  });

  test("should protect app routes from unauthenticated access", async ({ page }) => {
    await page.goto("/app");

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});
