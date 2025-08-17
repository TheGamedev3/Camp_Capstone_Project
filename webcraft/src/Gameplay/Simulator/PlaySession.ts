

const exposedProperties = [
    'userId',
    'gridXSize', 'gridYSize',
    'tileBucket', 'inventory'
] as const;

import { allItems, Item } from "../Items/Items";
import { createWorld } from "./CreateWorld";
import { randomBytes } from "crypto";
import { User } from "@Chemicals";
import { createTile } from "../Tiles/TileLibrary";
import { ObjectId } from "mongoose";

export const playSessionCache: Record<string, PlaySession> = {};

// inferred: "userId" | "gridXSize" | "gridYSize" ....
type ExposedKeys = typeof exposedProperties[number];
type TileStack = any[];

export class PlaySession{

    userId: string;
    gridXSize: number; gridYSize: number;
    tileBucket: Record<string, TileStack>;
    inventory: Item[];

    cooldownTileStamps: Record<string, {claim: number; clean:ReturnType<typeof setTimeout>; }> = {}; // used by "Break.ts"!

    private eventChanges: {
        newTiles: string[];
        newItems: Item[];
    }
    tileChange(tileId: string){
        if(!this.eventChanges.newTiles.find(id=>id===tileId))this.eventChanges.newTiles.push(tileId);
        this.changed();
    }
    itemChange(newItem: Item){
        // remove the older updates
        this.eventChanges.newItems = this.eventChanges.newItems.filter(item=>item.slotId !== newItem.slotId);
        this.eventChanges.newItems.push(newItem); // if quantity 0, client will handle deleting it on its end
        this.changed();
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

    private inactivity: NodeJS.Timeout | null = null;

    constructor(props: { userId: string; gridXSize: number; gridYSize: number, tileBucket: Record<string, any[]>, inventory: Item[] }) {
        this.userId = props.userId;
        this.gridXSize = props.gridXSize;
        this.gridYSize = props.gridYSize;
        this.tileBucket = props.tileBucket;
        this.inventory = props.inventory;
        this.eventChanges = {newTiles:[], newItems:[]};
    }

    pingListeners: (()=>{})[] = [];
    private saveCount: number = 3;
    ping(){
        if(this.inactivity){
            clearTimeout(this.inactivity);
            this.inactivity = null;
        }else{
            console.log(`🏁 STARTED PLAY SESSION: ${this.userId}`);
            // run on start here
        }

        // in 10 seconds of inactivity or lack of response from the client, delete self
        this.inactivity = setTimeout(async()=>{
            // save on deletion

            if(playSessionCache[this.userId] !== this)return;
            delete playSessionCache[this.userId];

            // save
            await this.saveToMongo();
            console.log(`❌🏁 REMOVED PLAY SESSION: ${this.userId}`);
        },10000);

        // run process ticks here
        this.pingListeners.forEach(func=>func());

        // occasionally auto save
        if(this.isChanged === 'changed'){
            this.saveCount -= 1;
            if(this.saveCount <= 0){
                this.saveCount = 3;
                this.saveToMongo();
            }
        }
    }

    isChanged: 'changed' | 'saved' | 'saving' = 'saved';
    changed(){this.isChanged = 'changed'}
    async saveToMongo(){
        if(this.isChanged !== 'changed')return;
        this.isChanged = 'saving';
        const user = await User.fetchUser(this.userId);
        if(!user){return undefined;}
        else{
            const{
                userId,
                gridXSize, gridYSize,
                tileBucket,
                inventory
            } = this;

            const saveString = JSON.stringify({
                userId,
                gridXSize, gridYSize,
                tileBucket,
                inventory
            });

            user.playData = saveString;
            await user.save();
            console.log(`💾🌎 SAVED TO MONGO FOR ${userId}`);
        }
        if(this.isChanged === 'saving'){
            this.isChanged = 'saved';
        }
    }

    // ExposedKeys should be a union of keys of PlaySession
    // type ExposedKeys = keyof PlaySession | ... (your union)

    getData(): Pick<PlaySession, ExposedKeys> & { timestamp: number } {

        let change = false;
        // %! PII(251) CLEAR ANY QUANTITY 0 OR DURABILITY 0% ITEMS
        // %! STT(130) ALSO REMOVE DURABILITY 0% ITEMS
        const downgrades: Item[] = [];
        this.inventory = this.inventory.filter(item=>{
            if(item.quantity === 0)return false;
            if(item.tool && item.tool.durability !== 'infinite' && item.tool.currentDurability <= 0){
                downgrades.push(item);
                change = true
                return false;
            }
            return true;
        });
        downgrades.forEach(item=>{
            const downgraded = item.tool?.downgradeToItem;
            if(downgraded){
                const downgradedItem = allItems.find(i=>i.name === downgraded);
                if(downgradedItem){
                    const replacement = {...downgradedItem, slotId: randomBytes(16).toString('hex') };
                    this.inventory.push(replacement);
                    change = true;
                }
            }
        });
        if(change)this.changed();

        const timestamp = Date.now();
        const data = Object.fromEntries(
            exposedProperties.map((key) => [key, this[key]])
        ) as Pick<PlaySession, ExposedKeys>;

        return { ...data, timestamp };
    }

    static async getPlaySession(userId: ObjectId): PlaySession | undefined{
        const found = playSessionCache[userId];
        if(found)return found;

        // fetch user mongoose data to get the session data
        const who = await User.fetchUser(userId);
        if(!who){return undefined;}
        else{
            // who.playData, and json it back?
            // recreate all the tile stuff too?
            // else create default
            const saveString = who.playData;
            if(!saveString){
                console.log(`💾🌎 CREATE WORLD FOR ${userId}`);
                return createWorld(userId);
            }else{
                const{
                    userId,
                    gridXSize, gridYSize,
                    tileBucket,
                    inventory
                } = JSON.parse(saveString);

                const loadWorld = new PlaySession({
                    userId, gridXSize, gridYSize, inventory,
                    tileBucket:{}
                });

                Object.entries(tileBucket).map(([tileId, tileStack])=>{
                    for (let i = tileStack.length - 1; i >= 0; i--) {
                        const tile = tileStack[i];
                        const newTile = createTile({
                            name: tile.name,
                            x: tile.x, y: tile.y,
                            session: loadWorld
                        });
                        delete tile.myListeners;
                        Object.assign(newTile, tile);
                        (loadWorld.tileBucket[tileId] ??= []).push(newTile);
                    }
                });

                playSessionCache[userId] = loadWorld;

                console.log(`💾🌎 LOADING WORLD FROM ${userId}`);
                return loadWorld;
            }
        }
    }
}
