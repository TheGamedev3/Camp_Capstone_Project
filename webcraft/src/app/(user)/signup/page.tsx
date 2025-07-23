
"use client"

import { useSession } from "@/components/UserSession";
import { Forum, SubmitBtn } from "@Req";

import { redirect } from "next/navigation";

export default function SignupPage() {
  const user = useSession();
  if(user)return redirect('/myProfile');

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">SIGNUP</h1>
        <Forum
          request="POST /api/userProfile/signup"
          goTo='/myProfile'
          
          fields={[
            {field:'username', placeholder:'username'},
            {field:'profile', placeholder:'[paste profileURL image here]', defaultText:'https://th.bing.com/th/id/R.eba7a5674add29aeb5265590c3c1bb5e?rik=cBys5futD%2fdkQQ&pid=ImgRaw&r=0', inputType:'image'},
            {field:'email', placeholder:'email'},
            {field:'password', inputType:'password', placeholder:'password'}
          ]}
          below={
            <SubmitBtn text="Submit" styling="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" />
          }
        />
      </div>
    </div>
  );
  // requires a client validator thingy too!
}
