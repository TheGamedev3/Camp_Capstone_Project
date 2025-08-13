import { useMemo, useEffect, useRef, useState } from "react";
import { useGameData } from "../Looks/UpdateHook";
import { useTools } from "../Tools/ToolHook";
import type { Item } from "./Items";

export function useInventory() {
  const { ClientData } = useGameData();
  const { selectedTool, selectedSlot, setSlot } = useTools();

  // Sorted snapshot (stable)
  const sortedInventory = useMemo(() => {
    const arr = Array.isArray(ClientData.inventory) ? ClientData.inventory : [];
    return [...arr].sort((a, b) => a.name.localeCompare(b.name));
  }, [ClientData.inventory]);

  const backpack = useMemo(() => ({ inventory: sortedInventory }), [sortedInventory]);

  // Filter to tool-relevant items (if needed)
  const relevantItems = useMemo(() => {
    const filter = selectedTool?.usesItemTypeOf as ((i: Item) => boolean) | undefined;
    return filter ? sortedInventory.filter(filter) : sortedInventory;
  }, [sortedInventory, selectedTool]);

  // Keep selection valid for current tool
  useEffect(() => {
    if (selectedTool?.selectsItems === false) {
      if (selectedSlot !== "") setSlot(""); // only set if actually changing
      return;
    }
    const hasCurrent = relevantItems.some(i => i.slotId === selectedSlot);
    const next = hasCurrent ? selectedSlot : (relevantItems[0]?.slotId ?? "");
    if (next !== selectedSlot) setSlot(next);
  }, [relevantItems, selectedSlot, selectedTool, setSlot]);

  // ==== Quantity change detector (by item.name, sums stacks) =====
  type TotalsByName = Record<string, { item: Item; quantity: number }>;

  const prevTotalsRef = useRef<TotalsByName | null>(null);
  const [itemChanges, setChanges] = useState<Item[]>([]);

  useEffect(() => {
    const totals: TotalsByName = {};
    for (const it of sortedInventory) {
      const name = it?.name;
      if (!name) continue;
      const qty = typeof it.quantity === "number" ? it.quantity : 0;
      const entry = totals[name] ?? { item: { ...it, quantity: 0 }, quantity: 0 };
      entry.quantity += qty;
      // keep a specimen carrying the total
      entry.item = { ...it, quantity: entry.quantity };
      totals[name] = entry;
    }

    const prev = prevTotalsRef.current;
    if (prev === null) {
      prevTotalsRef.current = totals;
      return;
    }

    const deltas: Item[] = [];
    const seen = new Set<string>();

    // changes & additions
    for (const [name, cur] of Object.entries(totals)) {
      seen.add(name);
      const was = prev[name]?.quantity ?? 0;
      const delta = cur.quantity - was;
      if (delta !== 0) {
        deltas.push({ ...cur.item, quantity: delta });
      }
    }
    // removals (entirely disappeared)
    for (const [name, prevEntry] of Object.entries(prev)) {
      if (!seen.has(name) && prevEntry.quantity !== 0) {
        deltas.push({ ...prevEntry.item, quantity: -prevEntry.quantity });
      }
    }

    if (deltas.length > 0) setChanges(deltas);
    prevTotalsRef.current = totals;
  }, [sortedInventory]);

  // ==== Toast list with merging and smart expiry ====
  const EXPIRE_MS = 5000;
  const [changeList, setChangeList] = useState<Array<{ item: Item; ts: number }>>([]);

  // Append/merge new changes
  useEffect(() => {
    if (!itemChanges.length) return;
    const now = Date.now();

    setChangeList(prev => {
      const fresh = prev.filter(({ ts }) => now - ts <= EXPIRE_MS);
      const merged = [...fresh];

      const sameSign = (a: number, b: number) => (a > 0 && b > 0) || (a < 0 && b < 0);

      for (const newItem of itemChanges) {
        const idx = merged.findIndex(({ item }) =>
          item.name === newItem.name && sameSign(item.quantity, newItem.quantity)
        );
        if (idx >= 0) {
          const cur = merged[idx];
          const updated = {
            ...cur,
            item: { ...cur.item, quantity: cur.item.quantity + newItem.quantity },
            ts: now, // refresh
          };
          merged[idx] = updated;
        } else {
          merged.push({ item: newItem, ts: now });
        }
      }
      return merged.slice(-24);
    });
  }, [itemChanges]);

  // Expire periodically, but DO NOT set state if nothing changed
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setChangeList(prev => {
        let changed = false;
        const next = prev.filter(({ ts }) => {
          const keep = now - ts <= EXPIRE_MS;
          if (!keep) changed = true;
          return keep;
        });
        return changed ? next : prev; // avoid rerender if identical
      });
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return { backpack, relevantItems, selectedSlot, changeList };
}
