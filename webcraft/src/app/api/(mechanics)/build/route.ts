

import { NextResponse } from 'next/server';
import { build } from '@/Gameplay/Routes/Build';

export async function POST(req: Request) {
  return NextResponse.json(await build(await req.json()));
}
