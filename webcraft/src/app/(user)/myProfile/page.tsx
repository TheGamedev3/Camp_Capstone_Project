
"use client";

import { Requester, SubmitBtn } from "@Req";
import { useSession } from "@/components/RootType/UserSession";
import { redirect } from "next/navigation";

export default function MyProfile() {
  const{user, updateUser} = useSession(); if(!user)return redirect("/login");
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome, {user.username} 👋</h1>
      <p>Your email is: {user.email}</p>
      <Requester
        request="POST /api/logout"
        goTo='/login'
      >
        <SubmitBtn
          text="logout?"
          styling="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        />
      </Requester>
    </div>
  );
}
