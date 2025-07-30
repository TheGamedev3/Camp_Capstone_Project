/*
✅ - make the signup page
✅ - learn tailwind and css better
✅ - image url edit display
✅ - "password" dot field thingy

✅ - forum client validator side for forum, and login & signup
✅ - confirm password on signup
✅ - iron out client validators, and custom body constructors to handle things like 'passwords match'

✅ - give cookie thingy
✅ - reroute logic
✅ - middleware stuff
✅ - requester vrs forum
✅ - logout logic/route
✅ - logout button request sender
✅ - submit button disables on success by default

✅ - group common components together under a "Requests" Category

✅ - somehow give the mongoose db an actual initial name that isn't "Test" (I have to edit the mongodb_URI)
✅ - better mongoose field error detection, maybe use error codes?
✅ - group the api routes

✅ - possibly edit profile logic
    ✅ - edit email or password w/ oldpassword
✅ - edit profile page
    ✅ - edit username
    ✅ - edit profile
    ✅ - edit email
    ✅ - edit password
✅ - custom styling for the edit button

✅ - handling going back to view mode on success (use the edit hooks)

✅ - style the edit buttons
✅ - separate user profile page

✅ - add a header to the text and image fields
✅ - handle going to the next field on submit/enter
✅ - handle sending the request when on the last field
✅ - handle reselecting the earliest field that errored

/*
✅ - how to add a mini header over the textfield
✅ - how to detect when a textfield is "entered"/"submitted" but not simply unfocused like clicking elsewhere
✅ - how to reselect the next text field
*/

✅ - fully style the settings

✅ - shared navigation headers
✅ - distinct entry headers (signup, login, players, how to)

✅ - center site content more in the middle, looks ugly stretching across the whole screen
✅ - optional adjust screen stretch hook
✅ - dummy info, world, & users pagnation page

✅ - possibly create dummy player data on database initialization?

✅ - logic pagnate all the players (possibly a logged in session thing for 'online' players?)
✅ - sorting logic (alphabetical, accountAge, acsending decsending, online/offline/all)

✅ - render the player profile icon stuff
✅ - finally render the result of the pagnation
✅ - search bar
✅ - add debounce to searching so it doesnt get halted while typing
✅ - sort controls/drop downs
✅ - user icons
✅ - user grid

✅ - ironed out player profiles/:id
✅ - route user icons to player profiles/:id
✅ - make a fetch profile api route

- remember to hash the passwords on signup/creation!

- refine the typescript of everything
- get a testing package

- trade db schema object & item logic eventually

*/











/*

✅ Questions or weak points:
- in a server, how to get the current route
- upon getting the current route, how to see if a route matches a route string, like /user/1234 === /user, true? so i can know to redirect it or not

Answer:
- its impossible to dynamically protect routes on the server side
- even manually listing all the routes, because the top server components like layout, have no access to what the current route is
- rerouting is done in middleware
- when middleware can't fully verify things (because the middleware can't access the database),
- then check the data in the route element, and manually redirect
*/


✅ - Forum Refactor into Request
✅ - RootType Components

// leetcode easy problems, exercism.io, or codewars
// codewars is my mentor's personal pick
// whiteboard solving
// interviewers provide their own interviews
