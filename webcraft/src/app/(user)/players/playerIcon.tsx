"use client";

import Link from "next/link";
import { CustomProfile } from "@Req";

export function PlayerIcon({ profile, username, _id, created }) {
  return (
    <Link href={`/profile/${_id}`}>
      <div className="cursor-pointer bg-white rounded-2xl shadow p-4 border border-gray-300 hover:shadow-lg hover:bg-gray-50 transition">
        <CustomProfile url={profile} />
        <div className="text-black text-2xl">👤 {username}</div>
        <div className="text-sm text-gray-500">🆔 {_id.slice(0, 4)}...</div>
        <div className="text-xs text-gray-400">
          🕓 {new Date(created).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
