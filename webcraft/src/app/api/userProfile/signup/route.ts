import { User } from "@Chemicals";

export async function POST(req: Request) {
  const { username, profile, email, password } = await req.json();
  console.log("POSTING LOGIN", email, password);

  try {
    const result = await User.create({ username, profile, email, password });
    return Response.json({ success: Boolean(result), result });
  } catch (err: any) {
    const message = err.message?.toLowerCase?.() || "";
    const errObject: Record<string, string> = {};

    if (message.includes("username")) errObject.username = err.message;
    if (message.includes("email")) errObject.email = err.message;
    if (message.includes("password")) errObject.password = err.message;

    return Response.json({ success: false, err: errObject });
  }
}
