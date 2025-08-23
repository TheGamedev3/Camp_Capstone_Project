import { Trade, User } from "@Chemicals";
import { attemptRequest } from "@MongooseSys";

// (set by the server)
const PerPage = 5;

export async function GET(req: Request) {
  return await attemptRequest(async () => {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const sortStyle = searchParams.get("sortStyle") || "newest";
    const search = searchParams.get("search")?.trim();

    const sortGroup =
      sortStyle === "newest" ? { created: -1 } :
      sortStyle === "oldest" ? { created: 1 } :
      {};

    const skip = (page - 1) * PerPage;

    const pipeline: any[] = [
      // Join Trade.seller (ObjectId) -> User._id
      {
        $lookup: {
          from: User.collection.name,
          localField: "seller",
          foreignField: "_id",
          as: "sellerDoc",
        },
      },
      { $unwind: "$sellerDoc" },

      // Optional seller-username search
      ...(search
        ? [{ $match: { "sellerDoc.username": { $regex: search, $options: "i" } } }]
        : []),

      // Expose buy/sell and embed minimal seller info
      {
        $project: {
          _id: 1,
          buy: 1,
          sell: 1,
          created: 1, // keep if you have timestamps or a created field; otherwise remove
          seller: {
            _id: "$sellerDoc._id",
            username: "$sellerDoc.username",
          },
        },
      },

      Object.keys(sortGroup).length ? { $sort: sortGroup } : null,
      {
        $facet: {
          items: [{ $skip: skip }, { $limit: PerPage }],
          totalCount: [{ $count: "count" }],
        },
      },
    ].filter(Boolean);

    const agg = await Trade.aggregate(pipeline).exec();
    const items = agg[0]?.items ?? [];
    const totalCount = agg[0]?.totalCount?.[0]?.count ?? 0;
    const totalPages = Math.max(0, Math.ceil(totalCount / PerPage));

    return {
      success: true,
      result: {
        trades: items,
        page,
        totalPages,
      },
    };
  });
}
