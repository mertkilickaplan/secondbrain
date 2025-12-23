import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/app');

        // Skip if not logged in
        if (page.url().includes('/login')) {
            test.skip();
        }
    });

    test('should open search with keyboard shortcut', async ({ page }) => {
        // Press Cmd+K (or Ctrl+K on Windows/Linux)
        const isMac = process.platform === 'darwin';
        await page.keyboard.press(isMac ? 'Meta+K' : 'Control+K');

        // Search modal should appear
        const searchInput = page.getByPlaceholder(/search/i);
        await expect(searchInput).toBeVisible();
        await expect(searchInput).toBeFocused();
    });

    test('should show instant search results', async ({ page }) => {
        // Open search
        await page.keyboard.press('Meta+K');

        const searchInput = page.getByPlaceholder(/search/i);
        await expect(searchInput).toBeVisible();

        // Type search query
        await searchInput.fill('test');

        // Wait for results to appear
        await page.waitForTimeout(500);

        // Should see results or "no results" message
        const resultsContainer = page.locator('[role="listbox"], [role="list"]');
        await expect(resultsContainer).toBeVisible({ timeout: 2000 });
    });

    test('should navigate results with arrow keys', async ({ page }) => {
        // Open search
        await page.keyboard.press('Meta+K');

        const searchInput = page.getByPlaceholder(/search/i);
        await searchInput.fill('test');

        // Wait for results
        await page.waitForTimeout(500);

        // Press down arrow to navigate
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');

        // Press up arrow
        await page.keyboard.press('ArrowUp');

        // One result should be highlighted
        const highlightedResult = page.locator('[aria-selected="true"]');
        await expect(highlightedResult).toBeVisible({ timeout: 1000 });
    });

    test('should select note with Enter key', async ({ page }) => {
        // Open search
        await page.keyboard.press('Meta+K');

        const searchInput = page.getByPlaceholder(/search/i);
        await searchInput.fill('test');

        // Wait for results
        await page.waitForTimeout(500);

        // Navigate to first result
        await page.keyboard.press('ArrowDown');

        // Select with Enter
        await page.keyboard.press('Enter');

        // Search should close and note detail should open
        await expect(searchInput).not.toBeVisible({ timeout: 1000 });
    });

    test('should close search with Escape key', async ({ page }) => {
        // Open search
        await page.keyboard.press('Meta+K');

        const searchInput = page.getByPlaceholder(/search/i);
        await expect(searchInput).toBeVisible();

        // Press Escape
        await page.keyboard.press('Escape');

        // Search should close
        await expect(searchInput).not.toBeVisible();
    });

    test('should search by tag', async ({ page }) => {
        // Open search
        await page.keyboard.press('Meta+K');

        const searchInput = page.getByPlaceholder(/search/i);

        // Search with # prefix for tags
        await searchInput.fill('#important');

        // Wait for results
        await page.waitForTimeout(500);

        // Should show tag search results
        const resultsContainer = page.locator('[role="listbox"], [role="list"]');
        await expect(resultsContainer).toBeVisible({ timeout: 2000 });
    });

    test('should handle Turkish character search', async ({ page }) => {
        // Open search
        await page.keyboard.press('Meta+K');

        const searchInput = page.getByPlaceholder(/search/i);

        // Search with Turkish characters
        await searchInput.fill('ekşi');

        // Wait for results
        await page.waitForTimeout(500);

        // Should show results (normalized search)
        const resultsContainer = page.locator('[role="listbox"], [role="list"]');
        await expect(resultsContainer).toBeVisible({ timeout: 2000 });
    });

    test('should show empty state for no results', async ({ page }) => {
        // Open search
        await page.keyboard.press('Meta+K');

        const searchInput = page.getByPlaceholder(/search/i);

        // Search for something that doesn't exist
        await searchInput.fill('xyzabc123nonexistent');

        // Wait for search to complete
        await page.waitForTimeout(500);

        // Should show "no results" message
        await expect(page.getByText(/no results|nothing found/i)).toBeVisible({ timeout: 2000 });
    });
});
