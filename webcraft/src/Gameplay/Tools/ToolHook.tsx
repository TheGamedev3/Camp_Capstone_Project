
"use client";
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { getRoute } from "@/utils/request";
import { useSession } from "@/components/RootType/UserSession";
import { defaultTool, Tool } from "./Tools";
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

export function ToolInfoWrapper({ children }){
    const[selectedHighlight, setHighlight] = useState<string | null>(null);
    const[selectedTool, setTool] = useState<Tool>(defaultTool);
    const[selectedTile, setHover] = useState<string | null>(null);
    const{ updateGameData, GameData }=useGameData();

    const updater = useRef(updateGameData);
    useEffect(()=>{updater.current = updateGameData}, [updateGameData]);

    const fireActivate = useCallback(async (tileId: string) => {
        const tileStack = GameData?.tileBucket[tileId];
        const eventData = await selectedTool.action(tileId, tileStack);
        if (eventData?.success === true && (eventData.result.timestamp > GameData.timestamp)) {
            GameData.tileBucket = {...GameData.tileBucket, ...eventData.result.newTiles};

            const newItems = eventData.result.newItems; // [Item, number][]
            const overwriteItem = newItems.map(([item])=>item.slotId);
            GameData.inventory = GameData.inventory.filter(item=>!overwriteItem.includes(item.slotId));
            GameData.inventory.push(...(newItems.map(([item])=>item)));

            GameData.timestamp = eventData.result.timestamp;
            
            updater.current({...GameData});
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
