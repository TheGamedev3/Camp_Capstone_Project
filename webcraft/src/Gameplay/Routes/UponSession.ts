import { NextResponse } from 'next/server';
import { attemptRequest } from '@MongooseSys';
import { getSession } from '@/lib/Validator';
import { PlaySession } from '../Simulator/PlaySession';

type SessionType = Awaited<ReturnType<typeof PlaySession.getPlaySession>>;

type FuncType = (session: SessionType, ...args: any) => Promise<any> | any;

type RequestHandler = (req: Request) => Promise<ReturnType<typeof attemptRequest>>;
type DirectHandler = (session: SessionType, ...args: any[]) => Promise<any>;

export function UnderSession(func: FuncType): RequestHandler & DirectHandler {
  // Case 1: Accept a full Request
  const handleRequest = async (req: Request) => {
    return await attemptRequest(async () => {
      const userId = (await getSession())?._id;
      if (!userId) return { success: false, err: { server: 'no session found!' } };

      const session = await PlaySession.getPlaySession(userId);
      const args = await req.json();
      return NextResponse.json(await func(session, args));
    });
  };

  // Case 2: Accept a preloaded session directly
  const handleDirect = async (session: SessionType, ...args: any[]) => {
    return await func(session, ...args);
  };

  // Combined function that smartly dispatches
  const hybridHandler = ((...args: [Request] | [SessionType, any[]]) => {
    if (args.length === 1 && args[0] instanceof Request) {
      return handleRequest(args[0]);
    } else if (args.length === 2) {
      return handleDirect(args[0] as SessionType, ...args);
    } else {
      throw new Error('Invalid arguments passed to UnderSession');
    }
  }) as RequestHandler & DirectHandler;

  return hybridHandler;
}
