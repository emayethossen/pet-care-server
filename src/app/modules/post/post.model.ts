import mongoose, { Schema } from 'mongoose';
import { IPetStory } from './post.interface';

const PetStorySchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: ['Tip', 'Story'], required: true },
    images: { type: [String], default: [] },
    isPremium: { type: Boolean, default: false }, // Premium content flag
    upvotes: { type: Number, default: 0 }, // Upvotes count
    downvotes: { type: Number, default: 0 }, // Downvotes count
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPetStory>('PetStory', PetStorySchema);
