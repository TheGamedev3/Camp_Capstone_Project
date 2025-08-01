

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
    signup({ profile: string, username: string, email: string, password: string }): Promise<UserSchema>;
    login({ email: string, password: string}): Promise<UserSchema>;
    fetchUser( id:string ): Promise<UserSchema>;
    makeTestUser({ username: string, email: string, password: string }): Promise<UserSchema>;
    editProfile(userId: string, edits: Record<string, string>): Promise<UserSchema>;
}

import bcrypt from 'bcryptjs'; // or 'bcrypt'

export async function hashPassword(plain: string): Promise<string> {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plain, saltRounds);
  return hash;
}

export async function verifyPassword(attempt: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(attempt, hashed);
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
        async signup({ username, profile, email, password }: { profile: string, username: string, email: string, password: string }){
            if(password.length < 6){throw new Error(mongoErr('password', "Minimum password length is 6 characters").id)}
            return await User.create({
                username, profile,
                // ENCRYPT PASSWORD
                email, password: await hashPassword(password)
            });
        },
        async login({ email, password }: { email: string, password: string}){
            const user = await User.findOne({ email });
            if(!user){throw new Error(mongoErr('email', "invalid email!").id)}
            if(!(await verifyPassword(password, user.password))){throw new Error(mongoErr('password', "Incorrect password!").id)}
            return user;
        },
        async makeTestUser({ profile, username, email, password, created }: { profile: string, username: string, email: string, password: string, created: Date }) {
            return (this as Model<UserSchema>).create({
                profile, username,
                // ENCRYPT PASSWORD
                email, password: await hashPassword(password),
                created
            });
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
                if(!(await verifyPassword(oldPassword, user.password))){throw new Error(mongoErr('oldPassword', "Incorrect password!").id)}
                delete edits.oldPassword;

                // REENCRYPT IT
                if(edits.password.length < 6){throw new Error(mongoErr('password', "Minimum password length is 6 characters").id)}
                if(edits.password){edits.password = await hashPassword(edits.password)}
            }
            
            Object.assign(user, edits);
            return await user.save();
        }
    }
) as UserModel);




