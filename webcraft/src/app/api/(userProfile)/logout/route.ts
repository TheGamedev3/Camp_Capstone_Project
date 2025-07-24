


import { User } from "@Chemicals";
import { deleteSession } from "@/lib/Validator";

export async function POST(req: Request) {
  const success = await deleteSession();
  return Response.json({ success });
}
