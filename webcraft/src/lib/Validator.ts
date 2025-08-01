
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { Session } from "@Chemicals";
import { ObjectId } from "mongoose";

export async function ValidateSession(userId: ObjectId) {
    const cookieStore = await cookies();
    let sid = cookieStore.get("sid")?.value;
    let sessionData;

    // session already exists!
    if(sid)sessionData = await Session.fetchUser({ sid });

    // EDGE CASE: Check if the userId attempting to be validated is different! then override!

    // create a session
    if(!sessionData){
        do {
            sid = randomUUID();
        try {
            sessionData = await Session.create({ sid, created: Date.now(), userId });
            cookieStore.set("sid", sid, {
                path: "/",
                httpOnly: true,
                sameSite: "lax",
                maxAge: 60 * 60 * 24, // 24 hrs
            });
        } catch (err) {
            if (!err.code === 11000) throw err; // not a duplicate error
        }
        } while (!sessionData);
    }

    return sessionData;
}

export async function getSession() {
    const cookieStore = await cookies();
    let sid = cookieStore.get("sid")?.value;
    if(!sid)return null;
    return await Session.fetchUser(sid);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const sid = cookieStore.get("sid")?.value;
  if (!sid) return false;

  // Remove session from DB
  await Session.deleteOne({ sid });

  // Clear the cookie
  cookieStore.set("sid", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0, // ← expire immediately
  });
  return true;
}
