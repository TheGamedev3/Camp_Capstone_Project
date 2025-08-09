

// %! PII(259) NEW SLOT COMPONENT

// %! PII(260) SHRINK ITEM PROFILE TO A SPECIFIC ASPECT

import Image from "next/image";

type SlotProps = {
  selected: boolean;
  slotId?: string | number;
  name: string;
  icon: string;       // image url
  quantity?: number;
};

// Slot.tsx
export default function Slot({ selected, name, icon, quantity }: SlotProps) {
  return (
    <div
      className={[
        "group relative rounded-md border",
        "bg-neutral-900/40 border-neutral-700",
        "hover:border-neutral-500 transition-colors",
        "w-20 h-20",                 // fixed square; remove w-full/aspect-square
        "shrink-0",                  // never stretch
        selected ? "ring-2 ring-blue-400" : "",
      ].join(" ")}
      title={name}
    >
      {/* Image area */}
      <div className="absolute inset-0 p-2">
        <div className="relative h-full w-full">
          <Image
            src={icon}
            alt={name}
            fill
            unoptimized
            sizes="120px"
            className="object-contain"
            priority={false}
          />
        </div>
      </div>

      {/* Hover overlay label */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-md bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
        <span className="px-2 text-xs font-medium truncate">{name}</span>
      </div>

      {/* Quantity badge */}
      {typeof quantity === "number" && (
        <span className="absolute bottom-1 right-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">
          {quantity}
        </span>
      )}
    </div>
  );
}
