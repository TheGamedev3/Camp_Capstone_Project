"use client"

import InventoryPanel from "@/Gameplay/Recipes/InventoryPanel";
import { Forum, SubmitBtn, SetTextInput } from "@Req";

import { ItemCmd, existingInfo } from "@/Gameplay/Items/ItemFlow";
import { useGameData } from "@/Gameplay/Looks/UpdateHook";
import { useTools } from "@/Gameplay/Tools/ToolHook";
import type { PlaySession } from "@/Gameplay/Simulator/PlaySession";
import { useCallback } from "react";

import { validateTrade } from "@/Gameplay/Trades/validateTrade";

function processString(itemCmd: string, session: PlaySession):[boolean, existingInfo[]]{
  const chain = ItemCmd({cmd: itemCmd, session});
  const list = chain.getExisting();
  return [chain.failedToParse!, list];
}

export default function TradeMaker(){
  const { ClientData } = useGameData();
  const { processEventData } = useTools();

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
          clientValidation={({buy, sell, err, errs})=>{validateTrade(ClientData, {buy, sell, err, errs})}}
          forumName="createTrade"
          request="POST /api/trade"

          body={({buy, sell})=>{
            return{buy, sell}
          }}

          onSuccess={(eventData)=>{
            processEventData(eventData);
          }}
          clearOnSuccess={true}
          
          fields={[
            {label: 'Buy:', field:'buy', placeholder:'ex: "stone (3), metal ore (5)"', defaultText:'', inputType:"buyItems",
              slotClicked:slotSubtract('buy')
            },
            {label: 'Sell:', field:'sell', placeholder:'ex: "stone (3), metal ore (5)"', defaultText:'', inputType:"items",
              slotClicked:slotSubtract('sell')
            }
          ]}
          below={
            <SubmitBtn
              text="Create Trade!"
              styling="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              pendingText="Posting..."
              pendingStyle="bg-blue-800 text-white px-4 py-2 rounded"
              disableOnSuccess={false}
            />
          }
        />
      </div>
          </div>
        </div>
    </div>
  );
}
