import { test, expect } from '@playwright/test';

test.describe('App basic loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('World Clock & Timezone Converter');
  });

  test('should display the header with app name', async ({ page }) => {
    const heading = page.locator('.header h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('World Clock');
  });

  test('should display the header subtitle', async ({ page }) => {
    const subtitle = page.locator('.header p');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toHaveText('Timezone converter & meeting planner');
  });

  test('should display three tab buttons', async ({ page }) => {
    const tabs = page.locator('.tab-btn');
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(0)).toHaveText('Clocks');
    await expect(tabs.nth(1)).toHaveText('Converter');
    await expect(tabs.nth(2)).toHaveText('Meeting Planner');
  });

  test('should have the Clocks tab active by default', async ({ page }) => {
    const clocksTab = page.locator('#tab-clocks');
    await expect(clocksTab).toHaveClass(/active/);
    await expect(clocksTab).toHaveAttribute('aria-selected', 'true');
  });

  test('should show the clocks panel by default', async ({ page }) => {
    const clocksPanel = page.locator('#panel-clocks');
    await expect(clocksPanel).toBeVisible();
    await expect(clocksPanel).toHaveClass(/active/);
  });

  test('should hide the converter panel by default', async ({ page }) => {
    const converterPanel = page.locator('#panel-converter');
    await expect(converterPanel).not.toBeVisible();
  });

  test('should hide the planner panel by default', async ({ page }) => {
    const plannerPanel = page.locator('#panel-planner');
    await expect(plannerPanel).not.toBeVisible();
  });

  test('should display the footer', async ({ page }) => {
    const footer = page.locator('.footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('p')).toContainText('World Clock');
  });

  test('should switch to the Converter tab on click', async ({ page }) => {
    await page.locator('#tab-converter').click();
    await expect(page.locator('#panel-converter')).toBeVisible();
    await expect(page.locator('#panel-clocks')).not.toBeVisible();
    await expect(page.locator('#tab-converter')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#tab-clocks')).toHaveAttribute('aria-selected', 'false');
  });

  test('should switch to the Meeting Planner tab on click', async ({ page }) => {
    await page.locator('#tab-planner').click();
    await expect(page.locator('#panel-planner')).toBeVisible();
    await expect(page.locator('#panel-clocks')).not.toBeVisible();
    await expect(page.locator('#tab-planner')).toHaveAttribute('aria-selected', 'true');
  });

  test('should switch back to Clocks tab after navigating away', async ({ page }) => {
    await page.locator('#tab-converter').click();
    await expect(page.locator('#panel-converter')).toBeVisible();

    await page.locator('#tab-clocks').click();
    await expect(page.locator('#panel-clocks')).toBeVisible();
    await expect(page.locator('#panel-converter')).not.toBeVisible();
  });

  test('should have proper ARIA roles on tabs', async ({ page }) => {
    const tablist = page.locator('nav.tabs');
    await expect(tablist).toHaveAttribute('role', 'tablist');

    const tabBtns = page.locator('.tab-btn');
    for (let i = 0; i < 3; i++) {
      await expect(tabBtns.nth(i)).toHaveAttribute('role', 'tab');
    }
  });

  test('should have proper ARIA roles on tab panels', async ({ page }) => {
    const panels = page.locator('.tab-panel');
    for (let i = 0; i < 3; i++) {
      await expect(panels.nth(i)).toHaveAttribute('role', 'tabpanel');
    }
  });
});
