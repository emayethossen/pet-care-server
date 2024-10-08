import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'PetStory', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    paymentStatus: { type: String, enum: ['pending', 'succeeded', 'failed'], required: true },
    paymentIntentId: { type: String, required: true }, // Stripe payment intent ID
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Payment', paymentSchema);
