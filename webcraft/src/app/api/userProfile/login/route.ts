



import { User } from "@Chemicals";

export async function POST(req: Request) {
  const{email, password} = await req.json();
  console.log("POSTING LOGIN",email,password)
  const result = await User.findOne({ email });
  // DONT FORGET TO HASH THE PASSWORD LATER
  if(!result)return Response.json({ success:false, err:{email:'invalid email!'} });

  if(result?.password === password){return Response.json({ success:true, result })}
  else{return Response.json({ success:false, err:{password:'incorrect password!'} })}

}
