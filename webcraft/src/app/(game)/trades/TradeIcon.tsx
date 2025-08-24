"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import ItemRack from "@/Gameplay/Trades/ItemRack";
import { TradeAction } from "@/Gameplay/Trades/TradeAction";
import { IngredientsList } from "@/Gameplay/Recipes/Recipe";
import { useState } from "react";

type TradeIconProps = {
  buy: string;
  sell: string;
  _id: string;
  seller: { username: string; _id: string };
  exchanged: boolean;
};

export function TradeIcon({ buy, sell, seller, _id, exchanged }: TradeIconProps) {
  const router = useRouter();

  const goToTrade = () => router.push(`/trade/${_id}`);

  const[affordable, setAff] = useState(false);
  const[navDubious, setDubious] = useState(false);

  return (
    <div
      className={`
        relative w-full rounded-lg border border-gray-300 bg-gray-800 shadow transition
        flex flex-col gap-2 p-4
        ${navDubious ? "cursor-default" : "group cursor-pointer"}

        /* When the action area (no-parent-hover) is hovered, forcibly hide the overlay */
        [&:has(.no-parent-hover:hover)_.overlay]:!opacity-0
        [&:has(.no-parent-hover:hover)_.overlay]:!bg-transparent
        [&:has(.no-parent-hover:hover)_.overlay]:!shadow-none
      `}
      role="button"
      tabIndex={navDubious ? -1 : 0}
      aria-disabled={navDubious}
      aria-label={`Open trade ${_id}`}
      onClick={navDubious ? undefined : goToTrade}
      onKeyDown={
        navDubious
          ? undefined
          : (e) => {
              if (e.key === "Enter" || e.key === " ") goToTrade();
            }
      }
    >

      {/* visual overlay driven by parent hover */}
      <div
        className="
          overlay absolute inset-0 z-40 rounded-lg pointer-events-none
          opacity-0 transition
          group-hover:opacity-100 group-hover:bg-gray-400/17 group-hover:shadow-lg
        "
      />

      {/* CONTENT */}
      <div className="relative z-30 text-white">
        <div className="text-lg font-semibold">Buy:</div>
        <ItemRack itemCmd={buy} />
      </div>

      <div className="relative z-30 text-white">
        <div className="text-lg font-semibold">Cost:</div>
        <IngredientsList cost={sell} isAffordable={setAff} />
      </div>

      <div className="relative z-30 text-xs text-gray-600">
        by:{" "}
        <Link
          href={`/profile/${seller._id}`}
          className="underline hover:no-underline"
          onClick={(e) => e.stopPropagation()}
        >
          {seller.username}
        </Link>
      </div>

      <TradeAction
        tradeId={_id}
        sellerId={seller._id}
        exchanged={exchanged}
        affordable={affordable}
        tradeUnknown={setDubious}
      />
    </div>
  );
}
