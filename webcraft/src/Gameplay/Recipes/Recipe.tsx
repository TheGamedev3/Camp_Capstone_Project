
// %! C&C(186) SEPARATE OUT THE INGREDENT THING

import { useEffect, useMemo, useState } from "react";
import { useInventory } from "../Items/InventoryHook";
import { useTools } from "../Tools/ToolHook";
import { useMenu } from "./MenuHook";
import { getRoute } from "@/utils/request";
import { useGameData } from "../Looks/UpdateHook";
import { ItemCmd } from "../Items/ItemFlow";
import type { Item } from "../Items/ItemsClient";

function Ingredient({ displayItem, have, affordable }: { displayItem: Item, have: number, affordable: boolean }) {
  const { name, icon, quantity: need } = displayItem;

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

export function IngredientsList({cost, isAffordable}:{cost:string, isAffordable:((yesNo:boolean)=>void)}){
  const { ClientData } = useGameData();

  const costChain = ItemCmd({session: ClientData, cmd:cost});
  const ingredients = costChain.getDeltaItems(true);
  const affordableMap = costChain.specificAffordable(true);
  const items = costChain.getItems();
  const affordable = costChain.affordable();

  useEffect(()=>{
    isAffordable?.(affordable);
  },[affordable, isAffordable]);

  return(
      <>
        {ingredients.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
            {ingredients.map((item, i) => (
              <Ingredient
                key={`${item?.name ?? "item"}-${i}`}
                displayItem={item}
                have={items[i]?.quantity || 0}
                affordable={affordableMap.get(items[i]) || false}
              />
            ))}
          </div>
        )}
      </>
  );
}

export function Recipe({
  recipeId,
  recipeName,
  outputURL,
  outputCount,
  cost = '',
}: {
  recipeId?: string;
  recipeName?: string;
  outputURL?: string;
  outputCount?: number;
  cost?: string;
}) {
  const { processEventData } = useTools(); // assumes this exists in your hook
  const { menu } = useMenu();

  const [pending, setPending] = useState(false);
  const [affordable, setAfford] = useState(false);
  const disabled = !recipeId || pending || !affordable;

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

            <IngredientsList cost={cost} isAffordable={(yesNo:boolean)=>setAfford(yesNo)}/>
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
