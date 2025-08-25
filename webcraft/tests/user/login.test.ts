// $env:TEST_PATH="tests/user/login.test.ts"; npm run unitTests

import { TEST } from '@SiteEnv';

TEST('🪵 Login Test', async({
  GoTo,
  FillForumWith, Logout, 
  ExpectUrl, ExpectHeader
}) => {

    await GoTo('/login');

    await FillForumWith(
      // forumName
      "login",

      // client error
      {
        label:"Empty",
        params:{
          email:"",
          password:""
        },
        expectErrors:[
          "email can't be blank!",
          "password can't be blank!"
        ]
      },

      // server errors
      {
        label:"Invalid Email",
        params:{
          email:"Ryen@gmail.com",
          password:"ryan1234"
        },
        expectErrors:["invalid email!"]
      },
      {
        label:"Incorrect Password",
        params:{
          email:"Ryan@gmail.com",
          password:"1234ryan"
        },
        expectErrors:["Incorrect password!"]
      },
      {
        label:"Valid Login",
        params:{
          email:"Ryan@gmail.com",
          password:"ryan1234"
        },
        expectErrors:[]
      },
    );

    // now at Ryan's profile
    await ExpectUrl(/\/myProfile$/);
    await ExpectHeader('Ryan');
    await ExpectHeader('LOGIN', false);

    await Logout();
    await ExpectUrl(/\/login$/);
    await ExpectHeader('LOGIN');
  }
);
