"use client"

import InventoryPanel from "@/Gameplay/Recipes/InventoryPanel";
import { Forum, SubmitBtn, SetTextInput } from "@Req";

import { ItemCmd, existingInfo } from "@/Gameplay/Items/ItemFlow";
import { useGameData } from "@/Gameplay/Looks/UpdateHook";
import type { PlaySession } from "@/Gameplay/Simulator/PlaySession";
import { useCallback } from "react";


function processString(itemCmd: string, session: PlaySession):[boolean, existingInfo[]]{
  const chain = ItemCmd({cmd: itemCmd, session});
  const list = chain.getExisting();
  return [chain.failedToParse!, list];
}

export default function TradeMaker(){
  const { ClientData } = useGameData();

  const slotSubtract = useCallback((field)=>(slotItem)=>{
    if(!slotItem)return;
    SetTextInput(
      "createTrade", field,
      (pre)=>{
        const[failed, list] = processString(pre, field==='buy' ? ClientData : null);
        if(failed)return pre;

        const unstackable = slotItem.itemType === 'breakTool';
        let found = null;
        if(unstackable){
          found = list.find(({item})=>item && item.slotId === slotItem.slotId)?.item;
        }else{
          found = list.find(({item})=>item && item.name === slotItem.name)?.item;
        }
        if(!found)return pre;

        return list.map(({name, item, delta})=>{
          if(item === found && delta > 0){
            if(delta-1 <= 0)return null;
            return`${name} (${delta-1})`;
          };
          if(item?.itemType === 'breakTool')return`<${item.slotId}>`;
          return`${name} (${delta})`;
        }).filter(Boolean).join(', ');
      }
    )
  },[]);

  if (ClientData === null) return <div>Loading</div>;
  return (
    <div className="p-8">

        {/* columns */}
        <div className="grid grid-cols-2 h-[calc(100%-48px)]">
          {/* left placeholder panel (empty for now) */}
          <div className="border-r border-neutral-800 p-3 overflow-auto">
            <InventoryPanel
              itemFilter={({untradable})=>untradable!==true}
              slotClicked={(slotItem)=>{
                if(!slotItem)return;
                SetTextInput(
                  "createTrade", "buy",
                  (pre)=>{
                    const[failed, list] = processString(pre, ClientData);
                    if(failed)return pre;

                    const unstackable = slotItem.itemType === 'breakTool';
                    let found = null;
                    if(unstackable){
                      found = list.find(({item})=>item && item.slotId === slotItem.slotId)?.item;
                    }else{
                      found = list.find(({item})=>item && item.name === slotItem.name)?.item;
                    }
                    if(!found){
                      const append = unstackable 
                        ? `<${slotItem.slotId}>` 
                        : `${slotItem.name} (1)`;
                      if(pre.trim() === "")return append;
                      return pre+`, ${append}`;
                    }
                    if(found && unstackable)return pre;

                    return list.map(({name, item, delta})=>{
                      if(item === found && delta+1 <= slotItem.quantity){
                        return`${name} (${delta+1})`;
                      };
                      if(item?.itemType === 'breakTool')return`<${item.slotId}>`;
                      return`${name} (${delta})`;
                    }).join(', ');
                  }
                )
              }}
            />
          </div>

          {/* right: create trades */}
          <div className="p-3 overflow-auto">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">➕ Post Trade</h1>
        <Forum

          debounceCheck={500}
          clientValidation={({buy, sell, err, errs})=>{
            if(!buy) err('buy',"buy can't be blank!");
            if(!sell) err('sell',"sell can't be blank!");
            if(buy && buy === sell) err('sell', "can't trade for the same items back?");

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

              const[failed, list] = processString(value, field==='buy' ? ClientData : null);
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
              const affordChain = ItemCmd({session: ClientData, cmd: buy});
              if(!affordChain.affordable()){
                const lacking = Array.from(affordChain.specificAffordable().entries())
                  .filter(([_item, bool])=>!bool)
                  .map(([item])=>item.name);
                err('buy', `You are lacking the ${lacking.join('/')} that you specified!`)
              }
            });

            clientCheck('sell', sell, {
              lessThan:"can't cost less than 1?",
              tooMany:"can't cost more than 100!",
              nonWhole:"can't cost a non whole number!"
            });

          }}
          forumName="createTrade"
          request="POST /api/trade"

          body={({buy, sell})=>{
            return{buy, sell, userId: ClientData.userId}
          }}

          clearOnSuccess={true}
          
          fields={[
            {label: 'Buy:', field:'buy', placeholder:'ex: "stone (3), metal ore (5)"', inputType:"buyItems",
              slotClicked:slotSubtract('buy')
            },
            {label: 'Sell:', field:'sell', placeholder:'ex: "stone (3), metal ore (5)"', defaultText:'', inputType:"items",
              slotClicked:slotSubtract('sell')
            }
          ]}
          below={
            <SubmitBtn text="Submit" styling="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disableOnSuccess={false} />
          }
        />
      </div>
          </div>
        </div>
    </div>
  );
}
