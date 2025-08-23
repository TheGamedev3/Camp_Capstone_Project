"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import ItemRack from "@/Gameplay/Trades/ItemRack";
import { IngredientsList } from "@/Gameplay/Recipes/Recipe";

type TradeIconProps = {
  buy: string;
  sell: string;
  _id: string;
  seller: { username: string; _id: string };
};

export function TradeIcon({ buy, sell, seller, _id }: TradeIconProps) {
  const router = useRouter();

  const goToTrade = () => router.push(`/trade/${_id}`);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToTrade}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") goToTrade();
      }}
      className="w-full cursor-pointer bg-gray-800 rounded-lg shadow p-4 border border-gray-300 hover:shadow-lg hover:bg-gray-400 transition flex flex-col gap-2"
      aria-label={`Open trade ${_id}`}
    >
      <div className="text-white">
        <div className="text-lg font-semibold">Buy:</div>
        <ItemRack itemCmd={buy} />
      </div>

      <div className="text-white">
        <div className="text-lg font-semibold">Cost:</div>
        <IngredientsList cost={sell} />
      </div>

      <div className="text-xs text-gray-600">
        by:{" "}
        <Link
          href={`/profile/${seller._id}`}
          className="underline hover:no-underline"
          onClick={(e) => e.stopPropagation()} // prevent triggering the row click
        >
          {seller.username}
        </Link>
      </div>
    </div>
  );
}
