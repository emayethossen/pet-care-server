import mongoose, { Schema } from 'mongoose';
import { IComment } from './comment.interface';

const CommentSchema: Schema = new Schema({
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    story: { type: Schema.Types.ObjectId, ref: 'PetStory', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IComment>('Comment', CommentSchema);
