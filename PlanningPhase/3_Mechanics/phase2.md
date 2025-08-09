






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

    structure tile layers are the ones that contain durability
        a server side cache will point to all the references of the durability going down, and durability wont be saved on different sessions



/*

Break Tool:
onHover(tileId:string){

    const tileId = session.tileBucket[tileId];
    const breakTarget = tileId.find(tileDatum=>tileDatum.layer === "structure");

    return{
        actionable: breakTarget,
        highlight: breakTarget ? "red" : null
    }
}

async onAction(tileId: string){
    const tileId = session.tileBucket[tileId];
    const breakTarget = tileId.find(tileDatum=>tileDatum.layer === "structure");
    if(!breakTarget){return}

    const {success, result: changedTile} = await getRoute({route: "/api/break", body: {target: breakTarget.Id, tool: "wooden_axe", tile: tileId}});
    // UPDATE MY TILE DATA WITH "changedTile"
}

CREATE THE ONHOVER RETURN THINGIES
CREATE THE API BREAK ROUTE
SOMEHOW DISPLAY A HEALTH BAR?
FIGURE OUT HOW TO LOCAL UPDATE CERTAIN TILES ON THE CLIENT SIDE DIRECTLY

Build Tool:
onHover(tileId:string){

    const tileId = session.tileBucket[tileId];
    const collision = tileId.find(tileDatum=>tileDatum.layer === "structure");

    return{
        actionable: !collision,
        highlight: !collision ? "green" : "red",
        hoverTile: {structure: "BrickHouse"} (w/ a default transparency of 40)
    }
}

async onAction(tileId: string){
    const tileId = session.tileBucket[tileId];
    const collision = tileId.find(tileDatum=>tileDatum.layer === "structure");
    if(!collision){return}

    const {success, result: changedTile} = await getRoute({route: "/api/build", body: {what: "BrickHouse", tile: tileId}});
    // UPDATE MY TILE DATA WITH "changedTile"
}

CREATE THE ONHOVER RETURN THINGIES
ADD HOVER TILES
CREATE THE API BUILD ROUTE
FIGURE OUT HOW TO LOCAL UPDATE CERTAIN TILES ON THE CLIENT SIDE DIRECTLY

*/
*/


    // drop command for structures, ex "x3 string" (make sure its invisible to clients)
    // gets corresponding item in the command, under an Items folder
    // under GameData, there'd be a .Inventory, and .Placeables

    ✅ // separate ToolBase, from Tools, and from ToolBar



Task list.......


🏠⬇️🌲 BUILD PLACE STRUCTURES
// %! BPS(189)

    IN INVENTORY ITEMLIST.TSX
⏩ (SKIP FOR NOW) - selecting an item from the inventory for tools to select (item slotId maybe?)
    ✅ - start off with just selecting the first structure item by default

    IN ITEMS.tsx' DATA
✅ - finding what structure that item places, and sending it over to the client

    IN THE ONHOVER OF THE BUILD TOOL IN TOOLS
✅ - ghost hover tile of that item being placed, TILE PREVIEWING
✅ - on Action, if valid, assume it will get placed

    ON THE BUILD ROUTE SERVER SIDE
    A BIT OF REORGANIZING ON THE BUILD ROUTE SERVER SIDE
✅ - (Place Item Vrs Spawn Structure) place structure, and place item, which uses place structure will then be different (distinguish the building on start, when generating structures, have it NOT subtract away things)
✅ - on the server place that item's structure down, and -1 of that item
✅ - only place item if you have one selected and more than 0


 ✅ - LABEL ALL SECTIONS



Next Possible Tasks?

➕🌃🏭 Industrial Revolution
 - selecting a placeable item from the inventory
 - mainly making new placeable items

    SPAWNERS (consider how tiles interact with their neighbors):
    - Mountain (spawns rocks cardinally to itself)
    - Mineshaft (has a higher chance of spawning ores cardinally to itself)
    - forest (spawns trees cardinally to itself over time)

    STRUCTURES (give them drops):
    - tree (drops wood)
    - Rock
    - Coal Ore
    - Metal Ore

    AUTOMATERS (consider how tiles interact with their neighbors):
    - saw (chops nearby rocks and ores if close to a power source)
    - lumbermill (chops nearby trees if close to a power source)
    - solar panel (provides steady power)

    ITEMS (drops):
    - coal
    - metal ore
    - stone
    - wood
    - pine cone

 - Initially start off with materials since there's no crafting
 - test the drops and everything working together!



🎒✨ Polished Improved Inventory
// %! PII(248)

✅ - deleting quantity 0 items from inventory
    ✅ - on server side
    ✅ - and on client side
    ✅ 🪳 - fix it so the number update immediately, as does the tiles do on placing in build-Action
✅ - filtering the inventory based on the tool to whats relevant, like a tool filter thing (is it a structure? or all? or a material? or a break tool?)
    ✅ - actual filters for each tool
    ✅ - whenever a new filter is set, select the first item that appears by default
    ✅ - relevant-inventory hook
✅ - item profile pictures and polished ui
    ✅ - a new item slot component
       ✅ - shrink item profile to a specific aspect
    ✅ - scrollbar and handle overflow
✅ - consider crafting in the future?
✅ 🪳 - items dont have be selected for certain tools!

✅ - scout out where each task is located in each file


🖥️ Interactable UI
 - click certain structures to pull up UI (add it in properties, and make custom ui for them, they'll mostly consist of +/- buttons of items, and an output you can click to claim)
 - coal generator (eats coal? dunno how.... we'll need a ui for it later)
 - furnace (also requires a ui)
 - IRON THIS OUT MORE!

new sections in the far future:
⛏️ Upgradable tools, durability, and structure health
🛠️ Crafting
💱 Trading with Players


