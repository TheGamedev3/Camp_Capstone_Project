


import { User } from "@Chemicals";
import { ValidateSession } from "@/lib/Validator";
import { attemptRequest } from "@MongooseSys";

export async function POST(req: Request) {
  return Response.json(await attemptRequest(async()=>{
    const{email, password} = await req.json();
    const user = await User.findOne({ email });
    // DONT FORGET TO HASH THE PASSWORD LATER
    if(!user)return{ success:false, err:{email:'invalid email!'} };

    if(user?.password === password){

      // give the session cookie
      await ValidateSession(user._id);

      return{ success:true, result:user }; // ✅
    }
    else{return{success:false, err:{password:'incorrect password!'}}}
  }));
}
