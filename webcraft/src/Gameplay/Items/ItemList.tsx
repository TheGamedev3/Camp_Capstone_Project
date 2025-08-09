



// alphabetical
// or by quantity
// by type (placeables or materials)
// select if nessecary

// consider crafting and max storage later


  // use GameData.items memoized!
  // use GameData.itemChanges to use on ItemNotif!

import { useGameData } from "../Looks/UpdateHook"
import { useTools } from "../Tools/ToolHook";
import { Item } from "./Items";
import { useCallback, useMemo } from "react";

export function ItemList() {
  const { GameData, updateGameData } = useGameData();
  // %! BPS(193) USE TOOL HOOK?
  const{ selectedSlot } = useTools();

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

  const backpack = useMemo(() => ({
    inventory: GameData.inventory,
    updateSlot,
  }), [GameData.inventory, updateSlot]);

  // %! BPS(192) SELECT UI
  return (
    <div>
      {backpack.inventory.map(({ slotId, name, quantity }) => (
        <div
          key={slotId}
          className={`px-2 py-1 ${
            slotId === selectedSlot ? 'bg-blue-300' : ''
          }`}
        >
          {name} ({quantity})
        </div>
      ))}
    </div>
  );
}

// (eventually each slot will be its own component with its own hook)