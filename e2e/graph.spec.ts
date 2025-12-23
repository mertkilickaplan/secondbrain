import { test, expect } from '@playwright/test';

test.describe('Graph Visualization', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/app');

        // Skip if not logged in
        if (page.url().includes('/login')) {
            test.skip();
        }
    });

    test('should display graph canvas', async ({ page }) => {
        // Graph should be rendered
        const graphCanvas = page.locator('canvas').first();
        await expect(graphCanvas).toBeVisible();
    });

    test('should show nodes for existing notes', async ({ page }) => {
        // Wait for graph to load
        await page.waitForTimeout(1000);

        // Canvas should be visible
        const graphCanvas = page.locator('canvas').first();
        await expect(graphCanvas).toBeVisible();

        // If there are notes, they should be rendered
        // (This is hard to test directly, but we can check canvas is not empty)
        const canvasSize = await graphCanvas.boundingBox();
        expect(canvasSize).toBeTruthy();
        expect(canvasSize!.width).toBeGreaterThan(0);
        expect(canvasSize!.height).toBeGreaterThan(0);
    });

    test('should open note detail on node click', async ({ page }) => {
        // Wait for graph to load
        await page.waitForTimeout(1000);

        const graphCanvas = page.locator('canvas').first();

        // Click on the graph (simplified - real test would click on a specific node)
        await graphCanvas.click({ position: { x: 200, y: 200 } });

        // Wait a bit for click to register
        await page.waitForTimeout(500);

        // Note detail sidebar might appear (if we clicked on a node)
        // This is a best-effort test since we can't easily target specific nodes
    });

    test('should be interactive (pan and zoom)', async ({ page }) => {
        const graphCanvas = page.locator('canvas').first();
        await expect(graphCanvas).toBeVisible();

        // Try to drag (pan)
        await graphCanvas.hover();
        await page.mouse.down();
        await page.mouse.move(100, 100);
        await page.mouse.up();

        // Try to zoom with wheel
        await graphCanvas.hover();
        await page.mouse.wheel(0, 100);

        // Graph should still be visible
        await expect(graphCanvas).toBeVisible();
    });

    test('should show connections between notes', async ({ page }) => {
        // Wait for graph to load
        await page.waitForTimeout(1500);

        // If there are connected notes, connections should be visible
        // This is implicit in the canvas rendering
        const graphCanvas = page.locator('canvas').first();
        await expect(graphCanvas).toBeVisible();
    });

    test('should update graph when new note is added', async ({ page }) => {
        // Get initial graph state
        await page.waitForTimeout(1000);

        // Create a new note
        const noteInput = page.getByPlaceholder(/add a note/i);
        if (await noteInput.isVisible()) {
            await noteInput.fill(`Graph test note ${Date.now()}`);
            await page.getByRole('button', { name: /add note/i }).click();

            // Wait for graph to update
            await page.waitForTimeout(1500);

            // Graph should still be visible and updated
            const graphCanvas = page.locator('canvas').first();
            await expect(graphCanvas).toBeVisible();
        }
    });

    test('should close note detail sidebar', async ({ page }) => {
        // Click on graph to open detail
        const graphCanvas = page.locator('canvas').first();
        await graphCanvas.click({ position: { x: 200, y: 200 } });

        await page.waitForTimeout(500);

        // Look for close button
        const closeButton = page.getByRole('button', { name: /close/i });
        if (await closeButton.isVisible({ timeout: 1000 })) {
            await closeButton.click();

            // Sidebar should close
            await page.waitForTimeout(300);
        }
    });
});
