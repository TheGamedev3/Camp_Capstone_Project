
import { UnderSession } from "./UponSession";

interface BreakAtParams {
  tool?: string; // can narrow this if needed
  tileId?: string;
  x?: number;
  y?: number;
}

import { giveCommand } from "../Items/ItemGive";
export const breakAt = UnderSession((session, { tool, tileId, x, y }: BreakAtParams)=>{
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

    const tileStack = session.tileBucket[tileId] || [];
    const breakTarget = tileStack.find(stackLayer=>stackLayer.layer === 'structure');
    const success = Boolean(breakTarget);
    breakTarget.deleteSelf();
    session.tileChange(tileId);

    giveCommand(session, "wood (3)");

    return{success, result: session.ejectChanges()}
});
