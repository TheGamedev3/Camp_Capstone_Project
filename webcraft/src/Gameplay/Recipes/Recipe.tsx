
// %! C&C(186) SEPARATE OUT THE INGREDENT THING

import { useMemo, useState } from "react";
import { useInventory } from "../Items/InventoryHook";
import { useTools } from "../Tools/ToolHook";
import { useMenu } from "./MenuHook";
import { getRoute } from "@/utils/request";

type IngredientPair = [{ name: string; icon?: string }, number];

export function Ingredient({ itemPair, have, affordable }: { itemPair: IngredientPair, have: number, affordable: boolean }) {
  const [{ name, icon }, need] = itemPair;

  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs",
        affordable
          ? "bg-emerald-900/40 border-emerald-700 text-emerald-300"
          : "bg-red-900/40 border-red-700 text-red-300",
      ].join(" ")}
      title={`${name} ${have}/${need}`}
      aria-label={`${name}: ${have} of ${need}`}
    >
      {icon ? (
        <img src={icon} alt="" className="w-4 h-4 rounded-sm object-cover" />
      ) : (
        <span className="w-4 h-4 rounded-sm bg-neutral-700 inline-block" />
      )}
      <span className="truncate">{name}</span>
      <span className="opacity-80">{have}/{need}</span>
    </span>
  );
}

export function Recipe({
  recipeId,
  recipeName,
  outputURL,
  outputCount,
  totalCost = [],
}: {
  recipeId?: string;
  recipeName?: string;
  outputURL?: string;
  outputCount?: number;
  totalCost?: IngredientPair[];
}) {
  const { backpack } = useInventory();
  const { processEventData } = useTools(); // assumes this exists in your hook
  const { menu } = useMenu();

  // Build a name→qty map once; avoids N×find per row
  const qtyMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of backpack?.inventory ?? []) map.set(it.name, it.quantity ?? 0);
    return map;
  }, [backpack?.inventory]);

  const haveMap = useMemo(
    () => totalCost.map(([ing]) => qtyMap.get(ing.name) ?? 0),
    [totalCost, qtyMap]
  );
  const affordableMap = useMemo(
    () => totalCost.map(([, need], i) => haveMap[i] >= need),
    [totalCost, haveMap]
  );
  const allAffordable = affordableMap.every(Boolean);

  const [pending, setPending] = useState(false);
  const disabled = !recipeId || !allAffordable || pending;

  async function onCraft() {
    if (!recipeId || !menu) return;
    try {
      setPending(true);
      const { tableType, tileId } = menu;
      const eventData = await getRoute({
        route: `POST /api/craft`,
        body: { recipeId, tableType, tileId },
      });

      if (eventData?.success) {
        // normalize if your processEventData expects a shape
        await processEventData(eventData);
      } else {
        // TODO: surface a toast; for now, console
        console.warn("Craft failed:", eventData?.error ?? eventData?.result);
      }
    } catch (err) {
      console.error("Craft error:", err);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-xl border border-neutral-800 p-3 bg-neutral-900/60">
      <div className="flex items-center justify-between gap-3">
        {/* preview */}
        <div className="flex items-center gap-3 min-w-0">
          {outputURL ? (
            <img
              src={outputURL}
              alt=""
              className="w-8 h-8 rounded-md object-cover border border-neutral-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-md border border-neutral-700 bg-neutral-800/60" />
          )}
          <div className="truncate">
            <div className="text-sm font-medium truncate">
              {recipeName ?? "Recipe"}
              {typeof outputCount === "number" ? ` × ${outputCount}` : null}
            </div>

            {totalCost.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                {totalCost.map((pair, i) => (
                  <Ingredient
                    key={`${pair[0]?.name ?? "item"}-${i}`}
                    itemPair={pair}
                    have={haveMap[i]}
                    affordable={affordableMap[i]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* craft button */}
        <button
          type="button"
          onClick={onCraft}
          disabled={disabled || !menu}
          aria-busy={pending || undefined}
          className={[
            "shrink-0 rounded-lg px-3 py-1.5 text-white text-sm transition-colors",
            "bg-blue-600 hover:bg-blue-700",
            "disabled:bg-neutral-500 disabled:text-neutral-300 disabled:cursor-not-allowed disabled:hover:bg-neutral-500",
          ].join(" ")}
        >
          {pending ? "Crafting…" : "Craft"}
        </button>
      </div>
    </div>
  );
}
