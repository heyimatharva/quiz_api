import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    username: string;
    password: string;
    name: string;
    user_type: string;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        user_type: { type: String, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);


export default mongoose.model<IUserModel>("User", UserSchema);