"use client";

import Slot from "../Items/Slot";
import { useMemo } from "react";
import { useInventory } from "../Items/InventoryHook";
import { Item } from "../Items/Items";

export default function InventoryPanel({ itemFilter, slotClicked }: { itemFilter?: (item: Item)=>boolean, slotClicked?: (item: Item)=>void }) {
  const { backpack } = useInventory();

  // filter if requested
  const items = useMemo(() => {
    const inv = backpack?.inventory ?? [];
    if (!itemFilter) return inv;
    return inv.filter(itemFilter);
  }, [backpack?.inventory, itemFilter]);

  // grid layout settings
  const colCount = 4; // adjust columns
  const slotPx = 80;  // size per slot
  const gapPx = 8;    // spacing

  return (
    <div className="h-full rounded-lg border border-neutral-800/70 bg-neutral-950/30 p-2 overflow-auto">
      {items.length === 0 ? (
        <div className="h-full grid place-items-center text-sm text-neutral-500">
          {itemFilter ? "No matching items" : "Inventory is empty"}
        </div>
      ) : (
        <div
            className="grid"
            style={{
                // fill the row with as many 80px cells as fit
                gridTemplateColumns: `repeat(auto-fill, 80px)`,
                gap: `8px`,
                justifyContent: "start",          // or "center" if you prefer symmetric gutters
                alignContent: "start",
            }}
        >
          {items.map((item) => (
            <Slot
              item={item}
              key={item.slotId ?? `${item.name}-${Math.random()}`}
              onClick={slotClicked}
            />
          ))}
        </div>
      )}
    </div>
  );
}
