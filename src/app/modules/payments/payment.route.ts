import express from 'express';
import { createPaymentIntent, fetchAllPayments, savePayment } from './payment.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { adminMiddleware } from '../../middlewares/admin.middleware';

const router = express.Router();

// Route to create a payment intent
router.post('/payments/create-payment-intent', authMiddleware, createPaymentIntent);

// Route to save payment after confirmation
router.post('/payments/save-payment', authMiddleware, savePayment);

router.get('/admin/payments', authMiddleware, adminMiddleware, fetchAllPayments);

export const PaymentRoutes = router;
