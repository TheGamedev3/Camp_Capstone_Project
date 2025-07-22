
import { User } from "@Chemicals";
import { ValidateSession } from "@/lib/Validator";

export async function POST(req: Request) {
  const { username, profile, email, password } = await req.json();

  try {
    const user = await User.create({ username, profile, email, password });
    const success = Boolean(user);

    // give the session cookie
    if(success)await ValidateSession(user._id);
    
    return Response.json({ success, result:user }); // ✅
  } catch (err: any) {
    const message = err.message?.toLowerCase?.() || "";
    const errObject: Record<string, string> = {};

    if (message.includes("username")) errObject.username = err.message;
    if (message.includes("email")) errObject.email = err.message;
    if (message.includes("password")) errObject.password = err.message;

    return Response.json({ success: false, err: errObject });
  }
}
