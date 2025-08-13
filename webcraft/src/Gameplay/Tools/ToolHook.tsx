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
  processEventData: (eventData: any) => void;
};

const ToolContext = createContext<ToolContextType | null>(null);
export const useTools = () => useContext(ToolContext)!;

export function ToolInfoWrapper({ children }: { children: React.ReactNode }) {
  const {
    ClientData,               // merged view
    updateGameData,           // server state setter
    hoverBucket,              // 👈 bring current hover map so we can diff
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

  /** Activate current tool */
  const fireActivate = useCallback(async (tileId: string) => {
    const tileStack = ClientData?.tileBucket?.[tileId];

    const eventData = await selectedTool.action({
      ClientData,
      slotId: selectedSlot,
      tileId,
      tileStack,
      changeTool: setTool,
      ...menuRef.current,
      pushLocalItemChange,
      pushLocalTileChange,
      processEventData,
    });

    processEventData(eventData);
  }, [ClientData, selectedTool, selectedSlot, processEventData, pushLocalItemChange, pushLocalTileChange]);

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
    const tileStack = tileId ? ClientData?.tileBucket?.[tileId] : undefined;

    const hoverResult = selectedTool.hover({
      ClientData,
      slotId: selectedSlot,
      tileId,
      tileStack,
      changeTool: setTool,
      ...menuRef.current,
      pushLocalItemChange,
      pushLocalTileChange,
      processEventData,
    });

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
  }, [
    selectedTool,
    selectedTile,
    ClientData,          // depend on merged data (this can change)
    selectedSlot,
    pushLocalItemChange, // these are used but their identity should be memoized in provider
    pushLocalTileChange,
    processEventData,
  ]);

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
      }}
    >
      {children}
    </ToolContext.Provider>
  );
}
