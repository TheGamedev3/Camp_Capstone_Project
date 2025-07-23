
"use client";

import { Forum } from "@/components/Forum";
import { TextField } from "@/components/TextField";
import { SubmitBtn } from "@/components/SubmitBtn";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">LOGIN</h1>
        <Forum
          request="POST /api/userProfile/login"
          onSuccess={({redirect})=>{redirect('/user/myProfile')}}

          fields={[
            {field:'email', placeholder:'email'},
            {field:'password', inputType:'password', placeholder:'password'}
          ]}
          below={
            <SubmitBtn
              text="Submit"
              styling="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            />
          }
        />
      </div>
    </div>
  );
}



