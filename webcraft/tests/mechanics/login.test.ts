// $env:TEST_PATH="tests/mechanics/login.test.ts"; npm run unitTests

import { TEST } from '@SiteEnv';

TEST('🪧🪵 Login Test ROUTE',
  async ({ getRoute }) => {

    const{success, result}= await getRoute(
      "POST /api/login",
      {
        email:'ryan@gmail.com',
        password:'ryan1234'
      }
    );
    console.log(success, result);

  }
);
