

import { db_object, Model } from "@MongooseSys";
import { Types, ObjectId } from "mongoose";
import { User } from "@Chemicals";

export interface TradeSchema {
  _id: ObjectId;
  buy: string;
  sell: string;
  seller: ObjectId;
}

interface TradeModel extends Model<TradeSchema>{
    // add optional functions here if any
    fetchTrade: Promise<TradeSchema>
}

export const Trade = (db_object<TradeSchema>(
    'Trade',
    {
        buy: {
            type: String,
            required: true,
        },
        sell: {
            type: String,
            required: true,
        },
        seller: {
            type: ObjectId,
            required: true,
            ref: "User",
        },
        created: {
            type: Date,
            default: Date.now
        },
        exchanged: {
            type: Boolean,
            default: false
        },
    },
    {
        // add optional functions here if any
        async fetchTrade(id: string){
            return await (this as Model<TradeSchema>).findOne({ _id:id });
        },
        async fetchTradeWithSeller(id: string) {
            if (!Types.ObjectId.isValid(id)) return null;

            const [doc] = await (this as Model<TradeSchema>)
                .aggregate<TradeWithSeller>([
                { $match: { _id: new Types.ObjectId(id) } },
                {
                    $lookup: {
                    from: User.collection.name, // users collection
                    localField: "seller",
                    foreignField: "_id",
                    as: "sellerDoc",
                    },
                },
                { $unwind: "$sellerDoc" }, // require a matching seller
                {
                    $project: {
                    _id: 1,
                    buy: 1,
                    sell: 1,
                    exchanged: 1,
                    created: 1,
                    seller: {
                        _id: "$sellerDoc._id",
                        username: "$sellerDoc.username",
                    },
                    },
                },
                { $limit: 1 },
                ])
                .exec();

            return doc ?? null;
        }
    }
) as TradeModel);




