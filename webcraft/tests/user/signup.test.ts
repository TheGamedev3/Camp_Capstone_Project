// $env:TEST_PATH="tests/user/signup.test.ts"; npm run unitTests

import { expect, TEST } from '@SiteEnv';

TEST('📋 Signup Test', async({
  GoTo,
  FillForumWith,
  Account, Logout,
  ExpectUrl, ExpectHeader, ExpectElement
}) => {

    await GoTo('/signup');

    // test all of these cases one at a time
    await FillForumWith(
      
      // forumName
      "signup",

      // client errors
      {
        label: "Missing Attributes",
        params: {
          profile: '',
          username: '',
          email: "",
          password: ""
        },
        expectErrors: [
          "username can't be blank!",
          "profile can't be blank!",
          "email can't be blank!",
          "password can't be blank!"
        ]
      },
      {
        label: "Mismatching Password",
        params: {
          profile: 'A',
          username: 'A',
          email: "Aaron@gmai.com",
          password: "1234", retype_password: "12345"
        },
        expectErrors: [
          "password doesn't match!"
        ]
      },

      // server/mongoose errors
      {
        label: "Already Taken Email",
        params: {
          profile: 'A',
          username: 'A',
          email: "Aaron@gmail.com",
          password: "aaron1234", retype_password: "aaron1234"
        },
        expectErrors: [
          "Email already taken!"
        ]
      },
      {
        label: "Password Too Short",
        params: {
          profile: 'A',
          username: 'A',
          email: "Goofy@gmail.com",
          password: "1", retype_password: "1"
        },
        expectErrors: [
          "Minimum password length is 6 characters"
        ]
      },

      {
        label: "Valid Signup Credentials",
        params: {
          profile: 'https://tse2.mm.bing.net/th/id/OIP._FxktD4oZ3vqGSFVAgD6GwHaUP?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
          username: 'Goofy',
          email: "Goofy@gmail.com",
          password: "goofy1234", retype_password: "goofy1234"
        },
        expectErrors: []
      }

    );


    // Sample of Actual Client Side Forum Errors defined in webcraft/src/app/(user)/signup/page.tsx
    /*
      clientValidation={({username, profile, email, password, retype_password, err})=>{
        if(!username) err('username',"username can't be blank!");
        if(!profile) err('profile',"profile can't be blank!");
        if(!email) err('email',"email can't be blank!");
        if(!password) err('password',"password can't be blank!");
        if(password !== retype_password) err('retype_password', "password doesn't match!");
      }}
    */

    // now at Goofy's Profile
    await ExpectUrl(/\/myProfile$/);
    await ExpectHeader('Goofy');
    await ExpectElement("[src='https://tse2.mm.bing.net/th/id/OIP._FxktD4oZ3vqGSFVAgD6GwHaUP?r=0&rs=1&pid=ImgDetMain&o=7&rm=3']");
    await ExpectHeader('SIGNUP', false);

    // re-login to verify password and account is correctly set up
    await Logout();

    await Account('Goofy');
    await ExpectUrl(/\/myProfile$/);
    await ExpectHeader('Goofy');
  }
);
