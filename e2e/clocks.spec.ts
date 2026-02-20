import { test, expect } from '@playwright/test';

test.describe('Clocks', () => {
  test('should show city select dropdown', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#city-select')).toBeVisible();
  });

  test('should show add city button', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#btn-add-city')).toBeVisible();
  });

  test('should switch to converter tab', async ({ page }) => {
    await page.goto('/');
    const converterTab = page.locator('.tab-btn[aria-controls="panel-converter"]');
    await converterTab.click();
    await expect(page.locator('#conv-source-tz, #conv-time').first()).toBeVisible();
  });

  test('should switch to planner tab', async ({ page }) => {
    await page.goto('/');
    const plannerTab = page.locator('.tab-btn[aria-controls="panel-planner"]');
    await plannerTab.click();
    await expect(page.locator('#timeline-table')).toBeVisible();
  });

  test('should show day/night indicators', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.day-night-icon').first()).toBeVisible();
  });

  test('should have multiple clock cards', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('.clock-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should add a city', async ({ page }) => {
    await page.goto('/');
    const select = page.locator('#city-select');
    // Select a different city
    await select.selectOption({ index: 1 });
    await page.locator('#btn-add-city').click();
  });
});
