
import { ItemCmd } from "@/Gameplay/Items/ItemFlow";
import type { PlaySession } from "../Simulator/PlaySession";

export function validateTrade(session: PlaySession, {buy, sell, err, errs={}}:{buy: string, sell: string, err?:(Err:string)=>void, errs:Record<string, string>}){

    if(!err)err=(field: string, reason: string)=>errs[field] = reason;

    if(!buy) err('buy',"buy can't be blank!");
    if(!sell) err('sell',"sell can't be blank!");
    if(buy && buy === sell) err('sell', "can't trade for the same items back?");

    const buySellChain = {};

    function clientCheck(
        field: string, value: string,
        errLines:{
        lessThan: string,
        tooMany: string,
        nonWhole: string
        },
        afterOk:()=>void
    ){
        if(errs[field] !== undefined)return;

        const chain = ItemCmd({cmd: value});
        const list = chain.getExisting();
        buySellChain[field] = chain;
        const failed = chain.failedToParse!;

        if(failed){
            err(field,`Failed to parse! Invalid syntax! example: metal ore (5), stone (7)`);
        }else{
            const passed: Record<string, boolean> = {};
            for(const {name, item, delta} of list){
                
                // Item exists?
                if(item === undefined){
                    err(field,`Item "${name}" doesn't exist!`);
                break;
                }

                // Isn't untradable?
                if(item.untradable === true){
                    err(field,`Not allowed to exchange "${name}"!`);
                    break;
                }

                // Only registerd once?
                if(passed[name] === true){
                    err(field, `Item "${name}" is put in more than once!`); break;
                } passed[name] = true;

                // Quantity makes sense?
                if(delta <= 0){
                    err(field, errLines.lessThan); break;
                }else if(delta > 100){
                    err(field, errLines.tooMany); break;
                }else if(Math.ceil(delta) !== delta){
                    err(field, errLines.nonWhole); break;
                }
            }
        }
        if(errs[field] === undefined)afterOk?.();
    }

    clientCheck('buy', buy, {
        lessThan:"can't give away less than 1?",
        tooMany:"can't give away more than 100!",
        nonWhole:"can't give away a non whole number!"
    },
    ()=>{
        const affordChain = ItemCmd({session, cmd: buy});
        if(!affordChain.affordable()){
            const lacking = Array.from(affordChain.specificAffordable().entries())
                .filter(([_item, bool])=>!bool)
                .map(([item])=>item.name);
            err('buy', `You are lacking the ${lacking.join('/')} that you specified!`);
        }else{
            buySellChain['buy'] = affordChain;
        }
    });

    clientCheck('sell', sell, {
        lessThan:"can't cost less than 1?",
        tooMany:"can't cost more than 100!",
        nonWhole:"can't cost a non whole number!"
    });

    return (buySellChain as {buy?:ReturnType<ItemCmd>, sell?:ReturnType<ItemCmd>});
}
