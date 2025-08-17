
import { PlaySession } from "./PlaySession";
import { giveCommand } from "../Items/ItemGive";
import { spawnStructure } from "../Routes/Build";
import { playSessionCache } from "./PlaySession";

export function createWorld(userId: string){
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
            spawnStructure({session:newCache, what: islandPreset.defaultTile, x, y});
        }
    }
    // place down prebuilt structures

    giveCommand({session:newCache, itemCmd:"wood axe, wood pickaxe, wood (50), stone (50), coal (50), metal ore (50), pine cone (50)"});
    newCache.ejectChanges();

    playSessionCache[userId] = newCache;
    return newCache;
}