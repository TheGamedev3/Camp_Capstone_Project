
import { useMemo, useCallback, useEffect } from "react";
import { useGameData } from "../Looks/UpdateHook";
import { useTools } from "../Tools/ToolHook";
import type { Item } from "./Items";

export function useInventory() {
  const { GameData, updateGameData } = useGameData();

  const updateSlot = useCallback((...items: Item[]) => {
    if (items.length === 0) return;

    updateGameData(prev => {
      if (!prev) return prev;

      const overwrite = new Set(items.map(i => i.slotId));
      const nextInv = [
        ...prev.inventory.filter(i => !overwrite.has(i.slotId)),
        ...items,
      ];

      return { ...prev, inventory: nextInv };
    });
  }, [updateGameData]);

  // %! PII(257) USE THE RELEVANT INVENTORY ASKED FROM THE TOOLS
  // FROM THE useTools HOOK NOT USE GAME DATA!

  // consistent alphabetical order
  const sortedInventory = useMemo(
    () => [...GameData.inventory].sort((a, b) => a.name.localeCompare(b.name)),
    [GameData.inventory]
  );

  const backpack = useMemo(() => ({
    inventory: sortedInventory,
    updateSlot,
  }), [sortedInventory, updateSlot]);

  const { selectedTool, selectedSlot, setSlot } = useTools();

  const relevantItems = useMemo(() => {
    const filter = selectedTool?.usesItemTypeOf as ((i: Item) => boolean) | undefined;
    return filter ? backpack.inventory.filter(filter) : backpack.inventory;
  }, [backpack.inventory, selectedTool]);

  useEffect(() => {
    if(selectedTool.selectsItems === false){
        setSlot(''); return;
    }
    const hasCurrent = relevantItems.some(i => i.slotId === selectedSlot);
    const next = hasCurrent ? selectedSlot : (relevantItems[0]?.slotId ?? '');
    
    // %! PII(256) USE THE FILTER OF selectedTool.filter AND SELECT THE FIRST ITEM
    if (next !== selectedSlot) setSlot(next);
  }, [relevantItems, selectedSlot, setSlot]);


  return { backpack, relevantItems, selectedSlot };
}
