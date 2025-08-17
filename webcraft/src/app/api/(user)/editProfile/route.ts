


import { User } from "@Chemicals";
import { getSession } from "@/lib/Validator";
import { attemptRequest } from "@MongooseSys";

export async function PATCH(req: Request) {
  return await attemptRequest(async()=>{
    const userId = (await getSession())?._id; if(!userId)return{ success:false, err:{server:"no session found!"}}

    const edits = await req.json();
    const user = await User.editProfile(userId, edits);

    return{ success:true, result:user }; // ✅
  });
}
