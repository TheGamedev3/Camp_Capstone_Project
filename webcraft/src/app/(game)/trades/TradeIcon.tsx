"use client";

import Link from "next/link";

export function TradeIcon({ buy, sell, seller, _id }: { buy: string, sell: string, seller: {username: string, userId:string}, _id: string }) {
  return (
    <Link name={`trade`} href={`/trade/${_id}`}>
      <div className="cursor-pointer bg-white rounded-2xl shadow p-4 border border-gray-300 hover:shadow-lg hover:bg-gray-50 transition">
        <div className="text-black text-2xl">{buy}</div>
        <div className="text-black text-2xl">{sell}</div>
        <div className="text-black text-2xl">by: {seller.username}</div>
      </div>
    </Link>
  );
}
