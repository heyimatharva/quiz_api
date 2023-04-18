import mongoose, { Document, Schema } from 'mongoose';
import { IUserModel } from './User';

export interface IQuiz {
    name: string;
    description: string;
    datetime: string;
    user: IUserModel["_id"];
}

export interface IQuizModel extends IQuiz, Document {}

const QuizSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: false },
        datetime: { type: Date, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
        versionKey: false
    }
);


export default mongoose.model<IQuizModel>("Quiz", QuizSchema);