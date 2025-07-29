
"use client"

import { CustomProfile } from "@Req";
export function PlayerIcon({profile, username, _id, created}){
    return(
        <div
            className="bg-white rounded-2xl shadow p-4 border border-gray-300 hover:shadow-lg transition"
        >
            <CustomProfile url={profile}/>
            <div className="text-black text-2xl">👤 {username}</div>
            <div className="text-sm text-gray-500">🆔 {_id.slice(0, 4)}...</div>
            <div className="text-xs text-gray-400">
            🕓 {new Date(created).toLocaleDateString()}
            </div>
        </div>
    )
}