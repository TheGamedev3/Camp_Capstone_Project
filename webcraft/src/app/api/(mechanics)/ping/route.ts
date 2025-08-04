

import { NextResponse } from 'next/server';
import { ping } from '@/Gameplay/Simulator/PingRoute';

export async function GET(req: Request) {
  return NextResponse.json(await ping());
}
