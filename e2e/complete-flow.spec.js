import { test, expect } from '@playwright/test';

test.describe('Complete User Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should complete entire flow: Subscription → Devices → Easy Access', async ({ page }) => {
    // STEP 1: Subscription Page
    await page.goto('/');
    
    // Verify we're on subscription page
    await expect(page.getByRole('heading', { name: 'Subscription plan' })).toBeVisible();
    
    // Select Just mates plan (free)
    await page.getByText('Just mates').click();
    
    // Verify Next is enabled
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeEnabled();
    
    // Click Next
    await nextButton.click();
    
    // STEP 2: Devices Page
    await expect(page).toHaveURL('/devices');
    await expect(page.getByRole('heading', { name: 'Device management' })).toBeVisible();
    
    // Verify subscription is marked complete in sidebar
    await expect(
      page.locator('.sidebar-item').filter({ hasText: 'Subscription' }).locator('.check-icon')
    ).toBeVisible();
    
    // Enable first device
    const toggles = page.locator('.toggle-switch input[type="checkbox"]');
    await toggles.first().click();
    await page.waitForTimeout(500);
    
    // Fill serial number
    const serialInput = page.getByPlaceholder('Enter the serial number of the device');
    await serialInput.fill('GPS-001-2024');
    
    // Upload device image
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'device.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-content'),
    });
    await page.waitForTimeout(500);
    
    // Verify Next is enabled
    await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
    
    // Click Next
    await page.getByRole('button', { name: 'Next' }).click();
    
    // STEP 3: Easy Access Page
    await expect(page).toHaveURL('/easy-access');
    await expect(page.getByRole('heading', { name: 'Easy Access' })).toBeVisible();
    
    // Verify devices is marked complete in sidebar
    await expect(
      page.locator('.sidebar-item').filter({ hasText: 'Device' }).locator('.check-icon')
    ).toBeVisible();
    
    // Footer should be hidden on Easy Access page
    await expect(page.locator('footer.footer')).not.toBeVisible();
  });

  test('should complete flow with paid plan and card details', async ({ page }) => {
    await page.goto('/');
    
    // Select Good mates plan (paid)
    await page.getByText('Good mates').click();
    
    // Fill card details
    await page.getByPlaceholder('1234 5678 1234 5678').fill('4242424242424242');
    await page.getByPlaceholder('MM/YY').fill('1225');
    await page.getByPlaceholder('CVC').fill('123');
    
    // Click Next
    await page.getByRole('button', { name: 'Next' }).click();
    
    // Should be on devices page
    await expect(page).toHaveURL('/devices');
    
    // Complete device setup
    const toggles = page.locator('.toggle-switch input[type="checkbox"]');
    await toggles.first().click();
    await page.waitForTimeout(500);
    
    await page.getByPlaceholder('Enter the serial number of the device').fill('GPS-002');
    
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'device.png',
      mimeType: 'image/png',
      buffer: Buffer.from('image'),
    });
    await page.waitForTimeout(500);
    
    await page.getByRole('button', { name: 'Next' }).click();
    
    // Should be on Easy Access page
    await expect(page).toHaveURL('/easy-access');
  });

  test('should persist state across page refreshes', async ({ page }) => {
    await page.goto('/');
    
    // Select plan
    await page.getByText('Good mates').click();
    
    // Refresh page
    await page.reload();
    
    // Plan should still be selected (card details section visible)
    await expect(page.getByText('Add card details')).toBeVisible();
  });

  test('should not allow accessing devices page without completing subscription', async ({ page }) => {
    // Try to navigate directly to devices
    await page.goto('/devices');
    
    // Devices link should be disabled in sidebar
    const deviceLink = page.locator('.sidebar-item').filter({ hasText: 'Device' });
    await expect(deviceLink).toHaveClass(/disabled/);
  });

  test('should not allow accessing Easy Access without completing devices', async ({ page }) => {
    // Set up completed subscription
    await page.evaluate(() => {
      localStorage.setItem(
        'subscription',
        JSON.stringify({
          selectedPlan: 'just-mates',
          selectedAddons: [],
          cardDetails: { number: '', expiry: '', cvc: '' },
          isCompleted: true,
        })
      );
    });
    await page.goto('/easy-access');
    
    // Easy Access link should be disabled
    const easyAccessLink = page.locator('.sidebar-item').filter({ hasText: 'Easy Access' });
    await expect(easyAccessLink).toHaveClass(/disabled/);
  });

  test('should allow navigating back to completed steps', async ({ page }) => {
    // Set up completed subscription
    await page.evaluate(() => {
      localStorage.setItem(
        'subscription',
        JSON.stringify({
          selectedPlan: 'just-mates',
          selectedAddons: [],
          cardDetails: { number: '', expiry: '', cvc: '' },
          isCompleted: true,
        })
      );
    });
    await page.goto('/devices');
    
    // Click Subscription in sidebar
    await page.locator('.sidebar-item').filter({ hasText: 'Subscription' }).click();
    
    // Should navigate back to subscription
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Subscription plan' })).toBeVisible();
  });
});

test.describe('Sidebar Navigation', () => {
  test('should show completed steps with checkmarks', async ({ page }) => {
    await page.goto('/');
    
    // Pre-subscription steps should have checkmarks
    const locationItem = page.locator('.sidebar-item').filter({ hasText: 'Location' });
    await expect(locationItem.locator('.check-icon')).toBeVisible();
    
    const aboutItem = page.locator('.sidebar-item').filter({ hasText: 'About' });
    await expect(aboutItem.locator('.check-icon')).toBeVisible();
  });

  test('should show subscription step as active on initial load', async ({ page }) => {
    await page.goto('/');
    
    const subscriptionItem = page.locator('.sidebar-item').filter({ hasText: 'Subscription' });
    await expect(subscriptionItem).toHaveClass(/active/);
  });

  test('should show device step as active when on devices page', async ({ page }) => {
    // Set up completed subscription
    await page.evaluate(() => {
      localStorage.setItem(
        'subscription',
        JSON.stringify({
          selectedPlan: 'just-mates',
          selectedAddons: [],
          cardDetails: { number: '', expiry: '', cvc: '' },
          isCompleted: true,
        })
      );
    });
    await page.goto('/devices');
    
    const deviceItem = page.locator('.sidebar-item').filter({ hasText: 'Device' });
    await expect(deviceItem).toHaveClass(/active/);
  });
});

test.describe('Error Handling', () => {
  test('should show error toast for incomplete subscription', async ({ page }) => {
    await page.goto('/');
    
    // Select paid plan without card details - button should be disabled
    await page.getByText('Good mates').click();
    
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeDisabled();
  });

  test('should show error toast for incomplete device setup', async ({ page }) => {
    // Set up completed subscription
    await page.evaluate(() => {
      localStorage.setItem(
        'subscription',
        JSON.stringify({
          selectedPlan: 'just-mates',
          selectedAddons: [],
          cardDetails: { number: '', expiry: '', cvc: '' },
          isCompleted: true,
        })
      );
    });
    await page.goto('/devices');
    
    // Enable device without filling details
    const toggles = page.locator('.toggle-switch input[type="checkbox"]');
    await toggles.first().click();
    await page.waitForTimeout(500);
    
    // Button should be disabled
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeDisabled();
  });
});
