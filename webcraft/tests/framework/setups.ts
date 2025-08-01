
export async function Account(username: string){
    username = username[0].toUpperCase() + username.slice(1).toLowerCase();

    // Go to /login
    await this.GoTo('/login');
    await this.ExpectUrl(/\/login$/);

    // login info
    await this.Forum('login',{
      email:`${username}@gmail.com`,
      password:`${username.toLowerCase()}1234`
    });

    // submit info
    await this.Submit('login');

    // now at Username's profile
    await this.ExpectUrl(/\/myProfile$/);
    await this.ExpectHeader(username);
}

export async function Logout(){
    // hover over settings tab
    await this.Hover('settings tab');

    // click the logout link once it has appeared
    await this.ClickNav('Logout');

    // verify we're now in the login page
    await this.ExpectUrl(/\/login$/);
}

