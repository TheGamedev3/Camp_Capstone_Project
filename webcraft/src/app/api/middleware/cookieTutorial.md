


🍪 5. Setting session cookies (from an API route)




// app/api/userProfile/login/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const user = await verifyLogin(data.email, data.password);

  if (!user) return NextResponse.json({ error: 'Invalid' }, { status: 401 });

  const res = NextResponse.json({ message: `Welcome ${user.username}` });
  res.cookies.set('sessionToken', user.token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return res;
}



✅ 6. Reading the cookie inside API routes



import { cookies } from 'next/headers';

export async function GET() {
  const session = cookies().get('sessionToken')?.value;
  if (!session) return NextResponse.json({ error: 'Not logged in' });
}




🧼 7. Logging out


// app/api/userProfile/logout/route.ts
export async function POST() {
  const res = NextResponse.json({ message: 'Logged out' });
  res.cookies.set('sessionToken', '', { maxAge: 0 });
  return res;
}
