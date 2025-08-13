


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

Next Possible Tasks?


➕🌃🏭 Industrial-Revolution & Resources
// %! IRR(236)

✅ - selecting a placeable item from the inventory
✅ - mainly making new placeable items

    Dropping:
    ✅ - tile.drop() on server side

    STRUCTURES (give them drops):
    ✅ - tree (drops wood and a pine cone)
    ✅ - Rock (drops stone)
    ✅ - Coal Ore (drops coal)
    ✅ - Metal Ore (drops metal ore)

    Neighbors:
    ✅ - get cardinal neighbors and tile info
    ✅ - is valid space?
    ✅ - pick random space every tick to generate new

    SPAWNERS (consider how tiles interact with their neighbors):
    ✅ - forest (spawns trees cardinally to itself over time)
    ✅ - Mountain (spawns rocks cardinally to itself)
    ✅ - Mineshaft (has a higher chance of spawning ores cardinally to itself)

    Gather:
    ✅ - get all cardinal neighbors
    ✅ - every tick send a break command to them (tool: drill or lumbermill)
    ✅ - auto collects upon breaking nearby structures

    AUTOMATERS (consider how tiles interact with their neighbors):
    ✅ - drill (chops nearby rocks and ores if close to a power source)
    ✅ - lumbermill (chops nearby trees if close to a power source)
    ✅ - solar panel (provides steady power)

    ITEMS (drops):
    ✅ - coal
    ✅ - metal ore
    ✅ - stone
    ✅ - wood
    ✅ - pine cone

✅ - Initially start off with materials since there's no crafting
✅ - test the drops and everything working together!



🛠️🧰 Super Terrific Tools
// %! STT(99)

✅ - finally add slot selecting by clicking
    ✅ - if its a structure go into build mode
    ✅ - if its a tool go into break mode
    ✅ - if its reselected again go back to interact mode

✅ - break will now do durability instead of instant breaking
    ✅ - maybe a structure class instead of a tile class?
    - assign all healths and materials
    ✅ - structures have health
    ✅ - break will now deal damage to structures
    ✅ - structures will drop themself once their health is at or less than 0
    ✅ - tiles show structure health

✅ - tools will be added
    ✅ - scout out files
    ✅ - create tools
        ✅ - wrench
        ✅ - wood variant
        ✅ - stone variant
        ✅ - metal variant
        ✅ - (no diamond variant)
    ✅ - tool attributes
        ✅ - damage table specifics
        ✅ - durability & current durability
        ✅ - upgrade to, at cost x
    ✅ - tools have their own durability and arent stackable (fix the suppose item function)
    ✅ - the equipped tool in question will affect the break speed
    ✅ - test the differing break speed
    ✅ - subtract away durability
    ✅ - remove durability 0 items
    ✅ - show durability health bar on tile if its a tool type
    ✅ - remove the old outdated itemChange(item, +quantity) thing since its not being manually tracked anymore


⏭️ SKIPPED


- tiles will require special effects and sounds on being mined
    - edit the tile thingy to add the corresponding sounds???

- inventory hook will now measure changes in item quantities
    - show the changes in the corner with a plus or minus thingy

- make the stats better
- give each structure proper break material health thingies



Next Up: Crafting And Interfaces

🖱️🛠️🪟 Click & Craft!
// %! C&C(153)

- Clicking buttons or certain tiles, can pull up different crafting menus
- a menu component, clicking off it will put it away
- it could have a scrollbar listing recipies
- it lists recipies, which take in/list materials, and do a function
    - these functions include healing durability
    - or crafting new items
    - make sure to make a list of some recipies!
- *for certain recipies, they'll need to meet verification, like "used crafting table at xy 2-5 to create pickaxe"
- the actual upgrading of tools w/ cost and downgrading if it reaches 0
- all listed items needed for the crafting recipie are listed
    - evaluated in a canAfford? function (ex: 3 stone, 5 wood, 4 metal = true, false, true)
    - and then displayed as red or green if there's enough ingredients
    - this will also require fetching the profile pictures of the items
- create a temporary "3 metal ore + 1 coal -> 3 metal" recipie

🖱️🛠️🪟 Click & Craft! simplified
✅ - list the recipies

