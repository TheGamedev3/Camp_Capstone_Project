
"use client";
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { getRoute } from "@/utils/request";
import { useSession } from "@/components/RootType/UserSession";
import { Tool } from "./Tool";
import { useGameData } from "../Looks/UpdateHook";

type ToolContextType = {
  selectedHighlight: string | null;
  selectedTool: Tool;
  equipTool: React.Dispatch<React.SetStateAction<Tool>>;
  selectedTile: string | null;
  setHover: React.Dispatch<React.SetStateAction<string | null>>;
  fireActivate: (x: number, y: number)=>void;
};

const ToolContext = createContext<ToolContextType | null>(null);
export const useTools = () => useContext(ToolContext)!;

import { defaultTool } from "./Tool";

export function ToolInfoWrapper({ children }){
    const[selectedHighlight, setHighlight] = useState<string | null>(null);
    const[selectedTool, setTool] = useState<Tool>(defaultTool);
    const[selectedTile, setHover] = useState<string | null>(null);
    const{ updateTile, GameData }=useGameData();

    const updater = useRef(updateTile);
    useEffect(()=>{updater.current = updateTile}, [updateTile]);

    const fireActivate = useCallback(async (tileId: string) => {
        const tileStack = GameData?.tileBucket[tileId];
        const actionResult = await selectedTool.action(tileId, tileStack);
        if (actionResult?.tileUpdate?.success === true) {
            updater.current(tileId, actionResult.tileUpdate.result);
        }
    }, [GameData, selectedTool]);

    useEffect(()=>selectedTool.equip(),[selectedTool]);

    // only update initially on a new tool being selected, or on gamedata updating!!!!
    useEffect(()=>{
        const tileStack = GameData?.tileBucket[selectedTile];
        const hoverResult = selectedTool.hover(selectedTile, tileStack);
        setHighlight(hoverResult?.highlight || null);
    },[selectedTool, selectedTile, GameData]);

    return (
        <ToolContext.Provider value={{
            selectedTool,
            equipTool(tool){
                if(selectedTool === tool && tool !== defaultTool){
                    selectedTool.unequip();
                    setTool(defaultTool);
                }else if(tool !== defaultTool || selectedTool !== defaultTool){
                    selectedTool.unequip();
                    setTool(tool);
                }
            },
            selectedTile, setHover, selectedHighlight,
            fireActivate
        }}>
            {children}
        </ToolContext.Provider>
    );
}
