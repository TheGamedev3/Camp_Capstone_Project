
"use client"

import { PlayerIcon } from "./playerIcon";
import { useQueryParams } from "./paramHook";
import { usePageData } from "./page";
import { useEffect } from "react";
import { getRoute } from "@/utils/request";

export function Players(){
    const{ PageData, givePageData } = usePageData();
    const{ queryString, getParam } = useQueryParams();
    useEffect(()=>{
        (async()=>{
            let{success, result}=await getRoute({route:`GET /api/players?${queryString}`});
            if(!success)result={players:[]};
            givePageData(result);
        })();
    },[queryString]);
    return(
        <>
            {PageData && PageData.players && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                    {PageData.players.map((player) => (<PlayerIcon key={player._id} {...player}/>))}
                </div>
            )}
        </>
    );
}