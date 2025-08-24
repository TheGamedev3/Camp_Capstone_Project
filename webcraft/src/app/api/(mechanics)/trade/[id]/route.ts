
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


import { HandleTrade, Cancel } from "@/Gameplay/Trades/TradeRequests";
// PATCH (claim, exchange)
export async function PATCH(req: Request, { params }: {params: Promise<{ id: string }>;}) {
  return await HandleTrade.req(req, {tradeId: (await params).id});
}

// DELETE (cancel)
export async function DELETE(req: Request, { params }: {params: Promise<{ id: string }>;}) {
  return await Cancel.req(req, {tradeId: (await params).id});
}