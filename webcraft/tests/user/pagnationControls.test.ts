// $env:TEST_PATH="tests/user/pagnationControls.test.ts"; npm run unitTests

import { expect, TEST } from '@SiteEnv';

// REMOVE briefPause

TEST('Test pagination', async ({
  page, IsRoute, HasText, Click, ClickNav, Forum,
  Submit, SetOption, SetText, SetCheckbox,
  Batch,
  ExpectElement, ExpectUrl, ExpectHeader, ExpectRouteToChange
}) => {

  await page.goto('/myProfile');
  await page.waitForLoadState('networkidle');
  await ExpectUrl(/\/login$/);

  // Login
  await Forum('login', { email: "Aaron@gmail.com", password: "aaron1234" });
  await Submit('login');
  await ExpectUrl(/\/myProfile$/);

  // Navigate to Players
  await ClickNav('Players');
  await ExpectUrl(/\/players$/);

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
  await ExpectElement('text=Ryan');
  await ExpectElement('text=Gary');
  await onPage("1 of 1");

  // Search for Rya (only Ryan)
  await SetText({ 'player search': 'Rya' });
  await ExpectElement('text=Ryan');
  await ExpectElement('text=Gary', false);

  // Navigate to Ryan's profile
  await ClickNav('Ryan-icon');
  await ExpectUrl(/\/profile\/[^\/]+$/);
  await ExpectHeader('Ryan');

  // Back to pagination
  await Batch(
    ExpectRouteToChange(),
    page.goBack(),
  );

  // Online only toggle + sort
  await SetText({ 'player search': '' });
  await SetCheckbox("online only", true);
  await SetOption('sort style', 'A-Z');

  await ExpectUrl(/\/players(\?.*)?$/,{search:'', onlineOnly:true, sortStyle:'A-Z'});
  await ExpectElement('text=Aaron');

  // element is shown
  // has text
  // repeat check until timeout
  // batch & wait for url to change
  // url path contains...
  // expect to have params....

  // try catches and timeout fails
});
