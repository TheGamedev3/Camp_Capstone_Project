/*
✅ - make the signup page
✅ - learn tailwind and css better
✅ - image url edit display
✅ - "password" dot field thingy

- possibly edit profile logic
- forum client validator side for forum, and login & signup
- confirm password, and username logic

✅ - give cookie thingy
✅ - reroute logic
🚧 - middleware stuff
✅ - requester vrs forum
✅ - logout logic/route
✅ - logout button request sender
✅ - submit button disables on success by default

✅ - group common components together under a "Requests" Category

- better mongoose field error detection, maybe use error codes?
*/


/*

✅ Questions or weak points:
- in a server, how to get the current route
- upon getting the current route, how to see if a route matches a route string, like /user/1234 === /user, true? so i can know to redirect it or not

Answer:
- its impossible to dynamically protect routes on the server side
- rerouting is done in middleware
- when middleware can't fully verify things (because the middleware can't access the database),
- then check the data in the element, and manually redirect
*/


✅ - Forum Refactor into Request
✅ - RootType Components


