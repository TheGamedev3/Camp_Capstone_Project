

import { ReqFit } from "../Routes/ReqFit";
import { ItemCmd, getBaseItems } from "../Items/ItemFlow";
import { validateTrade } from "./validateTrade";
import { Trade } from "@Chemicals";

export const createTrade = ReqFit<CraftInfo>(async({session, origin, buy, sell})=>{
    if(origin === 'api' && session){
        // verify the quantities
        // whole numbers
        // positive
        // affordable
        // for both buy and cost
        const failReasons: string[] = [];
        const errs = {};
        const err = (field, reason)=>{
            errs[field] = reason;
            failReasons.push(reason);
        }
        const{buy:buyChain, sell:sellChain} = validateTrade(session, {buy, sell, err, errs});

        if(failReasons.length > 0)return{success: false, err: { server: failReasons.join(', '), ...errs}}

        // extract the buy items from the session
        // make sure its in item (5), {DATA} format, REMOVING THE IDS!
        const buyString = buyChain.getExisting().map(({item, delta})=>{
            // IF ITS NONSTACKABLE, PUT IN THE RAW DATA
            if(item.itemType === 'breakTool')return`${JSON.stringify(item)}`;
            return`${item.name} (${delta})`;
        }).join(', ');

        // subtract away items that were put forth
        buyChain.take();

        // create the trade with schema!
        // return the event data!
        const TradeObject = await Trade.create({
            buy: buyString,
            sell: sellChain.getExisting().map(({item, delta})=>`${item.name} (${delta})`).join(', '),
            seller: session.userId
        });
        console.log("TRADE CREATED", TradeObject)

        return {success: true, result: session.ejectChanges()};
    }
    return{success: false}
});

