// $env:TEST_PATH="tests/user/explorer.test.ts"; npm run unitTests

import { expect, TEST } from '@SiteEnv';

TEST('🌐 Visit Pages', async ({ 
    Account, Logout,
    AttemptGoTo, ClickNav,
    ExpectUrl, ExpectHeader
  }) => {

    // Go to a protected page
    await AttemptGoTo('/myProfile');

    // Assert URL was redirected
    await ExpectUrl(/\/login$/);
    await ExpectHeader('LOGIN');

    async function TestPages(...navLinks) {
      for(const{navBtn, header, url} of navLinks){
        await ClickNav(navBtn);
        if(url)await ExpectUrl(url);
        if(header)await ExpectHeader(header);
      }
    }

    await TestPages(
      {
        navBtn: 'How To',
        header: 'How 2 play:',
        url: /\/info$/
      },
      {
        navBtn: 'Login',
        header: 'LOGIN',
        url: /\/login$/
      },
      {
        navBtn: 'Signup',
        header: 'SIGNUP',
        url: /\/signup$/
      },
      {
        navBtn: 'Players',
        url: /\/players$/
      }
    );

    await Account('Maurice');

    // Go to a protected pages & assert URL was redirected
    await AttemptGoTo('/login');
    await ExpectUrl(/\/myProfile$/);
    await AttemptGoTo('/signup');
    await ExpectUrl(/\/myProfile$/);

    await TestPages(
      {
        navBtn: 'World',
        url: /\/forest$/
      },
      {
        navBtn: 'How To',
        header: 'How 2 play:',
        url: /\/info$/
      },
      {
        navBtn: 'Inventory',
        header: "Maurice",
        url: /\/myProfile$/
      },
      {
        navBtn: 'Post Trade',
        url: /\/makeTrades$/
      },
      {
        navBtn: 'Players',
        url: /\/players$/
      },
      {
        navBtn: 'All Trades',
        url: /\/trades$/
      },
    );

    await Logout();
  }
);
