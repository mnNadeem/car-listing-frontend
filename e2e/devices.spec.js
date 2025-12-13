import { test, expect } from '@playwright/test';

test.describe('Devices Page', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and set up subscription as completed
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
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
  });

  test('should display devices page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Device management' })).toBeVisible();
  });

  test('should display all four devices', async ({ page }) => {
    await expect(page.getByText('Device 1')).toBeVisible();
    await expect(page.getByText('Device 2')).toBeVisible();
    await expect(page.getByText('Device 3')).toBeVisible();
    await expect(page.getByText('Device 4')).toBeVisible();
  });

  test('should display device types', async ({ page }) => {
    await expect(page.getByDisplayValue('Primary GPS')).toBeVisible();
    await expect(page.getByDisplayValue('Secondary GPS')).toBeVisible();
    await expect(page.getByDisplayValue('Drive mate Go')).toBeVisible();
    await expect(page.getByDisplayValue('Lockbox')).toBeVisible();
  });

  test('should have disabled Next button when no device is enabled', async ({ page }) => {
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeDisabled();
  });

  test('should show serial number and image upload when device toggle is enabled', async ({ page }) => {
    // Find first toggle and click it
    const toggles = page.locator('.toggle-switch input[type="checkbox"]');
    await toggles.first().click();

    // Wait for animation
    await page.waitForTimeout(500);

    // Check serial number field appears
    await expect(page.getByText('Serial number')).toBeVisible();
    await expect(page.getByPlaceholder('Enter the serial number of the device')).toBeVisible();

    // Check image upload field appears
    await expect(page.getByText('Upload an image of the device')).toBeVisible();
    await expect(page.getByText('Click to upload')).toBeVisible();
  });

  test('should hide serial number and image upload when device toggle is disabled', async ({ page }) => {
    // Enable first device
    const toggles = page.locator('.toggle-switch input[type="checkbox"]');
    await toggles.first().click();
    await page.waitForTimeout(500);

    // Verify fields are visible
    await expect(page.getByText('Serial number')).toBeVisible();

    // Disable device
    await toggles.first().click();
    await page.waitForTimeout(500);

    // Fields should be hidden
    await expect(page.getByText('Serial number')).not.toBeVisible();
  });

  test('should require serial number for enabled devices', async ({ page }) => {
    // Enable first device
    const toggles = page.locator('.toggle-switch input[type="checkbox"]');
    await toggles.first().click();
    await page.waitForTimeout(500);

    // Next should still be disabled (no serial number or image)
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeDisabled();
  });

  test('should allow entering serial number', async ({ page }) => {
    // Enable first device
    const toggles = page.locator('.toggle-switch input[type="checkbox"]');
    await toggles.first().click();
    await page.waitForTimeout(500);

    // Enter serial number
    const serialInput = page.getByPlaceholder('Enter the serial number of the device');
    await serialInput.fill('SN123456789');

    await expect(serialInput).toHaveValue('SN123456789');
  });

  test('should still require image after entering serial number', async ({ page }) => {
    // Enable first device
    const toggles = page.locator('.toggle-switch input[type="checkbox"]');
    await toggles.first().click();
    await page.waitForTimeout(500);

    // Enter serial number
    const serialInput = page.getByPlaceholder('Enter the serial number of the device');
    await serialInput.fill('SN123456789');

    // Next should still be disabled (no image)
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeDisabled();
  });

  test('should enable multiple devices independently', async ({ page }) => {
    // Enable first and third devices
    const toggles = page.locator('.toggle-switch input[type="checkbox"]');
    await toggles.nth(0).click();
    await toggles.nth(2).click();
    await page.waitForTimeout(500);

    // Both should show serial number fields
    const serialInputs = page.getByPlaceholder('Enter the serial number of the device');
    await expect(serialInputs).toHaveCount(2);
  });

  test('should clear data when device is toggled off', async ({ page }) => {
    // Enable first device
    const toggles = page.locator('.toggle-switch input[type="checkbox"]');
    await toggles.first().click();
    await page.waitForTimeout(500);

    // Enter serial number
    const serialInput = page.getByPlaceholder('Enter the serial number of the device');
    await serialInput.fill('SN123456789');

    // Toggle off
    await toggles.first().click();
    await page.waitForTimeout(500);

    // Toggle on again
    await toggles.first().click();
    await page.waitForTimeout(500);

    // Serial number should be cleared
    const newSerialInput = page.getByPlaceholder('Enter the serial number of the device');
    await expect(newSerialInput).toHaveValue('');
  });
});

test.describe('Devices Page - Complete Flow', () => {
  test('should navigate to Easy Access after completing device setup', async ({ page }) => {
    // Set up completed subscription
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
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

    // Enable first device
    const toggles = page.locator('.toggle-switch input[type="checkbox"]');
    await toggles.first().click();
    await page.waitForTimeout(500);

    // Fill serial number
    const serialInput = page.getByPlaceholder('Enter the serial number of the device');
    await serialInput.fill('SN123456789');

    // Upload image (mock via file input)
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-data'),
    });

    // Wait for image to process
    await page.waitForTimeout(500);

    // Next button should now be enabled
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeEnabled();

    // Click Next
    await nextButton.click();

    // Should navigate to Easy Access
    await expect(page).toHaveURL('/easy-access');
    await expect(page.getByRole('heading', { name: 'Easy Access' })).toBeVisible();
  });
});
