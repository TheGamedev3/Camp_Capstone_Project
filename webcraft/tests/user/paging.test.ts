// $env:TEST_PATH="tests/user/pagnationControls.test.ts"; npm run unitTests

import { expect, TEST } from '@SiteEnv';

// REMOVED briefPause, IsRoute, HasText

TEST('📄 Test Pagination', async ({
  Account,
  Click, ClickNav,
  Forum, Submit,
  SetOption, SetText, SetCheckbox,
  Back,
  ExpectElement, ExpectUrl, ExpectHeader, ExpectRouteToChange, ExpectTextIn, ExpectElementTo
}) => {

  // Login
  await Account('Aaron');
  await ExpectUrl(/\/myProfile$/);

  // Navigate to Players
  await ClickNav('Players');
  await ExpectUrl(/\/players$/);

  // Smarter page wait
  const onPage = async (x: string) => {
    const safe = x.trim().replace(/\s+/g, '\\s*');
    await ExpectTextIn('[name="pages"]', new RegExp(`Page\\s*${safe}`));
  };

  // Page nav tests
  await onPage("1 of 3");

  // back button should be disabled when its at page 1
  await ExpectElementTo<HTMLButtonElement>(
    'button[name="back a page"]',
    (el)=>(el).disabled
  );

  await Click('▶');
  await onPage("2 of 3");
  await Click('▶');
  await onPage("3 of 3");

  // forward button should be disabled when its at the last page
  await ExpectElementTo<HTMLButtonElement>(
    'button[name="forward a page"]',
    (el)=>(el).disabled
  );

  // Sort options reset to page 1
  await SetOption('sort style', 'oldest');
  await onPage("1 of 3");
  await SetOption('sort style', 'A-Z');
  await onPage("1 of 3");
  await SetOption('sort style', 'Z-A');
  await onPage("1 of 3");

  // Search for Ry (gary, ryan)
  await SetText({ 'player search': 'Ry' });
  await ExpectUrl(/\/players(\?.*)?$/,{search:'Ry'});

  await ExpectElement('text=Ryan');
  await ExpectElement('text=Gary');
  await onPage("1 of 1");

  // Search for Rya (only Ryan)
  await SetText({ 'player search': 'Rya' });
  await ExpectUrl(/\/players(\?.*)?$/,{search:'Rya'});

  await ExpectElement('text=Ryan');
  await ExpectElement('text=Gary', false);

  // Navigate to Ryan's profile
  await ClickNav('Ryan-icon');
  await ExpectUrl(/\/profile\/[^\/]+$/);
  await ExpectHeader('Ryan');

  // Back to pagination
  await Back();

  // Online only toggle + sort
  await SetText({ 'player search': '' });
  await SetCheckbox("online only", true);
  await SetOption('sort style', 'A-Z');

  await ExpectUrl(/\/players(\?.*)?$/,{search:'', onlineOnly:true, sortStyle:'A-Z'});
  await ExpectElement('text=Aaron');
});