✅ - make a menu component
✅ - summon the menu component

✅ - have a button on the side to bring up a recipie list using the menu component
✅ - render the recipies

✅ - recipie shows:
    ✅ - the material cost
    - evaluate if you can afford each item cost
    ✅ - the output

⏭️ - possibly, sort recipies by can afford or not?
⏭️ - and maybe a case insensitve search bar?

✅ - on recipieBtn clicked & can afford, send request to server, to do assosiated action
✅ - see if they have the cost, subtract it, and then do the action on success

✅ - (input, cost, output) FORMAT
✅ - this could be, healing a target tool, or giving a new item
✅ - healing a target tool... that would imply the request cost thing would have to input the target tool, and NOT withdraw it... (target and cost will have to be separate then.... but visually similar)
✅ - tree growth

✅ - summon the menu upon clicking a structure, using the interact tool.....


✅ - we still need downgrading of tools on breaking!
✅ - remember to display the full inventory on the left!
✅ - make sure to check the tile coordinates!
✅ - construction site, electronic store
✅ - correct hardness and durability values for all structures and break tools
✅ - 🪳 tile layers are taking the mouse events away from the toolbar if they overlap!
✅ - item measurement change thingy!!!!
    ✅ - inventory hook use effect on change
    ✅ - tracking the quantities of each, even non stackables
    ✅ - whenever something changes, alert some notification hook
        ✅ - maybe just have it be part of the inventory hook directly every time it changes
            ✅ - the changes bundle together
    ✅ - notification element at the bottom right
✅ 🪳 - massive refactor required where client changes are stacked ontop!
    ✅ 🪳 - this is to fix outdated game data
    ✅ - make a new client data layer
    ✅ - give it updates
    ✅ - client data merges tile & item deltas with the game data to make client data
    ✅ - have all elements using the useGameDataHook finally transfer over to using ClientData
    ✅ - nobody can update game data directly on the client but the ping fetcher! thats a rule! they must use changeTileId, and changeItemSlotId
    ✅ - of course, consider timestamps!
⏭️ - it may be soon possible to create a trading table once persisting data is a thing....


✅ - terraform the land // %! TTL(221)
    ✅ - have the recipe thing for "land" have an output thingy instead of giving an item
    ✅ - pass in the actual tiledata, tileid, and session thing
    ✅ - refactor it to take in more args
    ✅ - also allow for mountain to transform into mineshaft


- break hold down
    - track when mouse is down, send a request
    - track when mouse is lifted, stop interval on the server side
    - or alternatively, on hold down on client, send break request at an interval
        - and then on the server side timestamp verify it

- consider trade requests
    - mongoose schema for the offer object
    - offers pagnator
    - minimal version?
        - item selector
        - set valid cost string
        - take items & nonstackables data and post trade as a mongoose object
        - give back on creator canceling
        - take cost and give items on buy
        - creator claiming reward on purchased (and possibly notify by lighting it up in myOffers?)
    - polished version
        - requires a new create trade input
            - possibly clicking an item will post it in x1 once
            - a +/- button for each qt
            - a cost drop down thingy where u can set the item and the quantity, and add in more items
                - ingredients list rendered
                - ingredient selector and quantity adjuster
                - add ingredient
                - take the selected info out
            - remember, durability/nonstackables need to transfer their durability somehow!
                - because you can only have 1 axe and pickaxe ever, they're non tradable and will be filtered out
            - a post button to post the trade


🔥 Forage & Furance
- the furance menu will be more complicated
    - furnace structure with a coal count and metal ore count and an output count
    - it evaluates smelting times and stuff on its own separate time server sided
    - itll have slots taking in amounts of metal ore and coal at certain values at the top
    - you can withdraw or add or put in the max amount all in
    - there's also a collect button to collect all the metal
    - 1 coal will add in 3 smelt bars if there's any smeltable material
    - if the material is all smelted, the smelt bars disappear
    - timestamp logic will need to smoothen this out
    - maybe take x amounts of ticks?
    - and then need for a tick length?



new sections in the far future:
✅ ⛏️ Upgradable tools, durability, and structure health
✅ 🛠️ Crafting
💱 Trading with Players
💾 Persisting Sessions
🔉 Sound Effects
