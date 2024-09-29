import mongoose, { Schema } from 'mongoose';
import { IPetStory } from './post.interface';

const PetStorySchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: ['Tip', 'Story'], required: true },
    images: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPetStory>('PetStory', PetStorySchema);
