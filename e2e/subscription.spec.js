import { test, expect } from '@playwright/test';

test.describe('Subscription Page', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display subscription page title', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Subscription plan' })).toBeVisible();
  });

  test('should display all three plans', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Just mates')).toBeVisible();
    await expect(page.getByText('Good mates')).toBeVisible();
    await expect(page.getByText('Best mates')).toBeVisible();
  });

  test('should have disabled Next button when no plan selected', async ({ page }) => {
    await page.goto('/');
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeDisabled();
  });

  test('should enable Next button when free plan (Just mates) is selected', async ({ page }) => {
    await page.goto('/');
    
    // Click on Just mates plan
    await page.getByText('Just mates').click();
    
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeEnabled();
  });

  test('should show add-ons section when plan is selected', async ({ page }) => {
    await page.goto('/');
    
    // Select Just mates plan
    await page.getByText('Just mates').click();
    
    // Check that add-ons section appears
    await expect(page.getByText('Select add-ons')).toBeVisible();
  });

  test('should show card details for paid plans', async ({ page }) => {
    await page.goto('/');
    
    // Select Good mates plan (paid)
    await page.getByText('Good mates').click();
    
    // Check that card details section appears
    await expect(page.getByText('Add card details')).toBeVisible();
  });

  test('should require card details for paid plans', async ({ page }) => {
    await page.goto('/');
    
    // Select Good mates plan (paid)
    await page.getByText('Good mates').click();
    
    // Next button should be disabled without card details
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeDisabled();
  });

  test('should enable Next after filling card details for paid plan', async ({ page }) => {
    await page.goto('/');
    
    // Select Good mates plan
    await page.getByText('Good mates').click();
    
    // Fill card details
    await page.getByPlaceholder('1234 5678 1234 5678').fill('4242424242424242');
    await page.getByPlaceholder('MM/YY').fill('1225');
    await page.getByPlaceholder('CVC').fill('123');
    
    // Next button should be enabled
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeEnabled();
  });

  test('should format card number with spaces', async ({ page }) => {
    await page.goto('/');
    
    // Select Good mates plan
    await page.getByText('Good mates').click();
    
    // Type card number
    const cardInput = page.getByPlaceholder('1234 5678 1234 5678');
    await cardInput.fill('4242424242424242');
    
    // Check that spaces are added
    await expect(cardInput).toHaveValue('4242 4242 4242 4242');
  });

  test('should format expiry with slash', async ({ page }) => {
    await page.goto('/');
    
    // Select Good mates plan
    await page.getByText('Good mates').click();
    
    // Type expiry
    const expiryInput = page.getByPlaceholder('MM/YY');
    await expiryInput.fill('1225');
    
    // Check that slash is added
    await expect(expiryInput).toHaveValue('12/25');
  });

  test('should navigate to devices page after clicking Next', async ({ page }) => {
    await page.goto('/');
    
    // Select Just mates plan (free, no card needed)
    await page.getByText('Just mates').click();
    
    // Click Next
    await page.getByRole('button', { name: 'Next' }).click();
    
    // Should be on devices page
    await expect(page).toHaveURL('/devices');
    await expect(page.getByRole('heading', { name: 'Device management' })).toBeVisible();
  });

  test('should show subscription as completed in sidebar after navigation', async ({ page }) => {
    await page.goto('/');
    
    // Select Just mates plan
    await page.getByText('Just mates').click();
    
    // Click Next
    await page.getByRole('button', { name: 'Next' }).click();
    
    // Check sidebar shows subscription as completed (has check icon)
    // The subscription nav item should have a check icon visible
    await expect(page.locator('.sidebar-item').filter({ hasText: 'Subscription' }).locator('.check-icon')).toBeVisible();
  });
});
