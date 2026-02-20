import { test, expect } from '@playwright/test';

test.describe('Clock display', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure default cities are loaded
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display the clock grid', async ({ page }) => {
    const grid = page.locator('#clock-grid');
    await expect(grid).toBeVisible();
    await expect(grid).toHaveAttribute('role', 'list');
  });

  test('should show default city clock cards', async ({ page }) => {
    const cards = page.locator('.clock-card');
    // Default cities: Local, New York, London, Tokyo, Sydney, Dubai
    await expect(cards).toHaveCount(6);
  });

  test('should display city names on clock cards', async ({ page }) => {
    const cityNames = page.locator('.city-name');
    await expect(cityNames).toHaveCount(6);

    // The first card is "Local (...)" with the local timezone
    await expect(cityNames.first()).toContainText('Local');

    // Check specific default city names
    await expect(page.locator('.city-name', { hasText: 'New York' })).toBeVisible();
    await expect(page.locator('.city-name', { hasText: 'London' })).toBeVisible();
    await expect(page.locator('.city-name', { hasText: 'Tokyo' })).toBeVisible();
    await expect(page.locator('.city-name', { hasText: 'Sydney' })).toBeVisible();
    await expect(page.locator('.city-name', { hasText: 'Dubai' })).toBeVisible();
  });

  test('should display digital time on each clock card', async ({ page }) => {
    const timeDisplays = page.locator('.time-display');
    await expect(timeDisplays).toHaveCount(6);

    // Time format should contain a colon (e.g., "3:45")
    const firstTimeText = await timeDisplays.first().textContent();
    expect(firstTimeText).toMatch(/\d{1,2}:\d{2}/);
  });

  test('should display AM/PM indicator', async ({ page }) => {
    const ampmElements = page.locator('.ampm');
    const count = await ampmElements.count();
    expect(count).toBeGreaterThan(0);

    const firstAmPm = await ampmElements.first().textContent();
    expect(firstAmPm?.trim()).toMatch(/^(AM|PM)$/);
  });

  test('should display date on each clock card', async ({ page }) => {
    const dateElements = page.locator('.card-date');
    await expect(dateElements).toHaveCount(6);

    // Date format: "Wed, Feb 20" (weekday, month day)
    const firstDate = await dateElements.first().textContent();
    expect(firstDate).toMatch(/\w{3}, \w{3} \d{1,2}/);
  });

  test('should display timezone info on each clock card', async ({ page }) => {
    const tzElements = page.locator('.card-tz');
    await expect(tzElements).toHaveCount(6);

    // Timezone info should contain UTC offset
    const firstTz = await tzElements.first().textContent();
    expect(firstTz).toMatch(/UTC/);
  });

  test('should display day/night icons on each card', async ({ page }) => {
    const icons = page.locator('.day-night-icon');
    await expect(icons).toHaveCount(6);

    // Each icon should be a sun or moon emoji
    for (let i = 0; i < 6; i++) {
      const text = await icons.nth(i).textContent();
      expect(text).toMatch(/[\u2600\u{1F319}]/u);
    }
  });

  test('each clock card should have an analog SVG clock', async ({ page }) => {
    const analogClocks = page.locator('.analog-clock svg');
    await expect(analogClocks).toHaveCount(6);
  });

  test('should apply is-day or is-night class to each card', async ({ page }) => {
    const cards = page.locator('.clock-card');
    for (let i = 0; i < 6; i++) {
      const card = cards.nth(i);
      const classList = await card.getAttribute('class');
      const hasDay = classList?.includes('is-day');
      const hasNight = classList?.includes('is-night');
      expect(hasDay || hasNight).toBeTruthy();
    }
  });

  test('should mark the local clock card with is-local class', async ({ page }) => {
    const localCard = page.locator('.clock-card.is-local');
    await expect(localCard).toHaveCount(1);
  });
});

