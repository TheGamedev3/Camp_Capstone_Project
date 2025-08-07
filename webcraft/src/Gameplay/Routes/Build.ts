
import { UnderSession } from "./UponSession";
import { isTileName, createTile } from "../Tiles/TileLibrary";

interface PlaceAtParams {
  who?: string; // can narrow this if needed
  what: string;
  tileId?: string;
  x?: number;
  y?: number;
}

export const build = UnderSession((session, { who, what, tileId, x, y }:PlaceAtParams)=>{
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
            tilename: what,
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

        if(success){(session.tileBucket[tileId] ??= []).push(newTile)}
        return{success, tileData: session.tileBucket[tileId]}
    }else{
        console.error(`❌⏹️ TILE "${what}" NOT FOUND!`);
    }
});
