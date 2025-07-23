
"use client";

import { getSession } from "@/lib/Validator";
import { Requester } from "@/components/Requester";
import { SubmitBtn } from "@/components/SubmitBtn";
import { redirect } from "next/navigation";
import { useSession } from "@/components/UserSession";

export default function myProfile() {
  const user = useSession();
  if(!user){redirect('/login')}
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome, {user.username} 👋</h1>
      <p>Your email is: {user.email}</p>
      <Requester
        request="POST /api/userProfile/logout"
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
