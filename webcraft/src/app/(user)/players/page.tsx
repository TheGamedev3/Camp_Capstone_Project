
"use client"

import PageHeader from "@/components/PageHeader";
import { Requester, SubmitBtn } from "@Req";
import { useState } from "react";

export default function PlayersPage(){
  const[PageData, givePageData]=useState({});
  return (
    <div className="p-8">
      <PageHeader
        title="Players"
        subtitle="All registered players in the world"
      />
      <Requester
          request="GET /api/players?page=1&sortStyle=A-Z&onlineOnly=false"
          triggerOnStart={true}
          onFinish={(success, pageData)=>{
            console.log(pageData)
            if(!success)pageData={};
            givePageData(pageData);
          }}
      >
          <SubmitBtn text="🔁"/>
      </Requester>
      {PageData && PageData.players && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {PageData.players.map(({ username, _id, created }) => (
            <div
              key={_id}
              className="bg-white rounded-2xl shadow p-4 border border-gray-300 hover:shadow-lg transition"
            >
              <div className="text-black text-2xl">👤 {username}</div>
              <div className="text-sm text-gray-500">🆔 {_id.slice(0, 4)}...</div>
              <div className="text-xs text-gray-400">
                🕓 {new Date(created).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
