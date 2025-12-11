import { test, expect } from '@playwright/test';

test.describe('Car Listing App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Car Listing|Vite/);
  });

  test('should display main content', async ({ page }) => {
    await page.goto('/');
    // Add more specific tests based on your app content
    await expect(page.locator('body')).toBeVisible();
  });
});

