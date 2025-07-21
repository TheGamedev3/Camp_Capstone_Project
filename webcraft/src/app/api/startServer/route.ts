
// this is nessecary to start up the server because NextJS dynamically compiles routes only when they're invoked.
// this route is called by launchserver.mjs

import { StartServer } from "@/lib/models/StartUp";

export async function GET() {
  await StartServer();
  return Response.json({ status: 'started!' });
}
