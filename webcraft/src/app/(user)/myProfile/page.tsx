"use client";

import Link from "next/link";
import { useState } from "react";
import { useRequesterContext, Requester, SubmitBtn, CustomProfile } from "@Req";
import { useSession } from "@/components/RootType/UserSession";
import { redirect } from "next/navigation";
import { TradeIcon } from "@/app/(game)/trades/TradeIcon";

export default function MyProfile() {
  const { user } = useSession();
  if (!user) return redirect("/login");

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <div className="flex justify-center">
          <CustomProfile url={user.profile} />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.username} 👋</h1>
        </div>

        <hr className="border-t border-gray-200" />
        <div className="text-center">
          <Link
            href="/mySettings"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            ✏️ Edit Profile
          </Link>
          <Requester
            forumName="logout"
            request="POST /api/logout"
            goTo='/login'
          >
              <LogoutLink/>
          </Requester>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">{user.username}{"'s Trades"}</h1>
        </div>

        <div className="flex-1 min-h-0">
          <div className="grid grid-cols-1 gap-4 mt-4 h-96 overflow-y-auto">
            {user.trades.map((trade) => (
              <TradeIcon key={trade._id} {...trade} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoutLink(){
    const { submit } = useRequesterContext();
    const [disabled, setDisabled] = useState(false);

    return(
        <Link
            className="block px-4 py-2 text-red-500 hover:bg-gray-100"
            href=''
            onClick={(e: React.MouseEvent)=>{
                if(disabled)return;
                setDisabled(true);
                e.preventDefault();
                submit();
            }}
        >
            Logout
        </Link>
    );
}
