// $env:TEST_PATH="tests/user/pagnationControls.test.ts"; npm run unitTests

import { expect, TEST } from '@SiteEnv';

TEST('Test pagination', async ({
  page, IsRoute, HasText, Click, ClickNav, Forum,
  briefPause,
  Submit, SetOption, SetText, SetCheckbox
}) => {

  await page.goto('/myProfile');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/\/login$/);

  // Login
  await Forum('login', { email: "Aaron@gmail.com", password: "aaron1234" });
  await Submit('login');
  await expect(page).toHaveURL(/\/myProfile$/); // optional guard

  // Navigate to Players
  await ClickNav('Players');
  await expect(page).toHaveURL(/\/players$/);

  // Smarter page wait
  const onPage = async (x: string) => {
    const safe = x.trim().replace(/\s+/g, '\\s*');
    await expect(page.locator('[name="pages"]')).toHaveText(
      new RegExp(`Page\\s*${safe}`),
      { timeout: 5000 }
    );
  };

  // Page nav tests
  await onPage("1 of 3");
  await expect(page.locator('button[name="back a page"]')).toBeDisabled();
  await Click('▶');
  await onPage("2 of 3");
  await Click('▶');
  await onPage("3 of 3");
  await expect(page.locator('button[name="forward a page"]')).toBeDisabled();

  // Sort options reset to page 1
  await SetOption('sort style', 'oldest');
  await onPage("1 of 3");
  await SetOption('sort style', 'A-Z');
  await onPage("1 of 3");
  await SetOption('sort style', 'Z-A');
  await onPage("1 of 3");

  // Search for Ry (gary, ryan)
  await SetText({ 'player search': 'Ry' });
  await expect(page.locator('text=Gary')).toBeVisible();
  await expect(page.locator('text=Ryan')).toBeVisible();
  await onPage("1 of 1");

  // Search for Rya (only Ryan)
  await SetText({ 'player search': 'Rya' });
  await expect(page.locator('text=Ryan')).toBeVisible();
  await expect(page.locator('text=Gary')).toHaveCount(0);

  // Navigate to Ryan's profile
  await briefPause();
  await ClickNav('Ryan-icon');
  await page.waitForURL(/\/profile\/[^\/]+$/);
  await expect(page.getByRole('heading', { name: 'Ryan' })).toBeVisible();

  // Back to pagination
  await page.goBack();
  await page.waitForURL(/\/players(\?.*)?$/);

  // Online only toggle + sort
  await SetText({ 'player search': '' });
  await SetCheckbox("online only", true);
  await SetOption('sort style', 'A-Z');
  await expect(page.locator('text=Aaron')).toBeVisible();
});
