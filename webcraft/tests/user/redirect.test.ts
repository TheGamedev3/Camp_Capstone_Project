import { test, expect } from '@playwright/test';

test('unauthenticated user gets redirected to login page', async ({ page }) => {
  // Go to a protected page
  await page.goto('/myProfile');

  // Wait for page to settle (optional safety net)
  await page.waitForLoadState('networkidle');

  // Assert URL redirected to login
  await expect(page).toHaveURL(/\/login$/);

  // Look for the word "LOGIN" (case-insensitive)
  const loginText = await page.locator('body').innerText();
  expect(loginText.toLowerCase()).toContain('login');
});
