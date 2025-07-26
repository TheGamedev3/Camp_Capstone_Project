
"use client";

import { Requester, SubmitBtn } from "@Req";
import { useSession } from "@/components/RootType/UserSession";
import { redirect } from "next/navigation";

import { EditArea, Editable, EditBtn, Forum, CustomProfile } from "@Req";

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

      <EditArea>
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">

          <Editable
            view={
              <>
                <CustomProfile url={user.profile}/>
                <EditBtn text="✏️"/>
              </>
            }
            edit={
              <>
                <Forum
                  clientValidation={({username, profile, email, password, retype_password, err})=>{
                    if(!profile)err('profile',"profile can't be blank!");
                    if(profile === user.profile)err('profile',"profile isn't changed!");
                  }}
                  request="PATCH /api/editProfile"
                  onSuccess={(newUser)=>updateUser(newUser)}
                  fields={[
                    {field:'profile', placeholder:'[change profile url!]', defaultText:user.profile, inputType:'image'},
                  ]}
                  below={
                    <SubmitBtn
                      text="Submit"
                      styling="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    />
                  }
                />
                <EditBtn text="Cancel?"/>
              </>
            }
          />

          <Editable
            view={
              <>
                <h1 className="text-black">{user.username}</h1> <EditBtn text="✏️"/>
              </>
            }
            edit={
              <>
                <Forum
                  clientValidation={({username, profile, email, password, retype_password, err})=>{
                    if(!username)err('username',"username can't be blank!");
                    if(username === user.username) err('username',"username isn't changed!");
                  }}
                  request="PATCH /api/editProfile"
                  onSuccess={(newUser)=>updateUser(newUser)}
                  fields={[
                    {field:'username', placeholder:'[change username!]', defaultText:user.username},
                  ]}
                  below={
                    <SubmitBtn
                      text="Submit"
                      styling="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    />
                  }
                />
                <EditBtn text="Cancel?"/>
              </>
            }
          />

          <Editable
            view={
              <>
                <h1 className="text-black">{user.email}</h1> <EditBtn text="✏️"/>
              </>
            }
            edit={
              <>
                <Forum
                  clientValidation={({username, profile, email, password, oldPassword, err})=>{
                    if(!email)err('email',"email can't be blank!");
                    if(!oldPassword)err('oldPassword',"retype your password!");
                    if(email === user.email) err('email',"email isn't changed!");
                  }}
                  request="PATCH /api/editProfile"
                  onSuccess={(newUser)=>updateUser(newUser)}
                  fields={[
                    {field:'email', placeholder:'[change email!]', defaultText:user.email},
                    {field:'oldPassword', placeholder:'[retype password...]', defaultText:'', inputType:'password'}
                  ]}
                  below={
                    <SubmitBtn
                      text="Submit"
                      styling="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    />
                  }
                />
                <EditBtn text="Cancel?"/>
              </>
            }
          />

          <Editable
            view={
              <>
                <EditBtn text="✏️ Change Password❔" />
              </>
            }
            edit={
              <>
                <Forum
                  clientValidation={({username, profile, email, password, oldPassword, err})=>{
                    if(!password)err('password',"new password can't be blank!");
                    if(!oldPassword)err('oldPassword',"retype your old password!");
                    if(password && oldPassword && (password === oldPassword)) err('password',"this matches your old password!");
                  }}
                  request="PATCH /api/editProfile"
                  onSuccess={(newUser)=>updateUser(newUser)}
                  fields={[
                    {field:'password', placeholder:'[new password]', defaultText:'', inputType:'password'},
                    {field:'oldPassword', placeholder:'[retype password...]', defaultText:'', inputType:'password'}
                  ]}
                  below={
                    <SubmitBtn
                      text="Submit"
                      styling="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    />
                  }
                />
                <EditBtn text="Cancel?"/>
              </>
            }
          />
        </div>
      </EditArea>
    </div>
  );
}
