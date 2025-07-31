import { expect, TEST } from '@SiteEnv';

TEST('Login page reroute Test',
  async({ page, HasText, ClickNav, Forum, Submit }) => {

    // Go to a protected page
    await page.goto('/myProfile');

    // Wait for page to settle (optional safety net)
    await page.waitForLoadState('networkidle');

    // Assert URL redirected to login
    await expect(page).toHaveURL(/\/login$/);

    await Forum('login',{
      email:"Ryan@gmail.com",
      password:"ryan1234"
    });

    await Submit('login');

    await expect(page).toHaveURL(/\/myProfile$/);
  }
);
