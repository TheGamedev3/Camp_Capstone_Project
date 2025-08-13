// ItemPopUp.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useInventory } from "./InventoryHook";
import type { Item } from "./Items";

const EXPIRE_MS = 5000; // keep in sync with the hook if you change it

type ChangeEntry =
  | { item: Item; ts: number }
  | [Item, number]; // [item, ts] tuple (for backward compatibility)

// Normalize to { item, ts }
function toEntry(e: ChangeEntry): { item: Item; ts: number } {
  return Array.isArray(e) ? { item: e[0], ts: Number(e[1]) } : e;
}

function Toast({
  item: { name, icon, quantity },
  ts,
}: {
  item: Item; // quantity holds the delta (+/-)
  ts: number;
}) {
  // enter animation
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Time-based fade: full opacity for first 60%, then fade over last 40%
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 120);
    return () => clearInterval(id);
  }, []);
  const age = Math.max(0, now - ts);
  const t = Math.min(1, age / EXPIRE_MS);
  const fadeStart = 0.6; // begin fading after 60% of lifetime
  const fade = t <= fadeStart ? 1 : 1 - (t - fadeStart) / (1 - fadeStart); // 1 → 0

  const isGain = (quantity ?? 0) > 0;
  const deltaText = isGain ? `+${quantity}` : `${quantity ?? 0}`;

  return (
    <div
      className={[
        "pointer-events-auto min-w-[180px] max-w-[260px] rounded-lg border px-3 py-2 text-sm shadow-lg",
        "bg-neutral-900/90 border-neutral-700 text-neutral-100",
        "transition-all duration-300 will-change-transform will-change-opacity",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      ].join(" ")}
      style={{ opacity: fade }}
      role="status"
      aria-live="polite"
      title={`${name} ${deltaText}`}
    >
      <div className="flex items-center gap-2">
        {/* icon placeholder or image */}
        {icon ? (
          <img src={icon as any} alt="" className="w-5 h-5 rounded-sm object-cover border border-neutral-700" />
        ) : (
          <span className="w-5 h-5 rounded-sm bg-neutral-700 inline-block" />
        )}

        <span
          className={[
            "inline-flex h-5 min-w-[34px] items-center justify-center rounded-full px-1.5 text-xs font-medium",
            isGain ? "bg-emerald-900/60 text-emerald-300" : "bg-red-900/60 text-red-300",
          ].join(" ")}
        >
          {deltaText}
        </span>

        <span className="truncate">{name}</span>
      </div>
    </div>
  );
}

export default function ItemPopUp() {
  const { changeList } = useInventory();

  // Normalize + keep newest last; show only the 5 most recent
  const entries = useMemo(() => {
    const list = (changeList ?? []).map(toEntry);
    // sort by timestamp ascending so flex-col-reverse puts newest at bottom
    list.sort((a, b) => a.ts - b.ts);
    return list.slice(-5);
  }, [changeList]);

  return (
    <aside
      className="fixed bottom-3 right-3 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-label="Inventory changes"
    >
      {entries.map(({ item, ts }, i) => {
        // robust key (slotId might be absent or reused)
        const key = `${item?.name ?? "item"}-${ts}-${i}`;
        return (
          <div key={key} className="pointer-events-none">
            <div className="pointer-events-auto">
              <Toast item={item} ts={ts} />
            </div>
          </div>
        );
      })}
    </aside>
  );
}
