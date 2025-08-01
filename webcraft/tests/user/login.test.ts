import { expect, TEST } from '@SiteEnv';

TEST('Login page reroute Test',
  async({ GoTo, ExpectUrl, Forum, Submit, ExpectHeader }) => {

    // Go to /login
    await GoTo('/login');
    await ExpectUrl(/\/login$/);

    // login info
    await Forum('login',{
      email:"Ryan@gmail.com",
      password:"ryan1234"
    });

    // submit info
    await Submit('login');

    // now at Ryan's profile
    await ExpectUrl(/\/myProfile$/);
    await ExpectHeader('Ryan');
  }
);
