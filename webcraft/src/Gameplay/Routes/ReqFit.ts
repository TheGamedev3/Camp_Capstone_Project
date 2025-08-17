import { attemptRequest } from "@MongooseSys";
import { getSession } from "@/lib/Validator";
import { PlaySession } from "../Simulator/PlaySession";

type SessionType = NonNullable<Awaited<ReturnType<typeof PlaySession.getPlaySession>>>;

type AttemptReturn = ReturnType<typeof attemptRequest>; // keeps your API type

// The user function you write takes a payload P + session + origin
export type ReqFitFn<P extends object, R> = (
  ctx: P & { session: SessionType; origin: "api" | "direct" }
) => R;

export function ReqFit<P extends object = Record<string, unknown>, R = unknown>(
  fn: ReqFitFn<P, R>
) {
  // ---- API handler ----
  async function reqHandler(req: Request): Promise<AttemptReturn> {
    return attemptRequest(async () => {
      const userId = (await getSession())?._id;
      if (!userId) {
        // Keep the shape your attemptRequest expects
        // (If attemptRequest wants you to throw to mark failure, do that instead.)
        return { success: false, err: { server: "no session found!" } } as any;
      }

      const session = await PlaySession.getPlaySession(userId);
      if (!session) {
        return { success: false, err: { server: "no play session found!" } } as any;
      }

      let body: unknown = undefined;
      try { body = await req.json(); } catch {/* no/invalid JSON is fine */}

      // Accept only object bodies as payload; anything else becomes empty object
      const payload: P =
        (body && typeof body === "object" && !Array.isArray(body) ? (body as P) : ({} as P));

      const result = await fn({ ...payload, session, origin: "api" });
      return result as any; // attemptRequest will wrap it
    });
  }

  // ---- Direct call (already have session) ----
  function call(payload: P & { session: SessionType }): R {
    return fn({ ...payload, origin: "direct" });
  }

  call.req = reqHandler;
  return call;
}
