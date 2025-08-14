"use client";
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { defaultTool, Tool, Tools } from "./Tools";
import { useGameData } from "../Looks/UpdateHook";
import { useMenu } from "../Recipes/MenuHook";

type ToolContextType = {
  selectedHighlight: string | null;
  selectedTool: Tool;
  equipTool: React.Dispatch<React.SetStateAction<Tool>>;
  selectedTile: string | null;
  setHover: React.Dispatch<React.SetStateAction<string | null>>;
  setSlot: React.Dispatch<React.SetStateAction<string>>;
  fireActivate: (tileId: string) => void;
  holdDown: (tileId: string) => void;
  letGo: (tileId: string) => void;
  processEventData: (eventData: any) => void;
};

const ToolContext = createContext<ToolContextType | null>(null);
export const useTools = () => useContext(ToolContext)!;

export function ToolInfoWrapper({ children }: { children: React.ReactNode }) {
  const {
    ClientData,
    updateGameData,
    updateHoverBucket,
    pushLocalItemChange,
    pushLocalTileChange,
  } = useGameData();

  const [selectedHighlight, setHighlight] = useState<string | null>(null);
  const [selectedTool, setTool] = useState<Tool>(defaultTool);
  const [selectedTile, setHover] = useState<string | null>(null);
  const [selectedSlot, setSlot] = useState<string>("");

  // menu (stable ref)
  const menuHook = useMenu();
  const menuRef = useRef(menuHook);
  useEffect(() => { menuRef.current = menuHook; }, [menuHook]);

  // stable ref to updater
  const updateRef = useRef(updateGameData);
  useEffect(() => { updateRef.current = updateGameData; }, [updateGameData]);

  /** timestamp-guarded event merge */
  const processEventData = useCallback((eventData: any) => {
    if (!eventData?.success) return;
    const res = eventData.result ?? {};
    const incomingTs = Number(res.timestamp ?? 0);

    updateRef.current(prev => {
      if (!prev) return prev;
      const currentTs = Number(prev.timestamp ?? 0);
      if (incomingTs < currentTs) return prev;

      const nextTileBucket = res.newTiles ? { ...prev.tileBucket, ...res.newTiles } : prev.tileBucket;

      let nextInventory = prev.inventory;
      if (Array.isArray(res.newItems)) {
        const bySlot = new Map(prev.inventory.map((it: any) => [it.slotId, it]));
        for (const it of res.newItems) {
          if (!it) continue;
          const qty = typeof it.quantity === "number" ? it.quantity : 0;
          const broken = it.tool && it.tool.durability !== "infinite" &&
                         typeof it.tool.currentDurability === "number" &&
                         it.tool.currentDurability <= 0;
          if (qty === 0 || broken) bySlot.delete(it.slotId);
          else bySlot.set(it.slotId, it);
        }
        nextInventory = Array.from(bySlot.values());
      }

      return { ...prev, tileBucket: nextTileBucket, inventory: nextInventory, timestamp: incomingTs };
    });
  }, []);

  const passToolStruct = useCallback((tileId: string) => {
    const tileStack = ClientData?.tileBucket?.[tileId];
    return{
      ClientData,
      slotId: selectedSlot,
      tileId,
      tileStack,
      changeTool: setTool,
      ...menuRef.current,
      pushLocalItemChange,
      pushLocalTileChange,
    };

  }, [ClientData, selectedSlot, pushLocalItemChange, pushLocalTileChange]);

  /** Equip effect — run only when the tool changes */
  useEffect(() => {
    // pass stable references via closure; do not include them in deps
    return selectedTool.equip({
      ...menuRef.current,
      pushLocalItemChange,
      pushLocalTileChange,
      processEventData,
      ClientData, // read-only snapshot at the time of equip
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTool]); // 👈 ONLY when tool changes

  /** Auto-switch to menu tool when a menu opens */
  const menu = menuHook?.menu || null;
  useEffect(() => {
    if (selectedTool !== Tools[3] && menu !== null) setTool(Tools[3]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  /** Hover evaluation */
  useEffect(() => {
    const tileId = selectedTile ?? undefined;
    const hoverResult = selectedTool.hover(passToolStruct(tileId));

    const nextHighlight = hoverResult?.highlight || null;
    setHighlight(prev => (prev === nextHighlight ? prev : nextHighlight));

    // Build next hover map
    const nextHoverMap = (hoverResult?.hoverTile && tileId)
      ? { [tileId]: [hoverResult.hoverTile] }
      : {};

    updateHoverBucket(prev=>{
        if(JSON.stringify(nextHoverMap) === JSON.stringify(prev))return prev;
        return nextHoverMap;
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTile, passToolStruct]);

  /** Activate current tool */
  const fireActivate = useCallback(async (tileId: string) => {
    if(!selectedTool.action)return;
    const eventData = await selectedTool.action(passToolStruct(tileId));
    if(eventData)processEventData(eventData);
    
  }, [selectedTool, processEventData, passToolStruct]);

  /** Hold down current tool */
  const heldEvent = useRef<{tool: Tool, tileId: string, whileHeld?: ReturnType<typeof setInterval> }|null>(null);
  const cooldowns = useRef<Record<string, number>>({});
  const holdDown = useCallback(async (tileId: string) => {
    
    const current = heldEvent.current;
    if(current){
      const{tileId:currentId, whileHeld} = current;
      if(currentId !== tileId){
        if(whileHeld){clearInterval(whileHeld)}
        heldEvent.current = null;
        // ADD A TIMESTAMP HERE
        // DETECT ELAPSED....
        // HELD EVENT SHOULD BE PERSISTENT AND CONTAIN MORE INFO
      }else{
        return;
      }
    }
    heldEvent.current = {
      tileId,
      tool: selectedTool
    }
    // AWAIT AFTER CURRENT IS SET TO PREVENT RACE CONDITIONS!
    if(selectedTool.onHold){
      const eventData = await selectedTool.onHold(passToolStruct(tileId));
      if(eventData)processEventData(eventData);
    }
    // AND ON HELD DOESNT BREAK
    // STILL GOTTA FIGURE OUT DEBOUNCE TO PREVENT SPAM CLICKING!
    if(selectedTool.whileHeld){
      if(!heldEvent.current)return;

      // prevents spam clicking
      const previousEvent = cooldowns.current[tileId];
      if(previousEvent){
        const since = Date.now()-previousEvent
        if(since < selectedTool.holdRate){
          await new Promise((res)=>setTimeout(res, selectedTool.holdRate-since));
        }
        if(!heldEvent.current || cooldowns.current[tileId] !== previousEvent)return;
      }

      // repeatedly triggers onheld
      cooldowns.current[tileId] = Date.now();
      let eventData = await selectedTool.whileHeld(passToolStruct(tileId));
      if(eventData)processEventData(eventData);
      if(heldEvent.current){
        heldEvent.current.whileHeld = setInterval(async()=>{
          if(!heldEvent.current || heldEvent.current.tileId !== tileId)return;
          cooldowns.current[tileId] = Date.now();
          eventData = await selectedTool.whileHeld(passToolStruct(tileId));
          if(eventData)processEventData(eventData);
        }, selectedTool.holdRate);
      }
    }
  }, [selectedTool, processEventData, passToolStruct]);

  /** Lift current tool */
  const letGo = useCallback(async (tileId: string) => {
    if(heldEvent.current){
      const{tool, whileHeld, tileId:currentId} = heldEvent.current;
      if(whileHeld){clearInterval(whileHeld)}
      if(tool.onLetGo){
        const eventData = await tool.onLetGo(passToolStruct(currentId));
        if(eventData)processEventData(eventData);
      }
      heldEvent.current = null;
    }else{
      // if for some reason there's only a onLetGo event on the tool and no while hold
      if(selectedTool.onLetGo){
        const eventData = await selectedTool.onLetGo(passToolStruct(tileId));
        if(eventData)processEventData(eventData);
      }
    }
  }, [processEventData, passToolStruct, selectedTool]);

  // cleanup on tool being changed
  useEffect(() => {
    return () => {
      const current = heldEvent.current;
      if (current?.holdInterval) clearInterval(current.holdInterval);
      heldEvent.current = null;
      cooldowns.current = {};
    };
  }, [selectedTool]);

  return (
    <ToolContext.Provider
      value={{
        selectedSlot,
        selectedTool,
        processEventData,
        equipTool(tool) {
          if (selectedTool === tool && tool !== defaultTool) setTool(defaultTool);
          else if (tool !== defaultTool || selectedTool !== defaultTool) setTool(tool);
        },
        selectedTile,
        setHover,
        selectedHighlight,
        setSlot,
        fireActivate,

        holdDown, letGo
      }}
    >
      {children}
    </ToolContext.Provider>
  );
}
