


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

- the actual upgrading w/ cost and downgrading if it reaches 0

- tiles will require special effects and sounds on being mined
    - edit the tile thingy to add the corresponding sounds???

- inventory hook will now measure changes in item quantities
    - show the changes in the corner with a plus or minus thingy

- make the stats better
- give each structure proper break material health thingies



Next Up: Crafting And Interfaces




🖥️ Interactable UI
 - click certain structures to pull up UI (add it in properties, and make custom ui for them, they'll mostly consist of +/- buttons of items, and an output you can click to claim)
 - coal generator (eats coal? dunno how.... we'll need a ui for it later)
 - furnace (also requires a ui)
 - IRON THIS OUT MORE!

new sections in the far future:
⛏️ Upgradable tools, durability, and structure health
🛠️ Crafting
💱 Trading with Players
💾 Persisting Sessions

