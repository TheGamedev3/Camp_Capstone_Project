


import { User } from "@Chemicals";

export async function GET() {
  const result = await User.makeTestUser({
      username:'Steve',
      email:'Steven@gmail.com',
      password:'12345678'
  });
  return Response.json({ result });
}
