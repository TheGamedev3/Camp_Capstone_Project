import { expect, TEST } from '@SiteEnv';

TEST('unauthenticated user gets redirected to login page',
  async ({ page, HasText, ClickNav }) => {

    // Go to a protected page
    await page.goto('/myProfile');

    // Wait for page to settle (optional safety net)
    await page.waitForLoadState('networkidle');

    // Assert URL redirected to login
    await expect(page).toHaveURL(/\/login$/);

    // Look for the word "LOGIN" (case-sensitive)
    console.log('login:', await HasText('LOGIN'));

    await ClickNav('Signup');

    console.log('signup page:', await HasText('SIGNUP'), await HasText('LOGIN', false))
  }
);