test.describe('Add and remove clocks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should show the city select dropdown', async ({ page }) => {
    const select = page.locator('#city-select');
    await expect(select).toBeVisible();
    await expect(select).toHaveAttribute('aria-label', 'Select a city to add');
  });

  test('should show the Add button', async ({ page }) => {
    const addBtn = page.locator('#btn-add-city');
    await expect(addBtn).toBeVisible();
    await expect(addBtn).toHaveText('+ Add');
    await expect(addBtn).toHaveClass(/btn-add/);
  });

  test('should have available cities in dropdown (excluding already active ones)', async ({ page }) => {
    const options = page.locator('#city-select option');
    const count = await options.count();
    // First option is placeholder "-- Choose --", remaining are cities not yet active
    // Total CITIES = 20, default active (non-Local) = 5, so dropdown should have ~15 + placeholder
    expect(count).toBeGreaterThan(10);
  });

  test('should add a city when selecting from dropdown and clicking Add', async ({ page }) => {
    const initialCount = await page.locator('.clock-card').count();

    // Pick the first available city option (skip the placeholder)
    await page.locator('#city-select').selectOption({ index: 1 });
    await page.locator('#btn-add-city').click();

    const newCount = await page.locator('.clock-card').count();
    expect(newCount).toBe(initialCount + 1);
  });

  test('should not add a city if no option is selected', async ({ page }) => {
    const initialCount = await page.locator('.clock-card').count();

    // Click add without selecting
    await page.locator('#btn-add-city').click();

    const newCount = await page.locator('.clock-card').count();
    expect(newCount).toBe(initialCount);
  });

  test('should show remove button on non-local clock cards', async ({ page }) => {
    // Non-local cards should have a remove button
    const removeBtns = page.locator('.btn-remove');
    const count = await removeBtns.count();
    // 5 non-local default cities should each have a remove button
    expect(count).toBe(5);
  });

  test('should not show remove button on the local clock card', async ({ page }) => {
    const localCard = page.locator('.clock-card.is-local');
    await expect(localCard.locator('.btn-remove')).toHaveCount(0);
  });

  test('should remove a city when clicking the remove button', async ({ page }) => {
    const initialCount = await page.locator('.clock-card').count();

    // Click the first remove button (non-local card)
    await page.locator('.btn-remove').first().click();

    const newCount = await page.locator('.clock-card').count();
    expect(newCount).toBe(initialCount - 1);
  });

  test('removed city should appear back in the dropdown', async ({ page }) => {
    // Get the name of the city we're about to remove
    const secondCard = page.locator('.clock-card').nth(1);
    const cityName = await secondCard.locator('.city-name').textContent();

    // Remove it
    await secondCard.locator('.btn-remove').click();

    // Verify it appears in the dropdown
    const option = page.locator('#city-select option', { hasText: cityName! });
    await expect(option).toHaveCount(1);
  });

  test('added city should be removed from dropdown options', async ({ page }) => {
    // Get the first available option text
    const firstOption = page.locator('#city-select option').nth(1);
    const cityName = await firstOption.textContent();

    // Add it
    await page.locator('#city-select').selectOption({ index: 1 });
    await page.locator('#btn-add-city').click();

    // Verify it's no longer in the dropdown
    const options = page.locator('#city-select option', { hasText: cityName! });
    await expect(options).toHaveCount(0);
  });
});

test.describe('Converter panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.locator('#tab-converter').click();
  });

  test('should show converter input controls', async ({ page }) => {
    await expect(page.locator('#conv-source-tz')).toBeVisible();
    await expect(page.locator('#conv-time')).toBeVisible();
    await expect(page.locator('#conv-date')).toBeVisible();
  });

  test('should show converter results for active cities', async ({ page }) => {
    const results = page.locator('.converter-result-card');
    await expect(results).toHaveCount(6);
  });

  test('should display city name and time in each converter result', async ({ page }) => {
    const firstResult = page.locator('.converter-result-card').first();
    await expect(firstResult.locator('.cr-city')).toBeVisible();
    await expect(firstResult.locator('.cr-time')).toBeVisible();
    await expect(firstResult.locator('.cr-date')).toBeVisible();
  });
});

test.describe('Meeting Planner panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.locator('#tab-planner').click();
  });

  test('should show the planner description', async ({ page }) => {
    const desc = page.locator('.planner-desc');
    await expect(desc).toBeVisible();
    await expect(desc).toContainText('Working hours');
  });

  test('should show the timeline table', async ({ page }) => {
    await expect(page.locator('#timeline-table')).toBeVisible();
  });

  test('should show 24 hour columns in the timeline header', async ({ page }) => {
    // The header row has a "City" label + 24 hour columns
    const headerCells = page.locator('#timeline-head th');
    await expect(headerCells).toHaveCount(25); // 1 city label + 24 hours
  });

  test('should show rows for each active city', async ({ page }) => {
    const bodyRows = page.locator('#timeline-body tr');
    await expect(bodyRows).toHaveCount(6);
  });

  test('should show the overlap legend', async ({ page }) => {
    const legend = page.locator('.overlap-legend');
    await expect(legend).toBeVisible();

    const legendItems = page.locator('.legend-item');
    await expect(legendItems).toHaveCount(3);
  });
});
