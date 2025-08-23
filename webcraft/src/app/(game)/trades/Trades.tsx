
"use client"

import { TradeIcon } from "./TradeIcon";
import { useQueryParams } from "./paramHook";
import { usePageData } from "./page";
import { useEffect } from "react";
import { getRoute } from "@/utils/request";

export function Trades(){
    const{ PageData, givePageData } = usePageData();
    const{ queryString, getParam } = useQueryParams();
    useEffect(()=>{
        (async()=>{
            let{success, result}=await getRoute({route:`GET /api/trades?${queryString}`});
            if(!success)result={trades:[]};
            givePageData(result);
        })();
    },[queryString]);
    return(
        <div className="grid grid-cols-1 gap-4 mt-6">
            {PageData.trades.map((trade) => (
                <TradeIcon key={trade._id} {...trade} />
            ))}
        </div>
    );
}