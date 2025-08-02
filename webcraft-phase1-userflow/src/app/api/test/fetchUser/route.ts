


import { User } from "@Chemicals";

export async function GET() {
  const result = await User.fetchUser(
    '687c996a693efbab0e705dfc'
  );
  return Response.json({ result });
}
