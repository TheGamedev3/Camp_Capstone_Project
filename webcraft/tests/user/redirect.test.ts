import { expect, TEST } from '@SiteEnv';

TEST('🛡️ Route Protection Test',
  async ({ GoTo, ExpectUrl, ExpectHeader, ClickNav }) => {

    // Go to a protected page
    await GoTo('/myProfile');

    // Assert URL was redirected to login
    await ExpectUrl(/\/login$/);
    await ExpectHeader('LOGIN');

    // go to signup instead
    await ClickNav('Signup');
    await ExpectUrl(/\/signup$/);

    // title says SIGNUP instead of LOGIN
    await ExpectHeader('SIGNUP');
    await ExpectHeader('LOGIN', false);
  }
);
