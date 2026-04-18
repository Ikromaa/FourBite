import express from 'express';
import { handleMidtransNotification, checkPaymentStatus, createOrder, getAllOrders, getOrders, getOrderById, updateAnyOrder, updateOrder } from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.get('/getall', getAllOrders)
orderRouter.put('/getall/:id', updateAnyOrder);

// MIDTRANS WEBHOOK - dipanggil server Midtrans, TANPA auth middleware
orderRouter.post('/midtrans-notification', handleMidtransNotification);

// PROTECT REST OF ROUTES USING MIDDLEWARE

orderRouter.use(authMiddleware);

orderRouter.post('/', createOrder);
orderRouter.get('/', getOrders);
orderRouter.get('/payment-status/:orderId', checkPaymentStatus); // ganti /confirm Stripe
orderRouter.get('/:id', getOrderById);
orderRouter.put('/:id', updateOrder);

export default orderRouter
