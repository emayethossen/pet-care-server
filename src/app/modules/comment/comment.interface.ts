import { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface IComment extends Document {
    content: string;
    author: mongoose.Types.ObjectId; // Change this to ObjectId
    story: mongoose.Types.ObjectId; // Change this to ObjectId
    createdAt: Date;
}
