import express from 'express';
import { createPaymentIntent, savePayment } from './payment.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = express.Router();

// Route to create a payment intent
router.post('/payments/create-payment-intent', authMiddleware, createPaymentIntent);

// Route to save payment after confirmation
router.post('/payments/save-payment', authMiddleware, savePayment);

export const PaymentRoutes = router;
