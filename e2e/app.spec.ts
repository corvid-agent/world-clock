import { test, expect } from '@playwright/test';

test.describe('App', () => {
  test('should load with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/World Clock/i);
  });

  test('should show clock grid', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#clock-grid')).toBeVisible();
  });

  test('should show clock cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.clock-card').first()).toBeVisible();
  });

  test('should show tab buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.tab-btn').first()).toBeVisible();
  });
});
