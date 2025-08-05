
"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getRoute } from "@/utils/request";
import { useSession } from "@/components/RootType/UserSession";
import { Tool } from "./Tool";

type ToolContextType = {
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
    const[selectedTool, setTool] = useState<Tool>(defaultTool);
    const[selectedTile, setHover] = useState<string | null>(null);

    useEffect(()=>selectedTool.equip(),[selectedTool]);
    useEffect(()=>selectedTool.hover(selectedTile),[selectedTool, selectedTile]);
    
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
            selectedTile, setHover,
            fireActivate(tileId: string){selectedTool.action(tileId)}
        }}>
            {children}
        </ToolContext.Provider>
    );
}
