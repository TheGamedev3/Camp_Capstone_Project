
"use client";
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { defaultTool, Tool } from "./Tools";
import { useGameData } from "../Looks/UpdateHook";

type ToolContextType = {
  selectedHighlight: string | null;
  selectedTool: Tool;
  equipTool: React.Dispatch<React.SetStateAction<Tool>>;
  selectedTile: string | null;
  setHover: React.Dispatch<React.SetStateAction<string | null>>;
  setSlot: React.Dispatch<React.SetStateAction<string>>;
  fireActivate: (x: number, y: number)=>void;
};

const ToolContext = createContext<ToolContextType | null>(null);
export const useTools = () => useContext(ToolContext)!;

export function ToolInfoWrapper({ children }){
    const{ updateGameData, updateHoverBucket, GameData }=useGameData();

    const[selectedHighlight, setHighlight] = useState<string | null>(null);
    const[selectedTool, setTool] = useState<Tool>(defaultTool);
    const[selectedTile, setHover] = useState<string | null>(null);
    const[selectedSlot, setSlot] = useState<string>('');
    // %! BPS(193) USE TOOL HOOK FOR AN OPTIONAL SELECTED ITEM, SEND IT INTO THE ACTION HOVER STUFF

    const updater = useRef(updateGameData);
    useEffect(()=>{updater.current = updateGameData}, [updateGameData]);
    
    const liveData = useRef(GameData);
    useEffect(()=>{liveData.current = GameData}, [GameData]);

    const fireActivate = useCallback(async (tileId: string) => {
        const gamedata=()=>liveData.current;
        const tileStack = gamedata()?.tileBucket[tileId];

        // %! BPS(193) PASS SELECTED ITEM TO ACTION
        const eventData = await selectedTool.action({
            refresh: updater.current,
            GameData: gamedata(),
            slotId: selectedSlot,
            tileId, tileStack
        });
        const gameDataNow = gamedata();
        if (eventData?.success === true && (eventData.result.timestamp > gameDataNow.timestamp)) {
            gameDataNow.tileBucket = {...gameDataNow.tileBucket, ...eventData.result.newTiles};

            const newItems = eventData.result.newItems; // Item[]
            const overwriteItem = newItems.map(item=>item.slotId);
            gameDataNow.inventory = gameDataNow.inventory.filter(item=>!overwriteItem.includes(item.slotId));
           
            // %! PII\(252/253) UPDATE NUMBERS ON THE CLIENT SIDE
            // %! STT(130) ALSO REMOVE DURABILITY 0% ITEMS
            gameDataNow.inventory.push(...(newItems.filter(item=>{
                if(item.quantity === 0)return false;
                if(item.tool && item.tool.durability !== 'infinite' && item.tool.currentDurability <= 0)return false;
                return true;
            })));

            gameDataNow.timestamp = eventData.result.timestamp;
            
            updater.current({...gameDataNow});
        }
    }, [selectedTool, selectedSlot]);

    useEffect(()=>selectedTool.equip(),[selectedTool]);

    // only update initially on a new tool being selected, or on gamedata updating!!!!
    useEffect(()=>{
        // %! BPS(193) PASS SELECTED ITEM TO HIGHLIGHT
        const tileStack = GameData?.tileBucket[selectedTile];
        const hoverResult = selectedTool.hover({GameData, slotId: selectedSlot, tileId: selectedTile, tileStack});
        
        setHighlight(hoverResult?.highlight || null);

        const hoverTile = hoverResult?.hoverTile;
        updateHoverBucket(
            (hoverTile && selectedTile) ? {[selectedTile]:[hoverTile]} : {}
        );
    },[selectedTool, selectedTile, GameData, selectedSlot]);

    // %! PII(257) PROVIDE THE RELEVANT INVENTORY ASKED FROM THE TOOLS
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
            selectedTile, setHover, selectedHighlight, setSlot,
            fireActivate
        }}>
            {children}
        </ToolContext.Provider>
    );
}
