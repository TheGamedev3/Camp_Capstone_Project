// $env:TEST_PATH="tests/user/login.test.ts"; npm run unitTests

import { expect, TEST } from '@SiteEnv';

TEST('Login page reroute Test',
  async({ Account, ExpectUrl, ExpectHeader, Logout }) => {

    // use helper shorthand
    await Account('Ryan');

    // now at Ryan's profile
    await ExpectUrl(/\/myProfile$/);
    await ExpectHeader('Ryan');
    await ExpectHeader('LOGIN', false);

    await Logout();
    await ExpectUrl(/\/login$/);
    await ExpectHeader('LOGIN');
  }
);
