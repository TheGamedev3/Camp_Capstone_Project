

import { db_object, Types, Model } from "@MongooseSys";
import { isEmail } from "validator";

interface UserSchema {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profile?: string;
  created: Date;
}

interface UserModel extends Model<UserSchema>{
    fetchUser( id:string ): Promise<UserSchema>;
    makeTestUser({ username: string, email: string, password: string }): Promise<UserSchema>;
}

export const User = (db_object<UserSchema>(
    'User',
    {
        username: {
            type: String,
            required: [true, "Username can't be blank!"],
            unique: false
        },
        email: {
            type: String,
            required: [true, 'Please enter an email'],
            unique: [true, 'Email already taken!'],
            lowercase: true,
            validate: [isEmail, 'Please enter a valid email']
        },
        password: {
            type: String,
            required: [true, 'Please enter a password'],
            minlength: [6, 'Minimum password length is 6 characters'],
        },
        profile: {
            type: String,
            required: false
        },
        created: {
            type: Date,
            default: Date.now
        }
    },
    {
        async fetchUser(id: string){
            return await (this as Model<UserSchema>).findOne({ _id:id });
        },
        async makeTestUser({ username, email, password }: { username: string, email: string, password: string }) {
            return (this as Model<UserSchema>).create({ username, email, password });
        }
    }
) as UserModel);




