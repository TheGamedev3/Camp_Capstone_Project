
import { User } from "@Chemicals";
import { attemptRequest } from "@MongooseSys";

export async function GET(req: Request, { params }: {params: Promise<{ id: string }>;}) {
  return await attemptRequest(async () => {
      const profile = await User.fetchUserProfile((await params).id);
      if (profile) {
        return { success: true, result: profile };
      } else {
        return {
          success: false,
          result: null,
          err: { id: "player id not found" },
        };
      }
  });
}
