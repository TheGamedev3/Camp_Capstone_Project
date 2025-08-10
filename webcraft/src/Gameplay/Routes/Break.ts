
import { UnderSession } from "./UponSession";

interface BreakAtParams {
  slotId?: string;
  tileId?: string;
  x?: number;
  y?: number;
}

import { giveCommand } from "../Items/ItemGive";
export const breakAt = UnderSession(async(session, clientSide, { slotId, customDamage, tileId, x, y }: BreakAtParams)=>{
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

    if(success){
        // do health stuff here
        breakTarget.currentHealth??=breakTarget.health;

        let damage = 1;
        if(clientSide){
            // break using the tool equipped
            if(slotId){
                const tool = session.getItem(slotId);
                const breakTool = tool?.tool;
                if(breakTool && (breakTool.durability === 'infinite' || breakTool.currentDurability > 0)){
                    switch(breakTarget.breakType){
                        case"wood": damage = breakTool.woodDmg || 1; break;
                        case"stone": damage = breakTool.stoneDmg || 1; break;
                        case"metal": damage = breakTool.metalDmg || 1; break;
                    }
                    // %! STT(129) SUBTRACT DURABILITY & UPDATE BREAK TOOL
                    if(breakTool.durability !== 'infinite'){
                        breakTool.currentDurability -= 1;
                        session.itemChange(tool);
                    }
                }
            }
        }else{
            // given custom damage from server logic
            damage = customDamage;
        }

        breakTarget.currentHealth-=damage;
        if(breakTarget.currentHealth <= 0){
            // %! IRR(242) GET DROP DATA FROM FUNCTION HERE
            const drops = breakTarget?.dropSelf();
            if(drops){await giveCommand(session, drops)}
        }
        session.tileChange(tileId);
    }

    return{success, result: session.ejectChanges()}
});
