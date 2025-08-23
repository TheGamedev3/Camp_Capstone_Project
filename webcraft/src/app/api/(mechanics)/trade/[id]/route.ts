
import { Trade } from "@Chemicals";
import { attemptRequest } from "@MongooseSys";

export async function GET(req: Request, { params }: {params: Promise<{ id: string }>;}) {
  return await attemptRequest(async () => {
      const trade = await Trade.fetchTradeWithSeller((await params).id);
      if (trade) {
        return { success: true, result: trade };
      } else {
        return {
          success: false,
          result: null,
          err: { id: "trade id not found" },
        };
      }
  });
}
