
import { ReqFit } from "./ReqFit";
import { isTileName, createTile } from "../Tiles/TileLibrary";

interface PlaceAtParams {
  who?: string; // can narrow this if needed
  what: string;
  tileId?: string;
  slotId?: string;
  x?: number;
  y?: number;
}

// %! BPS(204) spawn structure
export const spawnStructure = ReqFit<PlaceAtParams, {success: boolean}>(({session, who, what, tileId, x, y })=>{
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

    if(isTileName(what)){
        const newTile = createTile({
            name: what,
            x: tx, y: ty,
            session
        });

        const tileStack = session.tileBucket[tileId] || [];
        const layer = newTile.layer;
        let success = false;
        if(layer === 'floor'){
            // if there isnt already a floor
            success = !Boolean(tileStack.find(stackLayer=>stackLayer.layer === 'floor'));
        }else if(layer === 'structure'){
            // if there is a floor and no structure
            success = Boolean(tileStack.find(stackLayer=>stackLayer.layer === 'floor')) && !Boolean(tileStack.find(stackLayer=>stackLayer.layer === 'structure'));
        }

        if(success){
            (session.tileBucket[tileId] ??= []).push(newTile);
            session.tileChange(tileId);
        }
        return{success}
    }else{
        console.error(`❌⏹️ TILE "${what}" NOT FOUND!`);
        return{success: false}
    }
});


// %! BPS(204) PLACE ITEM FUNCTION AND SESSION
import { ItemCmd } from "../Items/ItemFlow";
export const placeItem = ReqFit<PlaceAtParams>(({session, slotId, tileId, x, y })=>{
    // %! BPS(205) SUBTRACT AWAY WHAT WAS NESSECARY
    // GET THE ITEM
    // PLUG IT INTO SPAWN STRUCTURE
    // FIX THE BUILD ROUTE CALLER TO BE PLACE ITEM
    // FIX THE BUILD ROUTE PLACER TO SPAWN INSTEAD OF PLACE
    const item = session.getItem(slotId);
    let result = null;
    if(item && item.quantity !== undefined && item.quantity > 0 && item.itemType === 'structure' && item.structure){
        
        result = spawnStructure({
            session,
            who: 'player',
            what: item.structure,
            tileId, x, y
        });

        if(result && result.success){
            // instead of using the give command, subtract it out manually, as to use the correct slotId reference
            ItemCmd({session, cmd:`<${item.slotId}> (1)`}).take();
            return{success: result.success, result: session.ejectChanges()}
        }
    }
    console.error(`COULDNT PLACE ITEM ${slotId}! \n`, item, `\n result:\n`, result);
    return{success: false}
});
// %! BPS(206) VERIFY U HAVE ENOUGH OF THAT ITEM
