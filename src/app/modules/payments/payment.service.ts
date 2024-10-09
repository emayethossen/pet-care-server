import Payment from './payment.model'


export const getAllPayments = async () => {
    return await Payment.find().populate('userId postId').sort({ createdAt: -1 });
};
