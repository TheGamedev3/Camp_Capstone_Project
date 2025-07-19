
# API Route Planning

(these routes will also have an item/recipe ID to be paired with, that help the server process the logic, for example, was this wood obtained from a tree? does this user have the materials to craft this other item?)


## DSL

PAGE, CREATE, DELETE, RESPOND, FETCH, EDIT
(GET, POST, DELETE, GET, GET, PATCH)


CREATE /signup
body: {username, email, password, profilePicture}
*(server verifies...)*
response: `hello ${username!}!` + Inventory Data

RESPOND /login
body: {email, password}
*(server verifies...)*
response: `welcome back ${username!}` + Inventory Data

EDIT /profileChange
body: {username, email, password, profilePicture, oldPassword}
*(server verifies...)*
response: updated info (page refreshes with updated info)

## MECHANICS

CREATE /obtain
body: {obtain method...}
*(server verifies...)*
response: "+5 materials"

CREATE /craft
body: {recipeId}
*(server verifies and withdraws materials...)*
response: "-5 materials +1 crafted"

CREATE /trade
body: {(user session), materials}
*(server verifies and withdraws materials...)*
response: "5 stone put up for trading"

RESPOND /acceptTrade
body: {(user session)}
*(server verifies and withdraws materials and notifies the seller...)*
response: "-5 materials +1 traded for!"

DELETE /removeTrade
body: {tradeId}
*(server removes the trade)*
response: "here's your 5 stone back!"

RESPOND /claimTrade
body: {tradeId}
*(server gives traded for rewards...)*
response: "trade successful! +5 materials"

FETCH /refreshInventory
body: {(user session)}
*(server fetches inventory again)*
response: (updated inventory)


There's mainly a few commonly used checks/methods used by the server when circulating around items:
- validate the item was obtained legitamtely (like timestamps, and is area unlocked yet)
- withdraw items
- give items
- exchange items (is withdraw, then give)


## React TSX Pages

PAGE /signup
*requires not signed in yet!
PAGE /login
*requires not signed in yet!

PAGE /myProfile (you can edit your own profile)
*requires sign in!

PAGE /profile/:id

PAGE /makeTrade
PAGE /trades

PAGE /forest (or some sort of location where you gather items)
*requires sign in!

PAGE /info/:section/:item
(has fun info about how to play the game!)