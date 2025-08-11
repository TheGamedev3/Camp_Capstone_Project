

// %! PII(259) NEW SLOT COMPONENT

// %! PII(260) SHRINK ITEM PROFILE TO A SPECIFIC ASPECT

import Image from "next/image";

type SlotProps = {
  selected: boolean;
  slotId?: string | number;
  name: string;
  icon: string;       // image url
  quantity?: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  tool?:{
    durability: number | 'infinite';
    currentDurability: number;
  }
};

// Slot.tsx
export default function Slot({
  selected,
  name,
  icon,
  quantity,
  tool,
  onClick,
}: SlotProps) {
  // %! STT(131) durability health bar show in the slot if it has both durability & current durability!!!
  
  const hasDurability = tool && tool.durability !== 'infinite' && tool.currentDurability > 0;

  const pct =
    hasDurability ? Math.max(0, Math.min(1, tool.currentDurability! / tool.durability!)) : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      className={[
        "group relative rounded-md border",
        "bg-neutral-900/40 border-neutral-700",
        "hover:border-neutral-500 transition-colors",
        "w-20 h-20 shrink-0",
        selected ? "ring-2 ring-blue-400" : "",
      ].join(" ")}
    >
      {/* Image area (no pointer capture) */}
      <div className="absolute inset-0 p-2 pointer-events-none select-none">
        <div className="relative h-full w-full">
          <Image
            src={icon}
            alt={name}
            fill
            unoptimized
            sizes="120px"
            className="object-contain"
            priority={false}
            draggable={false}
          />
        </div>
      </div>

      {/* Hover overlay label */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-md bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
        <span className="px-2 text-xs font-medium truncate">{name}</span>
      </div>

      {/* Quantity badge */}
      {typeof quantity === "number" && (
        <span className="pointer-events-none absolute bottom-1 right-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">
          {quantity}
        </span>
      )}

      {/* Durability bar (bottom-center) */}
      {hasDurability && (
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 w-16 h-1 rounded bg-black/50 overflow-hidden">
          <div
            className="h-full bg-emerald-400"
            style={{ width: `${Math.round(pct * 100)}%` }}
          />
        </div>
      )}
    </button>
  );
}

