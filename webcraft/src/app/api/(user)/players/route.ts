import { User, Session } from "@Chemicals";
import { attemptRequest } from "@MongooseSys";

// (set by the server)
const PerPage = 3;

export async function GET(req: Request) {
  return await attemptRequest(async () => {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const sortStyle = searchParams.get("sortStyle") || "newest";
    const onlineOnly = searchParams.get("onlineOnly") === "true";
    const search = searchParams.get("search")?.trim();

    const skip = (page - 1) * PerPage;

    // Build the top-level $match from query params
    const topMatch: Record<string, any> = {};
    if (search) {
      topMatch.username = { $regex: search, $options: "i" };
    }

    // Build the sort
    const sortGroup =
      sortStyle === "newest" ? { created: -1 } :
      sortStyle === "oldest" ? { created: 1 } :
      sortStyle === "A-Z"   ? { username: 1 } :
      sortStyle === "Z-A"   ? { username: -1 } :
      {};

    // Online filter via $lookup to Session:
    // If Session.userId is stored as a STRING of the user's ObjectId, we compare to toString($_id).
    // If it's stored as an ObjectId, swap to the commented pipeline below (no $toString).
    const onlineLookupStage = {
      $lookup: {
        from: Session.collection.name,
        let: { uid: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                // STRING userId in Session:
                $eq: ["$userId", { $toString: "$$uid" }],
                // If Session.userId is ObjectId instead, use:
                // $eq: ["$userId", "$$uid"],
              },
            },
          },
          { $limit: 1 }, // presence-check only
        ],
        as: "onlineSessions",
      },
    } as const;

    const pipeline: any[] = [
      Object.keys(topMatch).length ? { $match: topMatch } : null,

      // If onlineOnly=true, lookup sessions and require at least one
      ...(onlineOnly ? [onlineLookupStage, { $match: { $expr: { $gt: [{ $size: "$onlineSessions" }, 0] } } }] : []),

      // Stable sort BEFORE facet so both items and count share the same ordering basis
      Object.keys(sortGroup).length ? { $sort: sortGroup } : null,

      {
        $facet: {
          items: [
            { $skip: skip },
            { $limit: PerPage },
            {
              $project: {
                _id: 1,
                username: 1,
                profile: 1,
                created: 1,
                // if you want to expose "online" in the item rows, uncomment:
                // online: { $gt: [{ $size: "$onlineSessions" }, 0] },
              },
            },
          ],
          totalCount: [
            { $count: "count" },
          ],
        },
      },
    ].filter(Boolean);

    const agg = await User.aggregate(pipeline).exec();
    const items = agg[0]?.items ?? [];
    const countDoc = agg[0]?.totalCount?.[0];
    const totalCount = countDoc ? countDoc.count : 0;
    const totalPages = Math.max(0, Math.ceil(totalCount / PerPage));

    return {
      success: true,
      result: {
        players: items,
        page,
        totalPages,
      },
    };
  });
}
