
# API Route Planning (unfinished)


GET sign up
GET login
GET logout

GET obtain from
GET craft from
POST post trade
DELETE my trade
GET accept trade

(these routes will also have an item/recipe ID to be paired with, that help the server process the logic, for example, was this wood obtained from a tree? does this user have the materials to craft this other item?)

There's mainly a few commonly used checks/methods used by the server when circulating around items:
- validate the item was obtained legitamtely (like timestamps, and is area unlocked yet)
- withdraw items
- give items
- exchange items (is withdraw, then give)

Pages in React:

The obtain items place
The trade place
The create trade place
The user's inventory
Signup/Login page
Info/How to/Recipies page


