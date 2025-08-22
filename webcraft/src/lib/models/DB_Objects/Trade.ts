

import { db_object, Model } from "@MongooseSys";
import { ObjectId } from "mongoose";

interface TradeSchema {
  _id: ObjectId;
  buy: string;
  sell: string;
  seller: ObjectId;
}

interface TradeModel extends Model<TradeSchema>{
    // add optional functions here if any
    temp?:string
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
        }
    },
    {}
) as TradeModel);




