

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
            required: [true, mongoErr('username', "Username can't be blank!")],
            unique: false
        },
        email: {
            type: String,
            required: [true, mongoErr('email', "Please enter an email")],
            unique: [true, mongoErr('email', "Email already taken!")],
            lowercase: true,
            validate: [isEmail, mongoErr('email', "Please enter a valid email")]
        },
        password: {
            type: String,
            required: [true, mongoErr('password', "Please enter a password")],
            minlength: [6, mongoErr('password', "Minimum password length is 6 characters")],
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
        },
        async editProfile(userId, edits){
            const user = await this.findOne({ _id: userId });
            if(!user){throw new Error('User does not exist')}
            //if(!user)throw new FieldError('userId', 'User does not exist');

            const cantModify = ['_id'];
            const keys = Object.keys(edits);
            const notAllowed = cantModify.filter(item=>keys.includes(item));
            //if(notAllowed.length > 0)throw new FieldError(edits, `Attempted to modify: ${notAllowed.join(', ')} under User!`);
            if(notAllowed.length > 0){throw new Error(`Attempted to modify: ${notAllowed.join(', ')} under User!`)}
            /*
            if(edits.password !== undefined || edits.email !== undefined){
                const oldPassword = edits.oldPassword;
                if(oldPassword === undefined)throw new FieldError('oldPassword', 'must retype old password to change email or password!');
                const auth = await bcrypt.compare(oldPassword, user.password);
                if(!auth)throw new FieldError('oldPassword', 'incorrect old password!');
                delete edits.oldPassword;

                if(edits.password){
                    edits.password = await this.processPassword(edits.password);
                }
            }*/
            
            Object.assign(user, edits);
            return await user.save();
        }
    }
) as UserModel);




