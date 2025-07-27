
"use client"

import { Forum, SubmitBtn } from "@Req";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">SIGNUP</h1>
        <Forum
          clientValidation={({username, profile, email, password, retype_password, err})=>{
            if(!username) err('username',"username can't be blank!");
            if(!profile) err('profile',"profile can't be blank!");
            if(!email) err('email',"email can't be blank!");
            if(!password) err('password',"password can't be blank!");
            if(password !== retype_password) err('retype_password', "password doesn't match!");
          }}
          request="POST /api/signup"
          body={({username, profile, email, password})=>{
            return{username, profile, email, password}
          }}
          goTo='/myProfile'
          
          fields={[
            {label: 'Username:', field:'username', placeholder:'username'},
            {label: 'Profile URL:', field:'profile', placeholder:'[paste profileURL image here]', defaultText:'https://th.bing.com/th/id/R.eba7a5674add29aeb5265590c3c1bb5e?rik=cBys5futD%2fdkQQ&pid=ImgRaw&r=0', inputType:'image'},
            {label: 'Email:', field:'email', placeholder:'email'},
            {label: 'Password:', field:'password', inputType:'password', placeholder:'password'},
            {label: 'Retype Password:', field:'retype_password', inputType:'password', placeholder:'[retype password]'}
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
