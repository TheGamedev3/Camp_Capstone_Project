
import { ReqFit } from "./ReqFit";

interface BreakAtParams {
  slotId?: string;
  tileId?: string;
  customDamage?: number;
  claim?: number;
  x?: number;
  y?: number;
}

import { ItemCmd } from "../Items/ItemFlow";
export const breakAt = ReqFit<BreakAtParams>(({session, origin, slotId, claim, customDamage, tileId, x, y })=>{
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

    if(!claim && origin === 'api')return{success: false, result: 'invalid claim!'}
    if(claim > Date.now())return{success: false, result: 'cant be from the future...'}
    if(claim < Date.now()-2000)return{success: false, result: 'took too long to reach the server!'}

    const lastTime = session.cooldownTileStamps[tileId];
    if(lastTime){
        // did the last hit REALLY take place a second ago?
        // (5% margin of error)
        const since = Date.now()-lastTime.claim;
        if(since < 950){
            return{success: false, result: `request spamming faster than 1 per second! ${since}ms since...`}
        }

        clearTimeout(lastTime.clean);
        delete session.cooldownTileStamps[tileId];
    }
    session.cooldownTileStamps[tileId]={
        claim,
        clean:setTimeout(()=>{
            // auto clean up self
            delete session.cooldownTileStamps[tileId];
        },2000)
    };

    const tileStack = session.tileBucket[tileId] || [];
    const breakTarget = tileStack.find(stackLayer=>stackLayer.layer === 'structure');
    const success = Boolean(breakTarget);

    if(success){
        // do health stuff here
        breakTarget.currentHealth??=breakTarget.health;

        let damage = 1;
        if(origin === 'api'){
            // break using the tool equipped
            if(slotId){
                const tool = session.getItem(slotId);
                const breakTool = tool?.tool;
                if(breakTool && (breakTool.durability === 'infinite' || (breakTool.currentDurability === undefined || breakTool.currentDurability > 0))){
                    switch(breakTarget.breakType){
                        case"wood": damage = breakTool.woodDmg || 1; break;
                        case"stone": damage = breakTool.stoneDmg || 1; break;
                        case"metal": damage = breakTool.metalDmg || 1; break;
                    }
                    // %! STT(129) SUBTRACT DURABILITY & UPDATE BREAK TOOL
                    if(breakTool.durability !== 'infinite'){
                        if(breakTool.currentDurability === undefined){
                            breakTool.currentDurability = breakTool.durability!;
                        }
                        breakTool.currentDurability -= 1;
                        if(breakTool.currentDurability <= 0){
                            const downgrade = breakTool.downgradeToItem;
                            tool.quantity = 0;
                            if(downgrade)ItemCmd({session, cmd: `${downgrade} (1)`}).give();
                        }
                        session.itemChange(tool);
                    }
                }
            }
        }else{
            // given custom damage from server logic
            damage = customDamage || 1;
        }

        breakTarget.currentHealth-=damage;
        if(breakTarget.currentHealth <= 0){
            // %! IRR(242) GET DROP DATA FROM FUNCTION HERE
            const drops = breakTarget?.dropSelf();
            if(drops)ItemCmd({session, cmd: drops}).give();
        }
        session.tileChange(tileId);
    }

    return{success, result: session.ejectChanges()}
});
