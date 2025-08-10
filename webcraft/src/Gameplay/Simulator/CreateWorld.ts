
import { PlaySession } from "./PlaySession";
import { giveCommand } from "../Items/ItemGive";
import { spawnStructure } from "../Routes/Build";
import { playSessionCache } from "./PlaySession";

export async function createWorld(userId: string){
    const islandPreset = { gridXSize: 6, gridYSize: 6, defaultTile: "Grass" };

    const newCache = new PlaySession({
        userId,
        gridXSize: islandPreset.gridXSize,
        gridYSize: islandPreset.gridYSize,
        tileBucket:{},
        inventory:[]
    });

    // place down spaces
    for (let y = 0; y < islandPreset.gridYSize; y++) {
        for (let x = 0; x < islandPreset.gridXSize; x++) {
            await spawnStructure(newCache, {what: islandPreset.defaultTile, x, y});
        }
    }
    // place down prebuilt structures

    // brick house (1), 
    await giveCommand(newCache, "mountain (1), forest (1), mineshaft (1), lumber mill (2), drill (3)");
    newCache.ejectChanges();

    playSessionCache[userId] = newCache;
    return newCache;
}