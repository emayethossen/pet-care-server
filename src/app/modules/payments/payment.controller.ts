import { Request, Response } from 'express';
import Stripe from 'stripe';
import Payment from './payment.model'; // Your Payment model
import PetStory from '../post/post.model'; // Update the path to your PetStory model
import { TUser } from '../user/user.interface';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2022-11-15',
});

// Create a Payment Intent for premium content
export const createPaymentIntent = async (req: Request, res: Response) => {
    const user = req.user as TUser;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { postId } = req.body;

    if (!postId) {
        return res.status(400).json({ message: 'Missing postId.' });
    }

    try {
        // Validate that the postId corresponds to an existing PetStory
        const post = await PetStory.findById(postId);

        if (!post) {
            return res.status(400).json({ message: 'Invalid postId.' });
        }

        // Check if the post is premium
        if (!post.isPremium) {
            return res.status(400).json({ message: 'This content is free and does not require payment.' });
        }

        const amount = 500; // Amount in cents ($5.00)
        const currency = 'usd';

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: {
                userId: user._id.toString(),
                postId,
            },
        });

        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error:any) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};




// Save payment details after payment confirmation
export const savePayment = async (req: Request, res: Response) => {
    const { paymentIntentId, postId } = req.body;
    const user = req.user as TUser;

    if (!paymentIntentId || !user || !postId) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        console.log('Retrieved payment intent:', paymentIntent);
        if (paymentIntent.status === 'succeeded') {
            const payment = new Payment({
                userId: user._id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                paymentStatus: paymentIntent.status, // Match the interface field
                paymentIntentId: paymentIntentId,
                postId: postId,
            });

            await payment.save();

            // Optional: Logic to update post visibility can be added here

            return res.status(201).json({ message: 'Payment successful and saved.' });
        } else {
            return res.status(400).json({ message: 'Payment was not successful.' });
        }
    } catch (error: any) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
