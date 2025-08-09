

export const playSessionCache: Record<string, PlaySession> = {};

const exposedProperties = [
    'userId',
    'gridXSize', 'gridYSize',
    'tileBucket', 'inventory'
] as const;

import { Item } from "../Items/Items";
import { createWorld } from "./CreateWorld";

// inferred: "userId" | "gridXSize" | "gridYSize" ....
type ExposedKeys = typeof exposedProperties[number];
type TileStack = any[];

export class PlaySession{

    userId: string;
    gridXSize: number; gridYSize: number;
    tileBucket: Record<string, TileStack>;
    inventory: Item[];

    private eventChanges: {
        newTiles: string[];
        newItems: [Item, number][];
    }
    tileChange(tileId: string){
        if(!this.eventChanges.newTiles.find(id=>id===tileId))this.eventChanges.newTiles.push(tileId);
    }
    itemChange(newItem: Item, quantity: number){
        // remove the older updates
        this.eventChanges.newItems = this.eventChanges.newItems.filter(([item])=>item.slotId !== newItem.slotId);
        this.eventChanges.newItems.push([newItem, quantity]); // if quantity 0, client will handle deleting it on its end
    }
    ejectChanges(){
        const eventChanges = this.eventChanges;
        this.eventChanges = {newTiles:[], newItems:[]};
        const{newTiles, newItems} = eventChanges;

        return{
            timestamp: Date.now(),
            newTiles:Object.fromEntries(newTiles.map(tileId=>[tileId, this.tileBucket[tileId]])),
            newItems
        };
    }

    getItem(slotId: string){
        if(!slotId)return null;
        return this.inventory.find(item=>item.slotId === slotId) || null;
    }

    inactivity: NodeJS.Timeout | null = null;

    constructor(props: { userId: string; gridXSize: number; gridYSize: number, tileBucket: Record<string, any[]>, inventory: Item[] }) {
        this.userId = props.userId;
        this.gridXSize = props.gridXSize;
        this.gridYSize = props.gridYSize;
        this.tileBucket = props.tileBucket;
        this.inventory = props.inventory;
        this.eventChanges = {newTiles:[], newItems:[]};
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

    // ExposedKeys should be a union of keys of PlaySession
    // type ExposedKeys = keyof PlaySession | ... (your union)

    getData(): Pick<PlaySession, ExposedKeys> & { timestamp: number } {

        const data = Object.fromEntries(
            exposedProperties.map((key) => [key, this[key]])
        ) as Pick<PlaySession, ExposedKeys>;

        return { ...data, timestamp: Date.now() };
    }

    static async getPlaySession(userId: string){
        const found = playSessionCache[userId];
        if(found)return found;

        // fetch user mongoose data to get the tile data here later...

        // else create default
        return await createWorld(userId);
    }
}
