
"use client";
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { defaultTool, Tool } from "./Tools";
import { useGameData } from "../Looks/UpdateHook";
import { Item } from "../Items/Items";

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
    const{ updateGameData, GameData }=useGameData();

    const[selectedHighlight, setHighlight] = useState<string | null>(null);
    const[selectedTool, setTool] = useState<Tool>(defaultTool);
    const[selectedTile, setHover] = useState<string | null>(null);
    const[selectedSlot, setSlot] = useState<string>('');
    // %! BPS(193) USE TOOL HOOK FOR AN OPTIONAL SELECTED ITEM, SEND IT INTO THE ACTION HOVER STUFF
    
    // %! BPS(193) TEMPORARY USE EFFECT SELECT FIRST STRUCTURE ON DEFAULT
    useEffect(()=>{
        if(selectedSlot !== '' || !GameData)return;
        const firstStructure = GameData?.inventory.find(item=>item.itemType === 'structure');
        setSlot(firstStructure.slotId);
    },[GameData, selectedSlot]);

    const updater = useRef(updateGameData);
    useEffect(()=>{updater.current = updateGameData}, [updateGameData]);

    const fireActivate = useCallback(async (tileId: string) => {
        const tileStack = GameData?.tileBucket[tileId];

        // %! BPS(193) PASS SELECTED ITEM TO ACTION
        const eventData = await selectedTool.action({slotId: selectedSlot, tileId, tileStack});
        if (eventData?.success === true && (eventData.result.timestamp > GameData.timestamp)) {
            GameData.tileBucket = {...GameData.tileBucket, ...eventData.result.newTiles};

            const newItems = eventData.result.newItems; // [Item, number][]
            const overwriteItem = newItems.map(([item])=>item.slotId);
            GameData.inventory = GameData.inventory.filter(item=>!overwriteItem.includes(item.slotId));
            GameData.inventory.push(...(newItems.map(([item])=>item)));

            GameData.timestamp = eventData.result.timestamp;
            
            updater.current({...GameData});
        }
    }, [GameData, selectedTool, selectedSlot]);

    useEffect(()=>selectedTool.equip(),[selectedTool]);

    // only update initially on a new tool being selected, or on gamedata updating!!!!
    useEffect(()=>{
        // %! BPS(193) PASS SELECTED ITEM TO HIGHLIGHT
        const tileStack = GameData?.tileBucket[selectedTile];
        const hoverResult = selectedTool.hover({slotId: selectedSlot, tileId: selectedTile, tileStack});
        setHighlight(hoverResult?.highlight || null);
    },[selectedTool, selectedTile, GameData, selectedSlot]);

    return (
        <ToolContext.Provider value={{
            selectedSlot,
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
