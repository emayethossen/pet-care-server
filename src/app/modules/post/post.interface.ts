import { Document } from 'mongoose';

export interface IPetStory extends Document {
    title: string;
    content: string;
    author: string; // ObjectId referring to the User
    category: 'Tip' | 'Story';
    images: string[];
    createdAt: Date;
}
