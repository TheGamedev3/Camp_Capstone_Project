
import { User } from "@Chemicals";
import { ValidateSession } from "@/lib/Validator";
import { attemptRequest } from "@MongooseSys";

export async function POST(req: Request) {
  return Response.json(await attemptRequest(async()=>{
    const { username, profile, email, password } = await req.json();
    const user = await User.create({ username, profile, email, password });
    const success = Boolean(user);

    // give the session cookie
    if(success)await ValidateSession(user._id);
    return{ success, result:user }; // ✅
  }));
}
