

import { ItemCmd } from "../Items/ItemFlow";
import { ReqFit } from "../Routes/ReqFit";
import { Trade } from "@Chemicals"

// send tradeId via params!

// PATCH
export const HandleTrade = ReqFit(async({session, origin, tradeId, ...rest})=>{
    if(origin !== 'api' || !session)return{success:false};
    // if user owns trade, then exchange, else claim

    const trade = await Trade.fetchTrade({ _id: tradeId });
    if(!trade)return{success:false};

    const ownsTrade = trade.seller === session.userId;
    if(ownsTrade){return await Claim({session, trade, ...rest})}
    else{return await Exchange({session, trade, ...rest})}
});

const Exchange = ReqFit(async({session, trade})=>{
    // can user afford it?
    // if so take cost, and give prize
    // mark the trade as purchased = true!
    if(trade.exchanged)return{success: false}

    const affordChain = ItemCmd({session, cmd: trade.sell});
    if(!affordChain.affordable())return{success: false}

    affordChain.take();
    ItemCmd({session, cmd: trade.buy}).give();
    trade.exchanged = true;
    await trade.save();
    return{success: true, result: session.ejectChanges()}
});

const Claim = ReqFit(async({session, trade})=>{
    // delete the trade, reap rewards
    // put a debounce so the request can't be spammed
    // reap rewards
    if(!trade.exchanged)return{success: false}

    ItemCmd({session, cmd: trade.buy}).give();
    await Trade.deleteOne({ _id: tradeId });
    return{success: true, result: session.ejectChanges()}
});

// DELETE
export const Cancel = ReqFit(async({session, origin, tradeId})=>{
    if(origin !== 'api' || !session)return;
    // isn't claimed yet?
    // delete the trade, get refunded
    // put a debounce so the request can't be spammed

    const trade = await Trade.fetchTrade({ _id: tradeId });
    if(!trade)return;

    const ownsTrade = trade.seller === session.userId;
    if(!ownsTrade)return;

    ItemCmd({session, cmd: trade.buy}).give();
    await Trade.deleteOne({ _id: tradeId });
    return{success: true, result: session.ejectChanges()}
});


