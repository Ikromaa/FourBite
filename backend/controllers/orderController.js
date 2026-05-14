import midtransClient from "midtrans-client";
import mongoose from "mongoose";
import itemModal from "../modals/itemModal.js";
import Order from "../modals/orderModal.js";
import 'dotenv/config';

// Midtrans Snap Client (untuk membuat transaksi)
const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Midtrans Core API Client (untuk verifikasi notifikasi webhook)
const coreApi = new midtransClient.CoreApi({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

//CREATE ORDER FUNCTION
export const createOrder = async (req, res) => {
    try {
        const {
            firstName, lastName, email, phone, address, city, zipCode, items, paymentMethod,
        } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty items array.' });
        }

        if (!['cod', 'online'].includes(paymentMethod)) {
            return res.status(400).json({ message: 'Metode pembayaran tidak valid.' });
        }

        const requestedItems = items.map(({ itemId, item, name, quantity }) => {
            const productId = itemId || item?._id || item?.id;
            const productName = name || item?.name;
            const qty = Number(quantity);

            if (!Number.isInteger(qty) || qty < 1) {
                return null;
            }

            if (productId && mongoose.Types.ObjectId.isValid(productId)) {
                return { productId: productId.toString(), quantity: qty };
            }

            if (typeof productName === 'string' && productName.trim()) {
                return { productName: productName.trim(), quantity: qty };
            }

            return null;
        });

        if (requestedItems.some(item => !item)) {
            return res.status(400).json({ message: 'Item pesanan tidak valid.' });
        }

        const requestedIds = requestedItems
            .filter(item => item.productId)
            .map(item => item.productId);

        const requestedNames = requestedItems
            .filter(item => !item.productId && item.productName)
            .map(item => item.productName);

        const productFilters = [];
        if (requestedIds.length) productFilters.push({ _id: { $in: requestedIds } });
        if (requestedNames.length) productFilters.push({ name: { $in: requestedNames } });

        const products = await itemModal.find({ $or: productFilters }).lean();
        const productsById = new Map(products.map(product => [product._id.toString(), product]));
        const productsByName = new Map(products.map(product => [product.name, product]));

        const orderItems = requestedItems.map(requested => {
            const product = requested.productId
                ? productsById.get(requested.productId)
                : productsByName.get(requested.productName);

            if (!product) return null;

            return {
                productId: product._id.toString(),
                item: {
                    name: product.name,
                    price: Math.round(Number(product.price) || 0),
                    imageUrl: product.imageUrl || '',
                },
                quantity: requested.quantity,
            }
        });

        if (orderItems.some(item => !item)) {
            return res.status(400).json({ message: 'Satu atau lebih item tidak ditemukan.' });
        }

        const subTotal = orderItems.reduce((sum, orderItem) => (
            sum + orderItem.item.price * orderItem.quantity
        ), 0);
        const tax = Math.round(subTotal * 0.05);
        const total = subTotal + tax;

        // DEFAULT SHIPPING COST
        const shippingCost = 0;
        let newOrder;

        if (paymentMethod === 'online') {
            // Buat order dulu di database dengan status pending
            newOrder = new Order({
                user: req.user._id,
                firstName, lastName, phone, email, address, city, zipCode, paymentMethod, subTotal,
                tax, total, shipping: shippingCost, items: orderItems,
                paymentStatus: 'pending'
            });
            await newOrder.save();

            // Buat transaksi Midtrans Snap
            const parameter = {
                transaction_details: {
                    order_id: newOrder._id.toString(),
                    gross_amount: Math.round(total), // total = subTotal + tax
                },
                customer_details: {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                },
                // FIX: item_details harus sama persis dengan gross_amount
                // Tambah tax sebagai line item agar tidak mismatch
                item_details: [
                    ...orderItems.map(o => ({
                        id: o.item.name.replace(/\s+/g, '-').toLowerCase().substring(0, 50),
                        price: Math.round(o.item.price),
                        quantity: o.quantity,
                        name: o.item.name.substring(0, 50),
                    })),
                    {
                        id: 'tax',
                        price: Math.round(tax),
                        quantity: 1,
                        name: 'Tax (5%)',
                    }
                ],
                callbacks: {
                    finish: `${process.env.FRONTEND_URL}/myorder`,
                }
            };

            const snapTransaction = await snap.createTransaction(parameter);

            // Simpan snap token ke order
            newOrder.snapToken = snapTransaction.token;
            await newOrder.save();

            return res.status(201).json({
                order: newOrder,
                snapToken: snapTransaction.token,
                redirectUrl: snapTransaction.redirect_url
            });
        }

        // IF PAYMENT IS DONE COD
        newOrder = new Order({
                user: req.user._id,
                firstName, lastName, phone, email, address, city, zipCode, paymentMethod, subTotal,
                tax, total, 
                shipping: shippingCost, 
                items: orderItems,
                paymentStatus: 'success'
            });
            await newOrder.save();
            return res.status(200).json({ order: newOrder, checkoutUrl: null });

    } 
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// MIDTRANS WEBHOOK NOTIFICATION HANDLER
// Endpoint ini dipanggil otomatis oleh server Midtrans setelah pembayaran
export const handleMidtransNotification = async (req, res) => {
    try {
        // Verifikasi notifikasi dari Midtrans (cek signature key)
        const notification = await coreApi.transaction.notification(req.body);

        const orderId = notification.order_id;           // = MongoDB _id kita
        const transactionStatus = notification.transaction_status;
        const fraudStatus = notification.fraud_status;

        console.log(`Midtrans Notification - Order: ${orderId}, Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

        let paymentStatus = 'pending';

        // Mapping status Midtrans → status kita
        if (transactionStatus === 'capture') {
            paymentStatus = fraudStatus === 'accept' ? 'success' : 'failed';
        } else if (transactionStatus === 'settlement') {
            paymentStatus = 'success';
        } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
            paymentStatus = 'failed';
        } else if (transactionStatus === 'pending') {
            paymentStatus = 'pending';
        }

        // Update status order di database
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                paymentStatus,
                transactionId: notification.transaction_id,
            },
            { new: true }
        );

        if (!updatedOrder) {
            console.error(`Order tidak ditemukan: ${orderId}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log(`Order ${orderId} updated → paymentStatus: ${paymentStatus}`);
        return res.status(200).json({ message: 'OK' });
    }
    catch (err) {
        console.error('Midtrans notification error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// CEK STATUS PEMBAYARAN (untuk polling dari frontend / testing lokal tanpa webhook)
export const checkPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Ambil status langsung dari Midtrans
        const statusResponse = await coreApi.transaction.status(orderId);
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        let paymentStatus = 'pending';
        if (transactionStatus === 'capture') {
            paymentStatus = fraudStatus === 'accept' ? 'success' : 'failed';
        } else if (transactionStatus === 'settlement') {
            paymentStatus = 'success';
        } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
            paymentStatus = 'failed';
        }

        // Update dan kembalikan order
        const order = await Order.findByIdAndUpdate(
            orderId,
            { paymentStatus, transactionId: statusResponse.transaction_id },
            { new: true }
        );

        if (!order) return res.status(404).json({ message: 'Order not found' });
        return res.json({ order, transactionStatus, paymentStatus });
    }
    catch (err) {
        console.error('checkPaymentStatus error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
}

// GET ORDER 
export const getOrders = async (req, res) => {
    try {
        const filter = { user: req.user._id }; //pesanan milik user tertentu
        const rawOrders = await Order.find(filter).sort({ createdAt: -1 }).lean()

        // FORMAT
        const formatted = rawOrders.map(o => ({
            ...o,
            items: o.items.map(i => ({
                _id: i._id,
                item: i.item,
                quantity: i.quantity
            })),
            createdAt: o.createdAt,
            paymentStatus: o.paymentStatus,
        }));
        res.json(formatted);
    } 
    catch (error) {
        console.error('getOrders Errors', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

// ADMIN ROUTES GET ALL ORDERS
export const getAllOrders = async (req, res) => {
    try {
        const raw = await Order
        .find({})
        .sort({ createdAt: -1 })
        .lean()

    const formatted = raw.map(o => ({
        _id: o._id,
        user: o.user,
        firstName: o.firstName,
        lastName: o.lastName,
        email: o.email,
        phone: o.phone,
        address: o.address ?? o.shippingAddress?.address ?? '',
        city: o.city ?? o.shippingAddress?.city ?? '',
        zipCode: o.zipCode ?? o.shippingAddress?.zipCode ?? '',

        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        status: o.status,
        createdAt: o.createdAt,

        items: o.items.map(i => ({
            _id: i._id,
            item: i.item,
            quantity: i.quantity
        }))
    }));

    res.json(formatted);
    } 
    catch (error) {
        console.error('getAllOrders Errors', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

// UPDATE ORDER WITHOUT TOKEN FOR ADMIN
export const updateAnyOrder = async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(updated)
    } 
    catch (error) {
        console.error('updateAnyOrder Errors', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

// GET ORDER BY ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (!order.user.equals(req.user._id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (req.query.email && order.email !== req.query.email) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(order);
    } 
    catch (error) {
        console.error('getOrderById Errors', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

// UPDATE ORDER BY ID
export const updateOrder = async (req, res) => {
        try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (!order.user.equals(req.user._id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (req.body.email && order.email !== req.body.email) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } 
    catch (error) {
        console.error('getOrderById Errors', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}
