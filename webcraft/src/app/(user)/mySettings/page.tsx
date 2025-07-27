"use client";

import { useSession } from "@/components/RootType/UserSession";
import { redirect } from "next/navigation";

import {
  Requester,
  SubmitBtn,
  EditArea,
  Editable,
  EditBtn,
  Forum,
  CustomProfile,
} from "@Req";

export default function MySettings() {
  const { user, updateUser } = useSession();
  if (!user) return redirect("/login");

  return (
    <div className="p-8">
      <EditArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT COLUMN: Profile Picture */}
          <div className="bg-white p-6 rounded shadow flex flex-col items-center gap-4">
            <Editable
              view={
                <div className="flex flex-col items-center gap-2">
                  <CustomProfile url={user.profile} />
                  <EditBtn
                    text="✏️ Edit Profile Image"
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded"
                  />
                </div>
              }
              edit={
                <>
                  <Forum
                    clientValidation={({ profile, err }) => {
                      if (!profile)
                        err("profile", "profile URL can't be blank!");
                      if (profile === user.profile)
                        err("profile", "profile isn't changed!");
                    }}
                    request="PATCH /api/editProfile"
                    onSuccess={(newUser) => updateUser(newUser)}
                    fields={[
                      {
                        label: 'Edit Profile URL:', 
                        field: "profile",
                        placeholder: "[change profile url!]",
                        defaultText: user.profile,
                        inputType: "image",
                      },
                    ]}
                    below={
                      <SubmitBtn
                        text="Submit"
                        styling="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      />
                    }
                  />
                  <EditBtn
                    text="Cancel"
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  />
                </>
              }
            />
          </div>

          {/* RIGHT COLUMN: Username, Email, Password */}
          <div className="flex flex-col gap-4">
            {/* USERNAME */}
            <div className="bg-white p-4 rounded shadow flex flex-col gap-2">
              <Editable
                view={
                  <div className="flex items-center justify-between">
                    <span className="text-black text-lg font-medium">
                      {user.username}
                    </span>
                    <EditBtn
                      text="✏️"
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                    />
                  </div>
                }
                edit={
                  <>
                    <Forum
                      clientValidation={({ username, err }) => {
                        if (!username)
                          err("username", "username can't be blank!");
                        if (username === user.username)
                          err("username", "username isn't changed!");
                      }}
                      request="PATCH /api/editProfile"
                      onSuccess={(newUser) => updateUser(newUser)}
                      fields={[
                        {
                          label: 'Edit Username:', 
                          field: "username",
                          placeholder: "[change username!]",
                          defaultText: user.username,
                        },
                      ]}
                      below={
                        <SubmitBtn
                          text="Submit"
                          styling="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        />
                      }
                    />
                    <EditBtn
                      text="Cancel"
                      className="bg-red-500 text-white px-4 py-1 rounded"
                    />
                  </>
                }
              />
            </div>

            {/* EMAIL */}
            <div className="bg-white p-4 rounded shadow flex flex-col gap-2">
              <Editable
                view={
                  <div className="flex items-center justify-between">
                    <span className="text-black text-lg font-medium">
                      {user.email}
                    </span>
                    <EditBtn
                      text="✏️"
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                    />
                  </div>
                }
                edit={
                  <>
                    <Forum
                      clientValidation={({ email, oldPassword, err }) => {
                        if (!email) err("email", "email can't be blank!");
                        if (!oldPassword)
                          err("oldPassword", "retype your password!");
                        if (email === user.email)
                          err("email", "email isn't changed!");
                      }}
                      request="PATCH /api/editProfile"
                      onSuccess={(newUser) => updateUser(newUser)}
                      fields={[
                        {
                          label: 'Change Email:', 
                          field: "email",
                          placeholder: "[change email!]",
                          defaultText: user.email,
                        },
                        {
                          label: 'Password:', 
                          field: "oldPassword",
                          placeholder: "[retype password...]",
                          defaultText: "",
                          inputType: "password",
                        },
                      ]}
                      below={
                        <SubmitBtn
                          text="Submit"
                          styling="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        />
                      }
                    />
                    <EditBtn
                      text="Cancel"
                      className="bg-red-500 text-white px-4 py-1 rounded"
                    />
                  </>
                }
              />
            </div>

            {/* PASSWORD */}
            <div className="bg-white p-4 rounded shadow flex flex-col gap-2">
              <Editable
                view={
                  <EditBtn
                    text="✏️ Change Password"
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                  />
                }
                edit={
                  <>
                    <Forum
                      clientValidation={({ password, oldPassword, err }) => {
                        if (!password)
                          err("password", "new password can't be blank!");
                        if (!oldPassword)
                          err("oldPassword", "retype your old password!");
                        if (password && oldPassword && password === oldPassword)
                          err("password", "this matches your old password!");
                      }}
                      request="PATCH /api/editProfile"
                      onSuccess={(newUser) => updateUser(newUser)}
                      fields={[
                        {
                          label: 'New Password:', 
                          field: "password",
                          placeholder: "[new password]",
                          defaultText: "",
                          inputType: "password",
                        },
                        {
                          label: 'Password:', 
                          field: "oldPassword",
                          placeholder: "[retype old password...]",
                          defaultText: "",
                          inputType: "password",
                        },
                      ]}
                      below={
                        <SubmitBtn
                          text="Submit"
                          styling="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        />
                      }
                    />
                    <EditBtn
                      text="Cancel"
                      className="bg-red-500 text-white px-4 py-1 rounded"
                    />
                  </>
                }
              />
            </div>
          </div>
        </div>
      </EditArea>

      {/* LOGOUT BUTTON */}
      <div className="mt-6">
        <Requester request="POST /api/logout" goTo="/login">
          <SubmitBtn
            text="Logout"
            styling="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          />
        </Requester>
      </div>
    </div>
  );
}
