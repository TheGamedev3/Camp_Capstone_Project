

import { NextResponse } from 'next/server';
import { ping } from '@/Gameplay/Routes/Ping';

export async function GET(req: Request) {
  return NextResponse.json(await ping());
}
