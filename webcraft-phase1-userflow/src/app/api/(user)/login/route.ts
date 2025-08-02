


import { User } from "@Chemicals";
import { ValidateSession } from "@/lib/Validator";
import { attemptRequest } from "@MongooseSys";

export async function POST(req: Request) {
  return Response.json(await attemptRequest(async()=>{
    const{email, password} = await req.json();
    const user = await User.login({ email, password });
    if(!user){return{success:false, err:{server:'failed to fetch user'}}}

    // give the session cookie
    await ValidateSession(user._id);

    return{ success:true, result:user }; // ✅
  }));
}
