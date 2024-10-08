import mongoose, { Document } from 'mongoose';

export interface IPetStory extends Document {
    title: string;
    content: string;
    author: string; // ObjectId referring to the User
    category: 'Tip' | 'Story';
    coverImage: string;
    isPremium?: boolean; // For monetization
    upvotes: number; // To store upvotes
    downvotes: number;
    comments: mongoose.Types.ObjectId[];
    createdAt: Date;
}