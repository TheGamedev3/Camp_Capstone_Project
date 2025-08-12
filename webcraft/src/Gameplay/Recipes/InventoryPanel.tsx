"use client";

import Slot from "../Items/Slot";
import { useMemo } from "react";
import { useInventory } from "../Items/InventoryHook";

export default function InventoryPanel({ filterTo }: { filterTo?: string[] }) {
  const { backpack } = useInventory();

  // filter if requested
  const items = useMemo(() => {
    const inv = backpack?.inventory ?? [];
    if (!filterTo || filterTo.length === 0) return inv;
    const allow = new Set(filterTo.map((n) => n.toLowerCase()));
    return inv.filter((i) => allow.has(i.name.toLowerCase()));
  }, [backpack?.inventory, filterTo]);

  // grid layout settings
  const colCount = 4; // adjust columns
  const slotPx = 80;  // size per slot
  const gapPx = 8;    // spacing

  return (
    <div className="h-full rounded-lg border border-neutral-800/70 bg-neutral-950/30 p-2 overflow-auto">
      {items.length === 0 ? (
        <div className="h-full grid place-items-center text-sm text-neutral-500">
          {filterTo ? "No matching items" : "Inventory is empty"}
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
              key={item.slotId ?? `${item.name}-${Math.random()}`}
              {...(item as any)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
