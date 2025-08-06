

import { createTile } from "./TileLibrary";

const playSessionCache: Record<string, PlaySession> = {};

const exposedProperties = [
    'userId',
    'gridXSize', 'gridYSize',
    'tileBucket'
] as const;

// inferred: "userId" | "gridXSize" | "gridYSize" ....
type ExposedKeys = typeof exposedProperties[number];

interface PlaceAtParams {
  who?: string; // can narrow this if needed
  what: string;
  tileId?: TileId;
  x?: number;
  y?: number;
}

interface BreakAtParams {
  tool?: string; // can narrow this if needed
  tileId?: TileId;
  x?: number;
  y?: number;
}


export class PlaySession{

    userId: string;
    gridXSize: number; gridYSize: number;
    tileBucket: Record<string, any[]>;

    inactivity: NodeJS.Timeout | null = null;

    constructor(props: { userId: string; gridXSize: number; gridYSize: number, tileBucket: Record<string, any[]> }) {
        this.userId = props.userId;
        this.gridXSize = props.gridXSize;
        this.gridYSize = props.gridYSize;
        this.tileBucket = props.tileBucket;
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
            tileBucket:{}
        });

        // place down spaces
        for (let y = 0; y < islandPreset.gridYSize; y++) {
            for (let x = 0; x < islandPreset.gridXSize; x++) {
                newCache.placeAt({what: islandPreset.defaultTile, x, y});
            }
        }
        // place down prebuilt structures
        newCache.placeAt({what: "BrickHouse", x:3, y:4});

        playSessionCache[userId] = newCache;
        return newCache;
    }

    placeAt({ who, what, tileId, x, y }: PlaceAtParams): {success: boolean, tileData: any[]} {
        let tx: number, ty: number;
        if (tileId) {
            [tx, ty] = tileId.split('-').map(Number);
        } else if (x != null && y != null) {
            tx = x;
            ty = y;
            tileId = `${tx}-${ty}`;
        } else {
            throw new Error("Must provide either tileId or x/y coordinates.");
        }

        const newTile = createTile({
            tilename: what,
            x: tx,
            y: ty,
            session: this
        });


        const tileStack = this.tileBucket[tileId] || [];
        const layer = newTile.layer;
        let success = false;
        if(layer === 'floor'){
            // if there isnt already a floor
            success = !Boolean(tileStack.find(stackLayer=>stackLayer.layer === 'floor'));
        }else if(layer === 'structure'){
            // if there is a floor and no structure
            success = Boolean(tileStack.find(stackLayer=>stackLayer.layer === 'floor')) && !Boolean(tileStack.find(stackLayer=>stackLayer.layer === 'structure'));
        }

        if(success){(this.tileBucket[tileId] ??= []).push(newTile)}
        return{success, tileData: this.tileBucket[tileId]}
    }

    breakAt({ tool, tileId, x, y }: BreakAtParams): {success: boolean, tileData: any[]} {
        let tx: number, ty: number;
        if (tileId) {
            [tx, ty] = tileId.split('-').map(Number);
        } else if (x != null && y != null) {
            tx = x;
            ty = y;
            tileId = `${tx}-${ty}`;
        } else {
            throw new Error("Must provide either tileId or x/y coordinates.");
        }

        const tileStack = this.tileBucket[tileId] || [];
        const breakTarget = tileStack.find(stackLayer=>stackLayer.layer === 'structure');
        const success = Boolean(breakTarget);
        breakTarget.deleteSelf();
        return{success, tileData: this.tileBucket[tileId]}
    }
}
