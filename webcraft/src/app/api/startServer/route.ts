// /app/api/startup/route.ts
import { StartServer } from "@/lib/models/StartUp";

export async function GET() {
  await StartServer(); // triggers db connect once
  return Response.json({ status: 'started!' });
}
