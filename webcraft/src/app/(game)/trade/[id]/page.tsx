"use client";

import React from "react";
import { getRoute } from "@/utils/request";
import { useEffect, useState } from "react";
import ItemRack from "@/Gameplay/Trades/ItemRack";
import { IngredientsList } from "@/Gameplay/Recipes/Recipe";
import Link from "next/link";

type TradeType = unknown;

type ProfileProps = {
  params: Promise<{ id: string }>;
};

export default function Profile({ params }: ProfileProps) {

  const { id } = React.use(params);
  const[trade, setTrade]=useState<'loading' | 'notfound' | TradeType>('loading');
  useEffect(()=>{
    let stillMounted = true;
    (async()=>{
      if(id){

        setTrade('loading');
        let trade = null;
        const{success, result} = await getRoute<TradeType | null>({route: `GET /api/trade/${id}`});
        if(success && result)trade = result;
        if(!stillMounted)return;

        if(trade){setTrade(trade)}
        else{setTrade('notfound')}
      }else{setTrade('notfound')}
    })()
    return()=>{stillMounted = false}
  },[id]);

  if(trade === 'loading'){
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        🔍 Searching for trade {id}...
      </div>
    );
  }

  if(trade === 'notfound'){
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        {`404 trade: ${id} not found!`}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <div className="text-black text-2xl">Buy:</div>
        <ItemRack itemCmd={trade.buy}/>

        <div className="text-black text-2xl">Cost:</div>
        <IngredientsList cost={trade.sell} />

        <div className="text-xs text-gray-600">
          by:{" "}
          <Link
            href={`/profile/${trade.seller._id}`}
            className="underline hover:no-underline"
            onClick={(e) => e.stopPropagation()} // prevent triggering the row click
          >
            {trade.seller.username}
          </Link>
        </div>
      </div>
    </div>
  );
}
