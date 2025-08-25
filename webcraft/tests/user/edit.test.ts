// $env:TEST_PATH="tests/user/edit.test.ts"; npm run unitTests

import { TEST } from '@SiteEnv';

TEST('✏️ Edit Test', async({
  Account, Hover, Click, ClickNav,
  FillForumWith, Logout, 
  ExpectUrl, ExpectElement, ExpectText, ExpectHeader
}) => {

    // we'll edit Sarah's account
    await Account("Sarah");

    // go to the settings page
    await Hover('settings tab');
    await ClickNav('Edit Profile');
    await ExpectUrl(/\/mySettings$/);

    // all the forums are called "editProfile"
    // but only the current forum opened will be edited

    type FillIn = {
      label: string;
      params:{
        profile?: string;
        username?: string;
        email?: string;
        password?: string;
        oldPassword?: string;
      };
      expectErrors: string | string[];
    };

    type EditFieldParam = string | FillIn | (() => Promise<void>);

    // if its a string, then find the corresponding button name and click it
    // else, if its a fill-in field object, collect them into an array and fill them in the forum in order
    // else, if its a async function, like a test, run it
    async function EditField(...editParams: EditFieldParam[]) {
      let buffer: FillIn[] = [];

      for (const param of editParams) {
        if(typeof param === "object"){
          buffer.push(param);
        }else{
          // Flush previous buffer if exists
          if (buffer.length > 0) {
            await FillForumWith("editProfile", ...buffer);
            buffer = [];
          }

          if (typeof param === "string") {
            await Click(param);
          }else if (typeof param === "function") {
            await param();
          }
        }
      }

      // Flush final group
      if (buffer.length > 0) {
        await FillForumWith("editProfile", ...buffer);
      }
    }


    await EditField(
      // --------------------------------------------------------------

      "edit profile url",
      {
        label:"profile is original value",
        params:{},
        expectErrors:[
          "profile isn't changed!"
        ]
      },
      {
        label:"profile is blank",
        params:{profile:''},
        expectErrors:[
          "profile URL can't be blank!"
        ]
      },
      {
        label:"change profile",
        params:{profile:'https://tse2.mm.bing.net/th/id/OIP._FxktD4oZ3vqGSFVAgD6GwHaUP?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'},
        expectErrors:[]
      },
      "cancel editing profile url",
      async()=>{
        await ExpectElement("[src='https://tse2.mm.bing.net/th/id/OIP._FxktD4oZ3vqGSFVAgD6GwHaUP?r=0&rs=1&pid=ImgDetMain&o=7&rm=3']");
      },

      // --------------------------------------------------------------

      "edit username",
      {
        label:"username is original value",
        params:{},
        expectErrors:[
          "username isn't changed!"
        ]
      },
      {
        label:"username is blank",
        params:{username:''},
        expectErrors:[
          "username can't be blank!"
        ]
      },
      {
        label:"username change",
        params:{username:'Saren'},
        expectErrors:[]
      },
      "cancel editing username",
      async()=>{
        await ExpectText("Saren");
      },

      // --------------------------------------------------------------

      "edit email",
      {
        label:"email unchanged",
        params:{},
        expectErrors:[
          "email isn't changed!",
          "retype your password!"
        ]
      },
      {
        label:"email unchanged",
        params:{email:''},
        expectErrors:[
          "email can't be blank!",
          "retype your password!"
        ]
      },
      {
        label:"incorrect password",
        params:{
          email:'Saren@gmail.com',
          oldPassword:'sr12345'
        },
        expectErrors:[
          "Incorrect password!"
        ]
      },
      {
        label:"email change",
        params:{
          email:'Saren@gmail.com',
          oldPassword:'sarah1234'
        },
        expectErrors:[]
      },
      "cancel editing email",
      async()=>{
        await ExpectText(("Saren@gmail.com").toLowerCase());
      },

      // --------------------------------------------------------------

      "edit password",
      {
        label: "password unchanged",
        params: { password: 'sarah1234', oldPassword: 'sarah1234' },
        expectErrors: [
          "this matches your old password!"
        ]
      },
      {
        label: "missing passwords",
        params: { password: '', oldPassword: '' },
        expectErrors: [
          "retype your old password!",
          "new password can't be blank!"
        ]
      },
      {
        label: "password change",
        params: {
          password: 'saren1234',
          oldPassword: 'sarah1234'
        },
        expectErrors: []
      },
      "cancel editing password",
      async () => {
        // re-login
        await Logout();

        // (now saren1234 will automatically work)
        await Account("Saren");
        await ExpectUrl(/\/myProfile$/);

        // verify the new user profile changes have updated in
        await ExpectHeader("Saren");
        await ExpectElement("[src='https://tse2.mm.bing.net/th/id/OIP._FxktD4oZ3vqGSFVAgD6GwHaUP?r=0&rs=1&pid=ImgDetMain&o=7&rm=3']");
      
        await Logout();
      },

      // --------------------------------------------------------------
    );

});
