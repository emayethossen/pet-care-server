export interface IPayment {
    userId: string;  // The user who made the payment
    amount: number;  // Payment amount
    currency: string;  // Currency (e.g., USD)
    status: string;  // Payment status (succeeded, pending, etc.)
    paymentIntentId: string;  // Stripe Payment Intent ID
    createdAt: Date;  // Payment timestamp
    postId: string;  // Premium content ID that user paid for
}
