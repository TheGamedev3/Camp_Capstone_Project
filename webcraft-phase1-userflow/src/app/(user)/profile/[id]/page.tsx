"use client";

import React from "react";
import Link from "next/link";
import { CustomProfile } from "@Req";
import { useSession } from "@/components/RootType/UserSession";
import { getRoute } from "@/utils/request";
import { useEffect, useState } from "react";
import { PlayerType } from "@types/Player";

type ProfileProps = {
  params: Promise<{ id: string }>;
};

export default function Profile({ params }: ProfileProps) {

  const { id } = React.use(params);
  const[user, setUser]=useState<'loading' | 'notfound' | PlayerType>('loading');
  useEffect(()=>{
    let stillMounted = true;
    (async()=>{
      if(id){

        setUser('loading');
        let user = null;
        const{success, result} = await getRoute<PlayerType | null>({route: `GET /api/profile/${id}`});
        if(success && result)user = result;
        if(!stillMounted)return;

        if(user){setUser(user)}
        else{setUser('notfound')}
      }else{setUser('notfound')}
    })()
    return()=>{stillMounted = false}
  },[id]);

  if(user === 'loading'){
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        🔍 Searching for player {id}...
      </div>
    );
  }

  if(user === 'notfound'){
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        {`404 player: ${id} not found!`}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <div className="flex justify-center">
          <CustomProfile url={user.profile} />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
        </div>

      </div>
    </div>
  );
}
