

import { db_object, Types, Model, mongoErr } from "@MongooseSys";
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
    editProfile(userId: string, edits: Record<string, string>): Promise<UserSchema>;
}

export const User = (db_object<UserSchema>(
    'User',
    {
        username: {
            type: String,
            required: [true, mongoErr('username', "Username can't be blank!").id],
            unique: false
        },
        email: {
            type: String,
            required: [true, mongoErr('email', "Please enter an email").id],
            unique: [true, mongoErr('email', "Email already taken!").id],
            lowercase: true,
            validate: [isEmail, mongoErr('email', "Please enter a valid email").id]
        },
        password: {
            type: String,
            required: [true, mongoErr('password', "Please enter a password").id],
            minlength: [6, mongoErr('password', "Minimum password length is 6 characters").id],
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
        async makeTestUser({ profile, username, email, password, created }: { profile: string, username: string, email: string, password: string, created: Date }) {
            return (this as Model<UserSchema>).create({ profile, username, email, password, created });
        },
        async verifyPassword(userId, password){

        },
        async editProfile(userId, edits){
            const user = await this.findOne({ _id: userId });
            if(!user){throw new Error('User does not exist')}

            const cantModify = ['_id'];
            const keys = Object.keys(edits);
            const notAllowed = cantModify.filter(item=>keys.includes(item));
            if(notAllowed.length > 0){throw new Error(`Attempted to modify: ${notAllowed.join(', ')} under User!`)}
            
            // *when changing the email or password, the old password is required!
            if(edits.password !== undefined || edits.email !== undefined){
                const oldPassword = edits.oldPassword;
                if(!oldPassword){throw new Error(mongoErr('oldPassword', "Password required!").id)}
                if(user.password !== oldPassword){throw new Error(mongoErr('oldPassword', "Incorrect password!").id)}
                delete edits.oldPassword;
                if(edits.password){}// REENCRYPT IT
            }
            
            Object.assign(user, edits);
            return await user.save();
        }
    }
) as UserModel);




