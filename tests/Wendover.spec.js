import { test, expect } from '@playwright/test';

test('Wendover Art E2E', async ({ page }) => {
  await page.goto('https://www.wendoverart.com/');
  // Accept cookies if visible
  const acceptCookies = page.getByRole('button', { name: 'Accept Cookies' });
  if (await acceptCookies.isVisible({ timeout: 5000 })) {
    await acceptCookies.click();
  }

  // Wait for and click Sign In
  await page.getByRole('link', { name: 'Sign In' }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('link', { name: 'Sign In' }).click();

  // Fill login form
  await page.getByRole('textbox', { name: 'Email*' }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('textbox', { name: 'Email*' }).fill('satishkumar.balakrishnan@ziffity.com');
  await page.getByRole('textbox', { name: 'Password*' }).fill('Ziffity@123');
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait for navigation after login
  await page.waitForLoadState('networkidle');

  // Navigate through menu
  await page.getByRole('menuitem', { name: ' BROWSE' }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('menuitem', { name: ' BROWSE' }).click();
  await page.getByRole('link', { name: 'Releases' }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('link', { name: 'Releases' }).click();
  await page.getByRole('link', { name: 'New Releases' }).waitFor({ state: 'visible', timeout: 10000 });
  await page.getByRole('link', { name: 'New Releases' }).click();

  // Ensure navigation to new releases page
  await page.waitForURL('**/browse/releases/new-releases', { timeout: 10000 });

  // Click on specific product
  await page.getByText('WVT2184 / 46.88"w x 53.88"h').waitFor({ state: 'visible', timeout: 10000 });
  await page.getByText('WVT2184 / 46.88"w x 53.88"h').click();
  await page.getByText('Worn Routes').waitFor({ state: 'visible', timeout: 10000 });
  await page.getByText('Worn Routes').click();
});