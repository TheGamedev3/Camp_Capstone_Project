






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

*/






