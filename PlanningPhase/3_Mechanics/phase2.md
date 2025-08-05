






/*



NEXT UP PHASE 2:
🔮 - trade db schema object & item logic eventually
 - in the other branch include:
    - preview screenshots of all the pages
    - list all the steps to set up env and the mongodb
    - remind README to npm install at first

✅  - find a nice JS framework to embed for all the trading stuff
    ✅ - no extra frameworks needed! its a simple web tile based game that can be created with NextJS easily
    ✅ - use Zustand for easy global hooks

PlayData Schema:

    UserId
    Inventory
    Total Storage Space
    Selected Tool
    World
        Selected Island
        Islands
            x-y Tiles
    Durabilities (only temporarily persist, until player leaves the game or mines something else, only applies to manually mined things)

    createSimulation() --> {runTick(), ping(session)}
    interact(action, tile[island, x, y])

Its cached on the server during the user's session
Auto saved every once in a while
The client occassionally pings the server keeping their session running server sided to prevent exploits

* Only the island you're at will be actively running


✅ Space bucket
    ✅ TileData
        ✅ Tile
            ✅ Layer
            ✅ Image/animation
            ✅ Coloring change
            ✅ If its floor layer then it changes the base of it
            ✅ else if its default, it takes whatever the grid default grounds are
            ✅ onTick event
            ✅ possibly a place (place _ at x y)
    
    Tile selecting/mouse hover enter exit
    Tile clicking
    Tile hook
        Tile Apperances, combining the full layers of the tile data string

Tile on hover at
Tile on click
Inventory, or build what
Build mode outline
hover onto
local verify place at
server verify place at
Inventory list?
Filter inventory by what can be placed down?
Quantities in the inventory?

Placing things down
Targeting things to place down
Inventory & Quantities


Plan: 
User starts with a starter inventory having 3 brick houses, and 30 bricks
the placeable inventory, and material inventory is different

the build ui will let you select something from placeables
itll outline the entire grid with a yellow dotted border
you can hover over and click on a tile, with it showing a preview and client verifying if its a valid move
(somehow itll dummy insert it into the tile data directly on the client???) and then the server will come to verify all the transactions and see if it was successful or not and update the inventory and stuff for real.... (tricky)

then you can easily click the build tool or build key, place down a house and done
if you want to make more houses, you could craft more with bricks in a separate crafting menu

to start with in programming, ill just have it be in build mode constantly set to place the house wherever tile is clicked, then ill move onto making the inventory

soon will come the break tool, which just sends a break tool request
you can also select what tool you'll use for breaking (automatically it will select the strongest tool for that case)


A tool class would probably be what to start with:
Tool
    keybind
    Icon
    onActionAt(x, y) --> place, interact, break (local changes, server updates with server changes)


Now that tools are a thing,
    on break tool action, send request to chip durability off
    on recieving the signal back that the durability is chipped, show the healthbar underneath
        this will require making for ui pop ups underneath each tile

    on build tool hover, put in a transparent overlay in the data showing where it can go if valid

    the onHover will actually return not just an on unhover unmounter, but also a corresponding highlighter function, (for the separate structures, floor tile, or all), and also a custom data insert thing to put in the hover tile thing
    
    the onAction will also have that, putting in a temporary client side build in, until recieving an update from the server (a "temporary-client-overridable-by-server-tile-datum")


*/






