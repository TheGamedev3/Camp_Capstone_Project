


export const Routes={
    // doesn't require a session to view
    public:[

    ],

    // requires there to be no session
    // if a session is found, it redirects to /myProfile
    entrance:[

    ],

    // by default, all other routes are protected and require a session
    // and if no session is found, it redirects to login

    // except 404 pages, which lead to nowhere instead of redirecting
};

/*

This is used in middleware, and in initially verifying if the user exists in app/layout.tsx

*/

