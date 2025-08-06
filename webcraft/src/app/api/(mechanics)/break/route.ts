

import { NextResponse } from 'next/server';
import { breakAt } from '@/Gameplay/Routes/Break';

export async function DELETE(req: Request) {
  return NextResponse.json(await breakAt(await req.json()));
}
