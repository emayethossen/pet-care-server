import { Document } from 'mongoose';

export interface IComment extends Document {
    content: string;
    author: string; // ObjectId referring to the User
    story: string; // ObjectId referring to the PetStory
    createdAt: Date;
}
