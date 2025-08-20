"use client"

import InventoryPanel from "@/Gameplay/Recipes/InventoryPanel";
import { Forum, SubmitBtn } from "@Req";

export default function TradeMaker() {
  return (
    <div className="p-8">

        {/* columns */}
        <div className="grid grid-cols-2 h-[calc(100%-48px)]">
          {/* left placeholder panel (empty for now) */}
          <div className="border-r border-neutral-800 p-3 overflow-auto">
            <InventoryPanel itemFilter={({name})=>{
              return ![
                "wood axe",
                "wood pickaxe",
                "stone axe",
                "stone pickaxe",
                "metal axe",
                "metal pickaxe",
              ].includes(name.toLowerCase());
            }}/>
          </div>

          {/* right: create trades */}
          <div className="p-3 overflow-auto">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">➕ Post Trade</h1>
        <Forum

          debounceCheck={500}
          clientValidation={({buy, sell, err})=>{
            if(!buy) err('buy',"buy can't be blank!");
            if(!sell) err('sell',"sell can't be blank!");
            if(buy && buy === sell) err('sell', "can't trade for the same items back?");
            // VERIFY QUANTITIES HERE
            // CHECK IF ITEMS ACTUALLY EXIST
            if(buy === "ABC") err('buy', "ABC FOUND");
          }}
          forumName="createTrade"
          request="POST /api/trade"

          body={({buy, sell})=>{
            return{buy, sell, USER_ID}
          }}

          onSuccess={()=>{
            // clear the forum onSuccess?
          }}
          // debounce clientValidation constantly after each change detected, instead of just on submit?
          
          fields={[
            {label: 'Buy:', field:'buy', placeholder:'ex: "stone (3), metal ore (5)"'}, // CUSTOM ITEM INPUT TYPE
            {label: 'Sell:', field:'sell', placeholder:'ex: "stone (3), metal ore (5)"', defaultText:''},
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
