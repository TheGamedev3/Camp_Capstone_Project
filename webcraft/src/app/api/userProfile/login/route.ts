


import { User } from "@Chemicals";
import { ValidateSession } from "@/lib/Validator";

export async function POST(req: Request) {
  const{email, password} = await req.json();
  try {
    const user = await User.findOne({ email });
    // DONT FORGET TO HASH THE PASSWORD LATER
    if(!user)return Response.json({ success:false, err:{email:'invalid email!'} });

    if(user?.password === password){

      // give the session cookie
      await ValidateSession(user._id);

      return Response.json({ success:true, result:user }); // ✅
    }
    else{return Response.json({ success:false, err:{password:'incorrect password!'} })}

  } catch (err: any) {
    const message = err.message?.toLowerCase?.() || "";
    const errObject: Record<string, string> = {};

    if (message.includes("email")) errObject.email = err.message;
    if (message.includes("password")) errObject.password = err.message;

    return Response.json({ success: false, err: errObject });
  }

}
