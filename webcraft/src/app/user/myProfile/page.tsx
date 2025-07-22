

import { getSession } from "@/lib/Validator";
import { redirect } from "next/navigation";

export default async function myProfile() {
  const user = await getSession();

  if (!user) {
    redirect("/user/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome, {user.username} 👋</h1>
      <p>Your email is: {user.email}</p>
    </div>
  );
}
