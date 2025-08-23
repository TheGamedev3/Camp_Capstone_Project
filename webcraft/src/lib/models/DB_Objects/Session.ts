import { db_object, Types, Model } from "@MongooseSys";
import { User } from "./User";
import { ObjectId } from "mongoose";

export interface SessionSchema {
  _id: ObjectId;
  userId: ObjectId;
  sid: string;
  created: Date;
}

export interface SessionModel extends Model<SessionSchema> {
  fetchUser(sid: string): Promise<InstanceType<typeof User> | null>;
}

export const Session = (db_object<SessionSchema>(
  "Session",
  {
    userId: {
        type: ObjectId,
        required: true,
        ref: "User",
    },
    sid: {
        type: String,
        unique: [true, "sid already taken!"],
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24, // 24 hours in seconds
    }
  },
  {
    async fetchUser(sid: string) {
      const session = await (this as SessionModel).findOne({ sid });
      if (!session) return null;

      const user = await User.fetchUserProfile(session.userId);
      return user;
    }
  }
) as SessionModel);
