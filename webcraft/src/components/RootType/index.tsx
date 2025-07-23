
/*

Anything under this RootType folder, will be added at the top and activated at every page request/refresh
Like obtaining the user session on start
These are primarily on the server side, before the page gets sent to the client

This element is added in at "app/layout.tsx"

*/

import { UserSession } from "./UserSession";
import { getSession } from "@/lib/Validator";

export async function Root({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <UserSession session={session}>
        {children}
    </UserSession>
  );
}
