


// PLACEHOLDER! UNFINISHED!

// /app/api/obtain/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  // do something with body
  return NextResponse.json({ message: 'Obtained!', added: 5 });
}

/*

Make a script elsewhere
mongoose trade
extract the elements out of the inventory

issue: TARGETING CERTAIN UNSTACKABLE TOOLS? (invisible? slotId? add on? hidden?)

craft two wrenches
at different durabilities
try to add them in differently
using slot id when its clicked specifically
or just selecting the first wrench if its wrench (1) or just wrench

requires the add and subtract behavior
click inventory slots to add it in
click buy slot to subtract it out
that somehow changes the string quantity?i
mega state machine....
-requires slots to be clickable or given a click context, similar to tool equiping?
-slot displays to be augmented or something, like subtracting items from one side, and accounting for negative number quantities?
-and adding the delta thing as part of the item

*/
