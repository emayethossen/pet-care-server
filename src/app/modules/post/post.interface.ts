import mongoose, { Document } from 'mongoose';

export interface IPetStory extends Document {
    title: string;
    content: string;
    author: string; // ObjectId referring to the User
    category: 'Tip' | 'Story';
    images: string[];
    isPremium?: boolean; // For monetization
    upvotes: number; // To store upvotes
    downvotes: number;
    comments: mongoose.Types.ObjectId[]; // To store downvotes
    // comments: string[]; // Array of Comment ObjectIds
    createdAt: Date;
}
