

const playSessionCache: Record<string, PlaySession> = {};

const exposedProperties = [
    'userId',
    'gridXSize', 'gridYSize',
    'tileBucket', 'inventory'
] as const;

import { Item } from "../Items/Items";
import { build } from "../Routes/Build";

// inferred: "userId" | "gridXSize" | "gridYSize" ....
type ExposedKeys = typeof exposedProperties[number];

export class PlaySession{

    userId: string;
    gridXSize: number; gridYSize: number;
    tileBucket: Record<string, any[]>;
    inventory: Item[];

    inactivity: NodeJS.Timeout | null = null;

    constructor(props: { userId: string; gridXSize: number; gridYSize: number, tileBucket: Record<string, any[]>, inventory: Item[] }) {
        this.userId = props.userId;
        this.gridXSize = props.gridXSize;
        this.gridYSize = props.gridYSize;
        this.tileBucket = props.tileBucket;
        this.inventory = props.inventory;
    }

    pingListeners: (()=>{})[] = [];
    ping(){
        if(this.inactivity){
            clearTimeout(this.inactivity);
            this.inactivity = null;
        }else{
            console.log(`🏁 STARTED PLAY SESSION: ${this.userId}`);
            // run on start here
        }

        // in 10 seconds of inactivity or lack of response from the client, delete self
        this.inactivity = setTimeout(()=>{
            // save on deletion

            delete playSessionCache[this.userId];
            console.log(`❌🏁 REMOVED PLAY SESSION: ${this.userId}`);
        },10000);

        // run process ticks here
        this.pingListeners.forEach(func=>func());

        // occasionally auto save
    }

    // expose only certain properties
    getData(): Pick<PlaySession, ExposedKeys> {
        return Object.fromEntries(
            exposedProperties.map((key) => [key, this[key]])
        ) as Pick<PlaySession, ExposedKeys>;
    }

    static async getPlaySession(userId: string){
        const found = playSessionCache[userId];
        if(found)return found;

        // fetch user mongoose data to get the tile data here later...

        // else create default:
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
                await build(newCache, {what: islandPreset.defaultTile, x, y});
            }
        }
        // place down prebuilt structures
        await build(newCache, {what: "BrickHouse", x:3, y:4});

        playSessionCache[userId] = newCache;
        return newCache;
    }
}
