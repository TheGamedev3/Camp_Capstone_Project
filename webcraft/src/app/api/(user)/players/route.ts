
import { User, Session } from "@Chemicals";
import { FilterQuery, Types } from "mongoose";
import { attemptRequest } from "@MongooseSys";
import { FilterQuery } from "mongoose";
import { UserSchema } from "@Chemicals";

// (set by the server)
const PerPage = 3;

// (uses params instead of body args, so the sort info will be visible at the top of the pagnator page and easily sent to the request route)
export async function GET(req: Request) {
  return await attemptRequest(async () => {
    
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const sortStyle = searchParams.get("sortStyle") || "newest";
    const onlineOnly = searchParams.get("onlineOnly") === "true";
    const search = searchParams.get("search")?.trim();

    let userFilter: FilterQuery<UserSchema> = {};

    if (onlineOnly) {
      const sessionDocs = await Session.find({}, { userId: 1 });
      const onlineUserIds = sessionDocs.map((s) => new Types.ObjectId(s.userId));
      userFilter._id = { $in: onlineUserIds };
    }

    if (search) {
      userFilter.username = { $regex: search, $options: "i" }; // case-insensitive
    }

    const sortGroup = (() => {
      switch (sortStyle) {
        case "newest": return { created: -1 };
        case "oldest": return { created: 1 };
        case "A-Z": return { username: 1 };
        case "Z-A": return { username: -1 };
        // optionally sort players by level if that ever gets created
        default: return {};
      }
    })();

    const totalCount = await User.countDocuments(userFilter);
    const totalPages = Math.max(0, Math.ceil(totalCount / PerPage));

    let users = [];
    if(totalCount === 0){
      users = [];
    }else{
      const skip = (page-1) * PerPage;

      users = await User.find(userFilter)
        .sort(sortGroup)
        .skip(skip)
        .limit(PerPage)
        .select("username profile created") // dont expose email or password to outsiders!
        .lean();
    }

    return{
      success:true,
      result:{
        players:users,
        page, totalPages
      }
    };
  });
}
