import { NextResponse } from "next/server";
import { attemptRequest } from "@MongooseSys";
import { getSession } from "@/lib/Validator";
import { PlaySession } from "../Simulator/PlaySession";

type SessionType = Awaited<ReturnType<typeof PlaySession.getPlaySession>>;

// Func can be used from API (clientSide=true) or direct (clientSide=false)
type FuncType<R = unknown> = (
  session: SessionType,
  clientSide: boolean,
  ...args: any[]
) => Promise<R> | R;

type RequestHandler<R> = (req: Request) => Promise<ReturnType<typeof attemptRequest>>;
type DirectHandler<R> = (session: SessionType, ...args: any[]) => Promise<R> | R;

export function UnderSession<R = unknown>(
  func: FuncType<R>
): RequestHandler<R> & DirectHandler<R> {
  // --- Case 1: Accept a full Request (API route) -----------------------
  async function handleRequest(req: Request) {
    return attemptRequest(async () => {
      const userId = (await getSession())?._id;
      if (!userId) return { success: false, err: { server: "no session found!" } };

      const session = await PlaySession.getPlaySession(userId);

      // Parse JSON body; spread arrays, single-arg for non-arrays
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        body = undefined; // no/invalid JSON
      }

      const callArgs = Array.isArray(body)
        ? (body as any[])
        : body !== undefined
        ? [body]
        : [];

      const result = await func(session, true, ...callArgs);
      return NextResponse.json(result);
    });
  }

  // --- Case 2: Accept a preloaded session directly ---------------------
  async function handleDirect(session: SessionType, ...args: any[]) {
    return func(session, false, ...args);
  }

  // --- Overloaded hybrid dispatcher (nice typing) ----------------------
  function hybrid(req: Request): Promise<ReturnType<typeof attemptRequest>>;
  function hybrid(session: SessionType, ...args: any[]): Promise<R> | R;
  function hybrid(...args: any[]) {
    // NOTE: `instanceof Request` is safe in Next.js runtime for API routes.
    if (args.length === 1 && args[0] instanceof Request) {
      return handleRequest(args[0]);
    }
    const [session, ...rest] = args as [SessionType, ...any[]];
    return handleDirect(session, ...rest);
  }

  return hybrid as RequestHandler<R> & DirectHandler<R>;
}
